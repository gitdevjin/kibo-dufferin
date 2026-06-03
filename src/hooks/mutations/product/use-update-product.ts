import { updateProduct } from "@/actions/product/update-product";
import { QUERY_KEYS } from "@/lib/const";
import type { MutationCallbacks, Product } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProduct(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      queryClient.setQueryData<Product>(
        QUERY_KEYS.product.byId(updatedProduct.id),
        (prevProduct) => {
          if (!prevProduct)
            throw new Error(
              `${updatedProduct.id} Post Doesn't exist in Cache Data`,
            );
          return { ...prevProduct, ...updatedProduct };
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
