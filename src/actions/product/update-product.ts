import { Product } from "@/types";

export async function updateProduct({
  company,
  name,
  costPrice,
  sellingPrice,
  dufferinComment,
  contactComment,
  qty,
}: Product) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch("/api/product", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      company,
      name,
      costPrice,
      sellingPrice,
      dufferinComment,
      contactComment,
      qty,
    }),
  });

  if (!res.ok) return null;

  return res.json();
}
