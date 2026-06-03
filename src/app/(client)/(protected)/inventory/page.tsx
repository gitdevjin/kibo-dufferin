"use client";
import CreateProductButton from "@/components/product/create-product-button";
import ProductList from "@/components/product/product-list";

export default function ProductPage() {
  return (
    <div>
      <div className="flex max-w-60 justify-center items-center">
        <CreateProductButton />
      </div>
      <div className="w-full">
        <ProductList />
      </div>
    </div>
  );
}
