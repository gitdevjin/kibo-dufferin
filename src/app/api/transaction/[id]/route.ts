import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ← await params

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: parseInt(id) },
  });

  if (!transaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 },
    );
  }

  await prisma.$transaction([
    prisma.product.update({
      where: { id: transaction.productId },
      data: {
        qty: {
          increment:
            transaction.type === "Sale" ? transaction.qty : -transaction.qty,
        },
      },
    }),
    prisma.transaction.delete({
      where: { id: parseInt(id) },
    }),
  ]);

  return NextResponse.json(transaction);
}
