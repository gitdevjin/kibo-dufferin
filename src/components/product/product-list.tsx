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
import {
  useProductEditorModalStore,
  useProductModalActions,
} from "@/store/product-editor-modal-store";

export default function ProductList() {
  const {
    data: products,
    error: isFetchProductsError,
    isPending: isFetchProductsPending,
  } = useProductsQuery({ orderBy: "company" });

  const { openEdit } = useProductModalActions();

  if (isFetchProductsPending) return <div>Loading...</div>;
  if (isFetchProductsError) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between"></div>
      <Table>
        <TableHeader>
          <TableRow className="text-lg">
            <TableHead>Company</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead className="text-center">...</TableHead>
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
                className={`cursor-pointer hover:bg-muted/50 ${product.qty <= 0 ? "bg-pink-50 hover:bg-pink-100" : ""} text-lg`}
                onClick={() =>
                  openEdit({
                    productId: product.id,
                    company: product.company,
                    category: product.category,
                    name: product.name,
                    costPrice: product.costPrice,
                    sellingPrice: product.sellingPrice,
                    qty: product.qty,
                    dufferinComment: product.dufferinComment,
                    contactComment: product.contactComment,
                  })
                }
              >
                <TableCell>{product.company}</TableCell>
                <TableCell className="font-medium">
                  {" "}
                  {product.name.length > 40
                    ? `${product.name.slice(0, 40)}...`
                    : product.name}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.costPrice?.toFixed(2)}</TableCell>
                <TableCell>${product.sellingPrice?.toFixed(2)}</TableCell>
                <TableCell>{product.qty}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <Button
                    disabled={product.qty <= 0}
                    onClick={(e) => {
                      e.stopPropagation(); // ← stops row click from firing
                      console.log("Sale Button Clicked");
                    }}
                    className="bg-blue-400 rounded-md cursor-pointer mr-2"
                  >
                    Sale
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // ← stops row click from firing
                      console.log("Restock Button Clicked");
                    }}
                    className="bg-orange-400 rounded-md cursor-pointer"
                  >
                    Restock
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
