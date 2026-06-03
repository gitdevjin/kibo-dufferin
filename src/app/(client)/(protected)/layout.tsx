import ProductEditorModal from "@/components/modal/product-editor-modal";
import NavProvider from "@/provider/nav-provider";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <ProductEditorModal />
      {children}
    </NavProvider>
  );
}
