export async function fetchSalesByProduct({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): Promise<{
  data: {
    productId: number;
    qty: number;
    name: string;
    company: string;
    revenue: number;
  }[];
  totalUnits: number;
  totalRevenue: number;
}> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token Missing");

  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
  });

  const res = await fetch(
    `/api/statistics/sales-by-products?${params.toString()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Something Went Wrong(actions)");

  return res.json();
}
