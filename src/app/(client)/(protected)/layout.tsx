import NavProvider from "@/provider/nav-provider";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <NavProvider>{children}</NavProvider>;
}
