"use client";

import { useInfiniteTransactionsQuery } from "@/hooks/queries/use-infinite-transaction";
import { useDeleteTransaction } from "@/hooks/mutations/transaction/use-delete-transaction";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Loading from "../fallback/loading";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TransactionFeed({ dateBefore }: { dateBefore?: Date }) {
  const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
    useInfiniteTransactionsQuery({ dateBefore });

  const { mutate: deleteTransaction } = useDeleteTransaction({
    onSuccess: () => toast.success("Transaction deleted"),
    onError: (error) => toast.error(error.message, { position: "top-center" }),
  });

  const { ref, inView } = useInView({ threshold: 0, rootMargin: "100px" });

  useEffect(() => {
    if (inView && !isFetchingNextPage) fetchNextPage();
  }, [inView, isFetchingNextPage]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Something went wrong.</div>;

  const allTransactions = data.pages.flat();

  if (!allTransactions.length) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 @container">
      {/* Desktop table */}
      <div className="hidden @md:block">
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
            {allTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`border-b ${transaction.type === "Sale" ? "hover:bg-blue-50" : "hover:bg-orange-50"}`}
              >
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-md px-2 py-1 text-sm font-medium ${transaction.type === "Sale" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}
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
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 @md:hidden">
        {allTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`rounded-xl border p-4 ${transaction.type === "Sale" ? "border-blue-100 bg-blue-50/50" : "border-orange-100 bg-orange-50/50"}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span
                  className={`w-fit rounded-md px-2 py-0.5 text-xs font-medium ${transaction.type === "Sale" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}
                >
                  {transaction.type}
                </span>
                <p className="font-medium text-sm mt-1">
                  {transaction.product.company} — {transaction.product.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-lg font-bold">×{transaction.qty}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="cursor-pointer text-destructive hover:text-destructive h-7 w-7 p-0"
                  onClick={() => deleteTransaction(transaction.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loading />
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}
