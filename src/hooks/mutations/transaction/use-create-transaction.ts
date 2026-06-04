import { createTransaction } from "@/actions/transaction/create-transaction";
import { QUERY_KEYS } from "@/lib/const";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTransaction(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (createdTransaction) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.product.all,
      });
      queryClient.resetQueries({
        queryKey: ["transactions"],
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
