"use client";

import { useState, useMemo } from "react";
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
import { useProductModalActions } from "@/store/product-editor-modal-store";
import { useTransactionEditorModalActions } from "@/store/transction-editor-modal-store";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortField = "qty" | "company";
type SortDirection = "asc" | "desc";

type SortOption = {
  label: string;
  field: SortField;
  direction: SortDirection;
};

const SORT_OPTIONS: SortOption[] = [
  { label: "Default (Company A–Z)", field: "company", direction: "asc" },
  { label: "Company Z–A", field: "company", direction: "desc" },
  { label: "Qty: Lowest first", field: "qty", direction: "asc" },
  { label: "Qty: Highest first", field: "qty", direction: "desc" },
];

type DesktopSort = {
  field: "company" | "qty";
  direction: "asc" | "desc";
} | null;

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction?: "asc" | "desc";
}) {
  if (!active)
    return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-40" />;
  if (direction === "asc") return <ArrowUp className="inline w-4 h-4 ml-1" />;
  return <ArrowDown className="inline w-4 h-4 ml-1" />;
}

export default function ProductList() {
  const {
    data: products,
    error: isFetchProductsError,
    isPending: isFetchProductsPending,
  } = useProductsQuery({ orderBy: "company" });

  const { openEdit } = useProductModalActions();
  const { open } = useTransactionEditorModalActions();

  // Desktop: null = default (company asc)
  const [desktopSort, setDesktopSort] = useState<DesktopSort>(null);

  // Mobile: full sort select
  const [mobileSortKey, setMobileSortKey] = useState<string>("default");

  const handleCompanyHeaderClick = () => {
    setDesktopSort((prev) => {
      // default (null) is already company asc → first click goes Z–A (desc)
      if (!prev || prev.field !== "company")
        return { field: "company", direction: "desc" };
      return {
        field: "company",
        direction: prev.direction === "desc" ? "asc" : "desc",
      };
    });
  };

  const handleQtyHeaderClick = () => {
    setDesktopSort((prev) => {
      if (!prev || prev.field !== "qty")
        return { field: "qty", direction: "asc" };
      return {
        field: "qty",
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    return [...products].sort((a, b) => {
      if (desktopSort?.field === "qty") {
        return desktopSort.direction === "asc" ? a.qty - b.qty : b.qty - a.qty;
      }
      if (desktopSort?.field === "company") {
        const cmp = a.company.localeCompare(b.company);
        return desktopSort.direction === "asc" ? cmp : -cmp;
      }
      // default: company asc
      return a.company.localeCompare(b.company);
    });
  }, [products, desktopSort]);

  const mobileSortedProducts = useMemo(() => {
    if (!products) return [];
    const option = SORT_OPTIONS.find(
      (o) => `${o.field}-${o.direction}` === mobileSortKey,
    );
    if (!option) return [...products];
    return [...products].sort((a, b) => {
      if (option.field === "qty") {
        return option.direction === "asc" ? a.qty - b.qty : b.qty - a.qty;
      }
      const cmp = a.company.localeCompare(b.company);
      return option.direction === "asc" ? cmp : -cmp;
    });
  }, [products, mobileSortKey]);

  const companyActive = desktopSort?.field === "company";
  const qtyActive = desktopSort?.field === "qty";

  if (isFetchProductsPending) return <div>Loading...</div>;
  if (isFetchProductsError) return <div>Something went wrong.</div>;

  const renderRow = (product: (typeof sortedProducts)[0]) => (
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
          isActive: product.isActive,
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
  );

  return (
    <div className="flex flex-col gap-4 @container">
      {/* Desktop table */}
      <div className="hidden @md:block">
        <Table>
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap hover:text-foreground transition-colors"
                onClick={handleCompanyHeaderClick}
              >
                Company
                <SortIcon
                  active={companyActive}
                  direction={desktopSort?.direction}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap hover:text-foreground transition-colors"
                onClick={handleQtyHeaderClick}
              >
                Qty
                <SortIcon
                  active={qtyActive}
                  direction={desktopSort?.direction}
                />
              </TableHead>
              <TableHead className="text-center">...</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!sortedProducts.length ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground py-10 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts.map(renderRow)
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 @md:hidden">
        {/* Sort select */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="mobile-sort"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Sort by:
          </label>
          <select
            id="mobile-sort"
            value={mobileSortKey}
            onChange={(e) => setMobileSortKey(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="default">Default (Company A–Z)</option>
            <option value="company-desc">Company Z–A</option>
            <option value="qty-asc">Qty: Lowest first</option>
            <option value="qty-desc">Qty: Highest first</option>
          </select>
        </div>

        {!mobileSortedProducts.length ? (
          <div className="text-muted-foreground py-10 text-center">
            No products found.
          </div>
        ) : (
          mobileSortedProducts.map((product) => (
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
                  isActive: product.isActive,
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
                    className={`text-xl font-bold ${
                      product.qty <= 0
                        ? "text-red-500"
                        : product.qty <= 3
                          ? "text-yellow-600"
                          : ""
                    }`}
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
