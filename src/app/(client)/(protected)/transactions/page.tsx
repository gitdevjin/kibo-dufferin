"use client";

import TransactionFeed from "@/components/parts/transaction-feed";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export default function TransactionsPage() {
  const [dateBefore, setDateBefore] = useState<Date>();

  return (
    <div className="space-y-8 p-2">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View and manage transaction history
            </p>

            {dateBefore && (
              <Badge variant="secondary" className="mt-3">
                Up to {format(dateBefore, "PPP")}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[220px] justify-start gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />

                  {dateBefore ? (
                    format(dateBefore, "PPP")
                  ) : (
                    <span className="text-muted-foreground">
                      Select end date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-auto rounded-xl p-0">
                <Calendar
                  mode="single"
                  selected={dateBefore}
                  onSelect={setDateBefore}
                />
              </PopoverContent>
            </Popover>

            {dateBefore && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDateBefore(undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <TransactionFeed dateBefore={dateBefore} />
    </div>
  );
}
