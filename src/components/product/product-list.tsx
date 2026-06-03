"use client";

import { useProductsQuery } from "@/hooks/queries/use-product-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

export default function ProductList() {
  const {
    data: products,
    error: isFetchProductsError,
    isPending: isFetchProductsPending,
  } = useProductsQuery({ orderBy: "company" });

  if (isFetchProductsPending) return <div>Loading...</div>;
  if (isFetchProductsError) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between"></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!products?.length ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-muted-foreground py-10 text-center"
              >
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>{product.company}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.costPrice?.toFixed(2)}</TableCell>
                <TableCell>${product.sellingPrice?.toFixed(2)}</TableCell>
                <TableCell>{product.qty}</TableCell>
                <TableCell>
                  <Button>Sale</Button>
                  <Button>Restock</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
