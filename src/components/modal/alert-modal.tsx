"use client";
import { useAlertModal } from "@/store/alert-modal-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function AlertModal() {
  const store = useAlertModal();
  if (!store.isOpen) return null;

  const handleCancel = () => {
    if (store.onNegative) store.onNegative();
    store.actions.close();
  };
  const handleAction = () => {
    if (store.onPositive) store.onPositive();
    store.actions.close();
  };
  return (
    <AlertDialog open={store.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{store.title}</AlertDialogTitle>
          <AlertDialogDescription>{store.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={handleAction}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
