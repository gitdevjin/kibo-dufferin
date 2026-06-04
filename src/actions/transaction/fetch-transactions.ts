import { Transaction } from "@/types";

export async function fetchTransactions({
  from,
  to,
  dateBefore,
}: {
  from: number;
  to: number;
  dateBefore?: Date;
}): Promise<Transaction[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token Missing");

  const params = new URLSearchParams({
    from: String(from),
    to: String(to),
  });

  if (dateBefore) {
    params.append("dateBefore", dateBefore.toISOString());
  }

  const res = await fetch(`/api/transaction?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Something Went Wrong(actions)");

  return res.json();
}
