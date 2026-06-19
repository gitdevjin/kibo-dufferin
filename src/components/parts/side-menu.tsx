"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  Home,
  ScanBarcode,
} from "lucide-react";
import Link from "next/link";

const getItems = () => [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: ScanBarcode,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: ChartNoAxesCombined,
  },
];

export default function SideMenu() {
  const items = getItems();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent className="p-6">
        <SidebarGroup className="gap-2">
          <SidebarGroupLabel className="mb-2 text-2xl">
            {/* <img className="h-7 opacity-50" src={logo} alt="Logo of StarLog" /> */}
            <span className="bg-linear-to-r from-green-700 via-emerald-500-300 to-green-400 bg-clip-text text-xl font-bold text-transparent">
              &nbsp;&nbsp;KIBO&nbsp;Dufferin
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4 p-2 pr-0">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="min-h-11 [&>svg]:h-6 [&>svg]:w-6 cursor-pointer"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-4"
                      onClick={() => setOpenMobile(false)}
                    >
                      <item.icon className="h-9 w-9" />
                      <span className="text-xl font-normal tracking-wider">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
