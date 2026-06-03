"use client";

import { useProductModalActions } from "@/store/product-editor-modal-store";
import { Barcode, PlusCircleIcon } from "lucide-react";
import planet from "@/assets/planet.png";

export default function CreateProductButton() {
  const openCreateProductModal = useProductModalActions();
  return (
    <div
      onClick={openCreateProductModal.openCreate}
      className="bg-muted text-muted-foreground m-4 cursor-pointer rounded-xl px-8 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Barcode />
          <span>Add Product</span>
        </div>
      </div>
    </div>
  );
}
