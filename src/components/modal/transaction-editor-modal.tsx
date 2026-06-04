"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTransactionEditorModalStore } from "@/store/transction-editor-modal-store";
import { useCreateTransaction } from "@/hooks/mutations/transaction/use-create-transaction";
import { Minus, Plus } from "lucide-react";

export default function TransactionEditorModal() {
  const store = useTransactionEditorModalStore();
  const [qty, setQty] = useState("1");

  const { mutate: createTransaction, isPending } = useCreateTransaction({
    onSuccess: () => {
      store.actions.close();
      toast.success("Transaction created successfully");
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-center" });
    },
  });

  useEffect(() => {
    if (!store.isOpen) return;
    setQty("1");
  }, [store.isOpen]);

  const handleSave = () => {
    if (!store.isOpen) return;

    const parsedQty = parseInt(qty);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      toast.error("Quantity must be a valid number", {
        position: "top-center",
      });
      return;
    }

    createTransaction({
      productId: store.productId,
      type: store.type,
      qty: parsedQty,
    });
  };

  const increment = () => setQty((prev) => String(parseInt(prev) + 1 || 1));
  const decrement = () =>
    setQty((prev) => String(Math.max(1, parseInt(prev) - 1 || 1)));

  return (
    <Dialog open={store.isOpen} onOpenChange={store.actions.close}>
      <DialogContent className="sm:max-w-lg min-h-65">
        <DialogTitle className="text-2xl font-bold">
          {store.isOpen && (
            <>
              <span
                className={
                  store.type === "Sale" ? "text-blue-500" : "text-orange-400"
                }
              >
                {store.type}
              </span>
              {` — ${store.productName}`}
            </>
          )}
        </DialogTitle>

        {store.isOpen && (
          <div className="flex flex-col gap-8">
            <p className="text-muted-foreground text-xl">
              Current stock:{" "}
              <span className="font-medium text-foreground">
                {store.currentQty}
              </span>
            </p>

            <div className="flex items-center gap-10">
              <Button
                variant="outline"
                size="icon"
                onClick={decrement}
                className="cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="text-center text-2xl"
                placeholder="1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={increment}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleSave}
              disabled={isPending}
              className={`cursor-pointer ${store.type === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
            >
              {isPending ? "Saving..." : store.type}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
