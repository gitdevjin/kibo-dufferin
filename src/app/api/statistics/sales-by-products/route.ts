import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = auth.split(" ")[1];
    verifyToken(token);

    const url = new URL(req.url);
    const startParam = url.searchParams.get("start");
    const endParam = url.searchParams.get("end");

    if (!startParam || !endParam) {
      return NextResponse.json(
        { error: "Missing start or end query parameters" },
        { status: 400 },
      );
    }

    const start = new Date(startParam);
    const end = new Date(endParam);
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date parameters" },
        { status: 400 },
      );
    }

    const grouped = await prisma.transaction.groupBy({
      by: ["productId"],
      where: {
        type: "Sale",
        createdAt: { gte: start, lte: end },
      },
      _sum: { qty: true },
    });

    const productIds = grouped.map((g) => g.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, company: true, sellingPrice: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const data = grouped
      .map((g) => {
        const product = productMap.get(g.productId);
        const qty = g._sum.qty ?? 0;
        const sellingPrice = product?.sellingPrice ?? 0;
        return {
          productId: g.productId,
          qty,
          name: product?.name ?? `Product ${g.productId}`,
          company: product?.company ?? "Unknown",
          revenue: qty * sellingPrice,
        };
      })
      .sort((a, b) => b.qty - a.qty);

    return NextResponse.json({
      data,
      totalUnits: data.reduce((sum, d) => sum + d.qty, 0),
      totalRevenue: data.reduce((sum, d) => sum + d.revenue, 0),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
