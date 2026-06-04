import { CreateProductInput } from "@/types";

export async function createProduct({
  company,
  name,
  category,
  costPrice,
  sellingPrice,
  dufferinComment,
  contactComment,
  qty,
}: CreateProductInput) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token Missing");

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

  if (!res.ok) throw new Error("Something Went Wrong(actions)");

  return res.json();
}
