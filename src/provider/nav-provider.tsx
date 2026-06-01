"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";
import { useSession } from "@/hooks/queries/use-session";
import { SidebarProvider } from "@/components/ui/sidebar";
import SideMenu from "@/components/parts/side-menu";

export default function NavProvider({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/auth/login");
    }
  }, [isPending, user, router]);

  //   if (isPending) return <GlobalLoading />;
  if (!user) return null;

  return (
    <SidebarProvider>
      <SideMenu />
      <main className="w-full flex-3 justify-center px-1 pb-4">
        <div className="mx-auto flex w-full max-w-300 flex-col px-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
