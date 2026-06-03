"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProductEditorModalStore } from "@/store/product-editor-modal-store";
import { useCreateProduct } from "@/hooks/mutations/product/use-create-product";
import { useUpdateProduct } from "@/hooks/mutations/product/use-update-product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const CATEGORIES = ["Mask", "Others"] as const;

export default function ProductEditorModal() {
  const store = useProductEditorModalStore();

  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [qty, setQty] = useState("");
  const [dufferinComment, setDufferinComment] = useState("");
  const [contactComment, setContactComment] = useState("");

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct({
    onSuccess: () => {
      store.actions.close();
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-center" });
    },
  });

  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct({
    onSuccess: () => {
      store.actions.close();
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-center" });
    },
  });

  // Populate fields when editing
  useEffect(() => {
    if (!store.isOpen) return;

    if (store.type === "Edit") {
      setCompany(store.company);
      setCategory(store.category);
      setName(store.name);
      setCostPrice(store.costPrice.toString());
      setSellingPrice(store.sellingPrice.toString());
      setQty(store.qty.toString());
      setDufferinComment(store.dufferinComment);
      setContactComment(store.contactComment);
    } else {
      setCompany("");
      setCategory("");
      setName("");
      setCostPrice("");
      setSellingPrice("");
      setQty("");
      setDufferinComment("");
      setContactComment("");
    }
  }, [store.isOpen]);

  const isPending = isCreating || isUpdating;

  const handleSave = () => {
    if (!name.trim() || !company.trim()) {
      toast.error("Name and company are required", { position: "top-center" });
      return;
    }

    if (costPrice !== "" && isNaN(parseFloat(costPrice))) {
      toast.error("Cost price must be a valid number", {
        position: "top-center",
      });
      return;
    }

    if (sellingPrice !== "" && isNaN(parseFloat(sellingPrice))) {
      toast.error("Selling price must be a valid number", {
        position: "top-center",
      });
      return;
    }

    if (qty !== "" && isNaN(parseInt(qty))) {
      toast.error("Quantity must be a valid number", {
        position: "top-center",
      });
      return;
    }

    const data = {
      company,
      name,
      category,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      qty: parseInt(qty) || 0,
      dufferinComment,
      contactComment,
    };

    if (store.type === "Create") {
      console.log(category);
      createProduct(data);
    } else if (store.type === "Edit") {
      updateProduct({ id: store.productId, ...data });
    }
  };

  return (
    <Dialog open={store.isOpen} onOpenChange={store.actions.close}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogTitle>{store.type} Product</DialogTitle>

        <div className="flex flex-col gap-4">
          {/* Company */}
          <div className="flex flex-col gap-1">
            <Label>Company</Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label>Product Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(val) => {
                console.log("selected:", val);
                setCategory(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cost Price & Selling Price */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1">
              <Label>Cost Price</Label>
              <Input
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label>Selling Price</Label>
              <Input
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Qty */}
          <div className="flex flex-col gap-1">
            <Label>Quantity</Label>
            <Input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Dufferin Comment */}
          <div className="flex flex-col gap-1">
            <Label>Dufferin Comment</Label>
            <textarea
              value={dufferinComment}
              onChange={(e) => setDufferinComment(e.target.value)}
              className="bg-secondary min-h-20 rounded-lg p-2 text-sm focus:outline-none"
              placeholder="comment from dufferin..."
            />
          </div>

          {/* Contact Comment */}
          <div className="flex flex-col gap-1">
            <Label>Contact Comment</Label>
            <textarea
              value={contactComment}
              onChange={(e) => setContactComment(e.target.value)}
              className="bg-secondary min-h-20 rounded-lg p-2 text-sm focus:outline-none"
              placeholder="comment from contact..."
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
