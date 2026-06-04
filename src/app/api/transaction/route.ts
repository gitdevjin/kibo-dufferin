import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { CreateTransactionInput } from "@/types";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { productId, type, qty }: CreateTransactionInput =
    (await req.json()) as CreateTransactionInput;

  if (!type || !qty || !productId) {
    return NextResponse.json(
      { error: "Missing ProductId, type, or quantity" },
      { status: 400 },
    );
  }

  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: { productId, type, qty },
    }),
    type === "Sale"
      ? prisma.product.update({
          where: {
            id: productId,
            qty: { gte: qty }, // only check for sale
          },
          data: { qty: { increment: -qty } },
        })
      : prisma.product.update({
          where: { id: productId }, // no qty check for restock
          data: { qty: { increment: qty } },
        }),
  ]);
  return NextResponse.json(transaction, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = auth.split(" ")[1];
    verifyToken(token);

    const url = new URL(req.url);
    const fromParam = url.searchParams.get("from");
    const toParam = url.searchParams.get("to");
    const dateBeforeParam = url.searchParams.get("dateBefore");

    if (!fromParam || !toParam) {
      return NextResponse.json(
        { error: "Missing query parameters" },
        { status: 400 },
      );
    }

    const from = parseInt(fromParam);
    const to = parseInt(toParam);

    if (isNaN(from) || isNaN(to)) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    let dateBefore: Date | undefined;
    if (dateBeforeParam) {
      const parsed = new Date(dateBeforeParam);
      dateBefore = new Date(parsed);
      dateBefore.setHours(23, 59, 59, 999);
    }

    const transactions = await prisma.transaction.findMany({
      where: dateBefore ? { createdAt: { lte: dateBefore } } : undefined,
      orderBy: { createdAt: "desc" },
      skip: from,
      take: to - from + 1,
      include: {
        product: {
          select: { name: true, company: true },
        },
      },
    });

    return NextResponse.json(transactions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
