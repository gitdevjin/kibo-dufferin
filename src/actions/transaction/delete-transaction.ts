export async function deleteTransaction(id: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token Missing");

  const res = await fetch(`/api/transaction/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Something went wrong");

  return res.json();
}
