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
import { useCreateTransaction } from "@/hooks/mutations/transaction/use-create-transaction";
import { useTransactionEditorModalActions } from "@/store/transction-editor-modal-store";

export default function ProductList() {
  const {
    data: products,
    error: isFetchProductsError,
    isPending: isFetchProductsPending,
  } = useProductsQuery({ orderBy: "company" });

  const { openEdit } = useProductModalActions();
  const { open } = useTransactionEditorModalActions();

  if (isFetchProductsPending) return <div>Loading...</div>;
  if (isFetchProductsError) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col gap-4 @container">
      {/* Desktop table */}
      <div className="hidden @md:block">
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
                  colSpan={7}
                  className="text-muted-foreground py-10 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className={`cursor-pointer text-lg ${
                    product.qty <= 0
                      ? "bg-pink-50 hover:bg-pink-100"
                      : product.qty <= 3
                        ? "bg-yellow-50 hover:bg-yellow-100"
                        : "hover:bg-muted/50"
                  }`}
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
                    {product.name.length > 45
                      ? `${product.name.slice(0, 45)}...`
                      : product.name}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.costPrice?.toFixed(2)}</TableCell>
                  <TableCell>${product.sellingPrice?.toFixed(2)}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell className="flex justify-center items-center gap-2">
                    <Button
                      disabled={product.qty <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        open({
                          type: "Sale",
                          productId: product.id,
                          productName: product.name,
                          currentQty: product.qty,
                        });
                      }}
                      className="bg-blue-400 rounded-md cursor-pointer"
                    >
                      Sale
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        open({
                          type: "Restock",
                          productId: product.id,
                          productName: product.name,
                          currentQty: product.qty,
                        });
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

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 @md:hidden">
        {!products?.length ? (
          <div className="text-muted-foreground py-10 text-center">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
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
              className={`rounded-xl border p-4 cursor-pointer ${
                product.qty <= 0
                  ? "border-pink-200 bg-pink-50"
                  : product.qty <= 3
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">{product.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <div className="flex gap-3 mt-1 text-sm">
                    <span>
                      Cost:{" "}
                      <span className="font-mono">
                        ${product.costPrice.toFixed(2)}
                      </span>
                    </span>
                    <span>
                      Price:{" "}
                      <span className="font-mono">
                        ${product.sellingPrice.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-xl font-bold ${product.qty <= 0 ? "text-red-500" : product.qty <= 3 ? "text-yellow-600" : ""}`}
                  >
                    {product.qty}
                  </span>
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      disabled={product.qty <= 0}
                      size="sm"
                      onClick={() =>
                        open({
                          type: "Sale",
                          productId: product.id,
                          productName: product.name,
                          currentQty: product.qty,
                        })
                      }
                      className="bg-blue-400 rounded-md cursor-pointer text-xs"
                    >
                      Sale
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        open({
                          type: "Restock",
                          productId: product.id,
                          productName: product.name,
                          currentQty: product.qty,
                        })
                      }
                      className="bg-orange-400 rounded-md cursor-pointer text-xs"
                    >
                      Restock
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
