import { useQuery } from "@tanstack/react-query";
import { fetchSalesByProduct } from "@/actions/statistics/fetch-sales-by-products"; // adjust to your actual path
import { QUERY_KEYS } from "@/lib/const";

export function useSalesByProductsQuery(start: Date, end: Date) {
  return useQuery({
    queryKey: QUERY_KEYS.statistics.byProductsAndDates(
      start.toISOString(),
      end.toISOString(),
    ),
    queryFn: () => fetchSalesByProduct({ start, end }),
  });
}
