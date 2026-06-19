import SalesByProductsChart from "@/components/statistics/sales-by-products-chart";
import { BarChart3 } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
          style={{ backgroundColor: "#378ADD1A", color: "#378ADD" }}
        >
          <BarChart3 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
          <p className="text-sm text-muted-foreground">
            Sales performance and product trends across any date range.
          </p>
        </div>
      </div>

      <SalesByProductsChart />
    </div>
  );
}
