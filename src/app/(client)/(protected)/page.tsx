import Image from "next/image";
import Link from "next/link";
import { Package, BarChart3, Receipt } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[50vh] min-h-[280px]">
        <Image
          src="/kibo-dufferin.jpg"
          alt="Kibo Dufferin Mall storefront"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 sm:p-10 flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
            <Image
              src="/kibo.jpeg"
              alt="Kibo logo"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <h1 className="text-white text-2xl sm:text-4xl font-semibold tracking-tight">
              Kibo Dufferin Mall
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Inventory and sales management
            </p>
          </div>
        </div>
      </div>

      {/* Welcome section */}
      <div className="px-6 sm:px-10 py-10 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          This is home base for managing Kibo&apos;s stock, sales, and restocks
          at Dufferin Mall. Jump into the sections below to check on inventory
          or see how the store has been performing.
        </p>
      </div>

      {/* Quick links */}
      <div className="px-6 sm:px-10 pb-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        <Link
          href="/inventory"
          className="flex items-center gap-4 rounded-lg border bg-card px-5 py-4 hover:bg-muted/50 transition-colors"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
            style={{ backgroundColor: "#1D9E751A", color: "#1D9E75" }}
          >
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">Inventory</p>
            <p className="text-sm text-muted-foreground">
              View and manage stock
            </p>
          </div>
        </Link>
        <Link
          href="/transactions"
          className="flex items-center gap-4 rounded-lg border bg-card px-5 py-4 hover:bg-muted/50 transition-colors"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
            style={{ backgroundColor: "#D85A301A", color: "#D85A30" }}
          >
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">Transactions</p>
            <p className="text-sm text-muted-foreground">
              Sales and restock history
            </p>
          </div>
        </Link>

        <Link
          href="/statistics"
          className="flex items-center gap-4 rounded-lg border bg-card px-5 py-4 hover:bg-muted/50 transition-colors"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
            style={{ backgroundColor: "#378ADD1A", color: "#378ADD" }}
          >
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">Statistics</p>
            <p className="text-sm text-muted-foreground">
              Sales and revenue trends
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
