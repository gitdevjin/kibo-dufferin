"use client";
import { fetchProducts } from "@/actions/product/fetch-products";
import { QUERY_KEYS } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";

export function useProductsQuery({ orderBy }: { orderBy: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.product.all,
    queryFn: () => fetchProducts({ orderBy }),
  });
}
