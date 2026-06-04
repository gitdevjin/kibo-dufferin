import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Product } from "@/types";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const {
    company,
    name,
    category,
    costPrice,
    sellingPrice,
    qty,
    dufferinComment,
    contactComment,
  }: Product = (await req.json()) as Product;

  if (!company || !name) {
    return NextResponse.json(
      { error: "Missing Company or Product Name" },
      { status: 400 },
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      company: company ?? "",
      category: category ?? "",
      costPrice: costPrice ?? 0,
      sellingPrice: sellingPrice ?? 0,
      qty: qty ?? 0,
      dufferinComment: dufferinComment ?? "",
      contactComment: contactComment ?? "",
    },
  });

  return NextResponse.json(product, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = auth.split(" ")[1];
    verifyToken(token);

    // --- Extract query params ---
    const url = new URL(req.url);
    let orderBy = url.searchParams.get("orderBy");

    if (!orderBy) {
      orderBy = "company";
    }
    // --- Fetch messages ---
    const products = await prisma.product.findMany({
      orderBy: [{ [orderBy]: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const {
    id,
    company,
    name,
    category,
    costPrice,
    sellingPrice,
    qty,
    dufferinComment,
    contactComment,
  }: Product = (await req.json()) as Product;

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      company,
      category,
      costPrice,
      sellingPrice,
      qty,
      dufferinComment,
      contactComment,
    },
  });

  return NextResponse.json(product);
}
