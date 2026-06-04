import { CreateProductInput, CreateTransactionInput } from "@/types";

export async function createTransaction({
  productId,
  type,
  qty,
}: CreateTransactionInput) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch("/api/transaction", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      productId,
      type,
      qty,
    }),
  });

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
}
