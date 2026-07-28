"use client";

import { ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import HierarchicalCurrencyMatrix from "@/features/billing/components/HierarchicalCurrencyMatrix";

export default function CurrencyPage() {
  return (
    <div className="space-y-6">
      {/* Header & Default Currency Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Global & Regional Currency Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage global exchange rate markups, 4-tier geographic filtering, and country-level currency overrides.
          </p>
        </div>

        {/* Platform Default Currency Card */}
        <Card className="bg-card shrink-0 min-w-[240px] border-primary/20 shadow-xs">
          <CardContent className="flex items-center justify-between p-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Platform Default Currency</p>
              <p className="mt-1 text-2xl font-bold text-primary flex items-center gap-1.5">
                NGN (₦)
              </p>
              <p className="text-[11px] text-muted-foreground">Nigerian Naira • Primary Settle</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ArrowUpDown className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4-Tier Hierarchical Geographic Currency Matrix with Top Control Panel */}
      <HierarchicalCurrencyMatrix />
    </div>
  );
}