import AlertModal from "@/components/modal/alert-modal";
import ProductEditorModal from "@/components/modal/product-editor-modal";
import TransactionEditorModal from "@/components/modal/transaction-editor-modal";
import NavProvider from "@/provider/nav-provider";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <AlertModal />
      <ProductEditorModal />
      <TransactionEditorModal />
      {children}
    </NavProvider>
  );
}
