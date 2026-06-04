import { fetchTransactions } from "@/actions/transaction/fetch-transactions";
import { QUERY_KEYS } from "@/lib/const";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 3;

export function useInfiniteTransactionsQuery({
  dateBefore,
}: {
  dateBefore: Date | undefined;
}) {
  return useInfiniteQuery({
    queryKey: dateBefore
      ? QUERY_KEYS.transaction.byDate(dateBefore.toISOString())
      : QUERY_KEYS.transaction.all,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      return fetchTransactions({ from, to, dateBefore });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: Infinity,
  });
}
