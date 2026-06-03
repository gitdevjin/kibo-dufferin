import { Product } from "@/types";

export async function createProduct({
  company,
  name,
  category,
  costPrice,
  sellingPrice,
  dufferinComment,
  contactComment,
  qty,
}: Product) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch("/api/product", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      company,
      name,
      category,
      costPrice,
      sellingPrice,
      dufferinComment,
      contactComment,
      qty,
    }),
  });

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
}
