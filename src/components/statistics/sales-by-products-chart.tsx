"use client";

import { useState } from "react";
import { useSalesByProductsQuery } from "@/hooks/queries/use-sales-by-products-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Package, ShoppingBag, DollarSign, Crown } from "lucide-react";

const COLORS = [
  "#1D9E75",
  "#D85A30",
  "#378ADD",
  "#BA7517",
  "#7F77DD",
  "#D4537E",
  "#888780", // last color doubles as the "Other" color
];

function getColor(index: number) {
  return index < 6 ? COLORS[index] : COLORS[6];
}

function toDateInputValue(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function SalesByProductsChart() {
  const [startStr, setStartStr] = useState(
    toDateInputValue(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
  );
  const [endStr, setEndStr] = useState(toDateInputValue(new Date()));

  const { data, isPending, error } = useSalesByProductsQuery(
    new Date(startStr),
    new Date(endStr),
  );

  const sorted = data?.data ? [...data.data].sort((a, b) => b.qty - a.qty) : [];
  const totalUnits = data?.totalUnits ?? 0;

  const top = sorted.slice(0, 6);
  const restQty = sorted.slice(6).reduce((sum, d) => sum + d.qty, 0);
  const restRevenue = sorted.slice(6).reduce((sum, d) => sum + d.revenue, 0);
  const chartData =
    restQty > 0
      ? [
          ...top,
          {
            productId: -1,
            name: "Other",
            company: "",
            qty: restQty,
            revenue: restRevenue,
          },
        ]
      : top;

  const statItems = [
    {
      label: "Units sold",
      value: String(totalUnits),
      icon: Package,
      color: "#1D9E75",
    },
    {
      label: "Products sold",
      value: String(sorted.length),
      icon: ShoppingBag,
      color: "#378ADD",
    },
    {
      label: "Total revenue",
      value: `$${(data?.totalRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "#BA7517",
    },
  ];

  const topSeller = sorted[0];
  return (
    <div className="flex flex-col gap-4 min-w-0 overflow-hidden">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm">
          From
          <input
            type="date"
            value={startStr}
            onChange={(e) => setStartStr(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          To
          <input
            type="date"
            value={endStr}
            onChange={(e) => setEndStr(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-1"
          />
        </label>
      </div>

      {isPending && <div>Loading...</div>}
      {error && <div>Something went wrong.</div>}

      {!isPending && !error && sorted.length === 0 && (
        <div className="text-muted-foreground text-center py-10">
          No sales in this range.
        </div>
      )}

      {!isPending && !error && sorted.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-lg border bg-card px-4 py-3 min-w-0 ${
                    item.label === "Total revenue"
                      ? "col-span-2 sm:col-span-1"
                      : ""
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                    style={{
                      backgroundColor: `${item.color}1A`,
                      color: item.color,
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold tabular-nums truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {topSeller && (
              <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 min-w-0">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                  style={{ backgroundColor: "#D4537E1A", color: "#D4537E" }}
                >
                  <Crown className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs text-muted-foreground">Top seller</p>
                  <p className="text-lg font-semibold truncate">
                    {topSeller.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {topSeller.company}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="w-full min-w-0" style={{ height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="qty"
                  nameKey="name"
                  outerRadius="75%"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.productId} fill={getColor(index)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-4 min-w-0 overflow-hidden @container">
            {/* Desktop table */}
            <div className="hidden @md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">
                      % of units sold
                    </TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((p, i) => (
                    <TableRow key={p.productId}>
                      <TableCell>
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: getColor(i) }}
                        />
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.company}</TableCell>
                      <TableCell className="text-right">{p.qty}</TableCell>
                      <TableCell className="text-right">
                        {totalUnits
                          ? Math.round((p.qty / totalUnits) * 100)
                          : 0}
                        %
                      </TableCell>
                      <TableCell className="text-right">
                        ${p.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-2 @md:hidden">
              {sorted.map((p, i) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: getColor(i) }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {p.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {p.company}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-sm font-medium">{p.qty}</span>
                    <span className="text-xs text-muted-foreground">
                      {totalUnits ? Math.round((p.qty / totalUnits) * 100) : 0}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${p.revenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
