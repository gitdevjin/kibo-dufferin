import { Product } from "@/types";

export async function fetchProducts({
  orderBy,
}: {
  orderBy: string;
}): Promise<Product[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token Missing");

  const res = await fetch(`/api/product?orderBy=${orderBy}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error");

  return res.json(); // products[]
}
