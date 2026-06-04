"use client";

import { useInfiniteTransactionsQuery } from "@/hooks/queries/use-infinite-transaction";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Loading from "../fallback/loading";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export default function TransactionFeed({ dateBefore }: { dateBefore?: Date }) {
  const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
    useInfiniteTransactionsQuery({ dateBefore });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage) fetchNextPage();
  }, [inView, isFetchingNextPage]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col">
      <table className="w-full text-lg">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-3 pr-4">Type</th>
            <th className="py-3 pr-4">Product</th>
            <th className="py-3 pr-4">Qty</th>
            <th className="py-3">Date</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.pages.map((page) =>
            page.map((transaction) => (
              <tr
                key={transaction.id}
                className={`border-b ${transaction.type === "Sale" ? "hover:bg-blue-50" : "hover:bg-orange-50"}`}
              >
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-md px-2 py-1 text-sm font-medium ${
                      transaction.type === "Sale"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  {`${transaction.product.company} — ${transaction.product.name}`
                    .length > 55
                    ? `${`${transaction.product.company} — ${transaction.product.name}`.slice(0, 55)}...`
                    : `${transaction.product.company} — ${transaction.product.name}`}
                </td>
                <td className="py-3 pr-4">{transaction.qty}</td>
                <td className="py-3 text-muted-foreground text-sm">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
                <td className="py-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer text-destructive hover:text-destructive"
                    onClick={() => console.log("delete", transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>

      {!data.pages[0].length && (
        <div className="text-muted-foreground py-10 text-center">
          No transactions found.
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loading />
        </div>
      )}
      <div id="ref" ref={ref} />
    </div>
  );
}
