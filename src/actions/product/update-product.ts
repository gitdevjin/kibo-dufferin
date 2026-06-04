import { Product } from "@/types";

export async function updateProduct({
  id,
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
  if (!token) throw new Error("Token Missing");

  const res = await fetch("/api/product", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id,
      company,
      category,
      name,
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
