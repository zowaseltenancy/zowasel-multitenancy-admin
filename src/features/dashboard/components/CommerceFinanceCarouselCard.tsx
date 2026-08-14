"use client";

import { useState, useMemo, useEffect } from "react";
import { CreditCard, ChevronLeft, ChevronRight, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCompactMetric } from "@/lib/utils";
import { Transaction } from "@/types/transaction";
import { Organization } from "@/types/organization";

interface Props {
  organizations: Organization[];
  transactions: Transaction[];
  isExpanded?: boolean;
}

const TABS = [
  { key: "subscriptions", label: "Paid Subscriptions" },
  { key: "revenue", label: "Revenue by Currency" },
  { key: "transactions", label: "Completed Txns" },
];

export default function CommerceFinanceCarouselCard({
  organizations,
  transactions,
  isExpanded = false,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TABS.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isExpanded]);

  const activeTab = TABS[currentIndex];

  const activeSubscriptions = useMemo(
    () => organizations.reduce((acc, o) => acc + o.subscriptions.filter((s) => s.billingState === "paid").length, 0),
    [organizations]
  );

  const completedTransactions = useMemo(
    () => transactions.filter((t) => t.status === "Completed"),
    [transactions]
  );

  const revenueByCurrency = useMemo(() => {
    const totals = new Map<string, number>();
    completedTransactions.forEach((t) => totals.set(t.currency, (totals.get(t.currency) ?? 0) + t.amount));
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [completedTransactions]);

  const totalVolume = useMemo(
    () => completedTransactions.reduce((acc, t) => acc + (t.amount || 0), 0),
    [completedTransactions]
  );

  const completionRate =
    transactions.length > 0 ? Math.round((completedTransactions.length / transactions.length) * 100) : 0;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % TABS.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + TABS.length) % TABS.length);
  };

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <CreditCard className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                Commerce & Finance
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-500/20 shrink-0 whitespace-nowrap">
              <Wallet className="h-3 w-3" /> {completionRate}% Done
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div
              className="p-2.5 rounded-lg border bg-indigo-500/5 border-indigo-500/20 min-w-0 overflow-hidden"
              title={`${totalVolume.toLocaleString()}`}
            >
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">
                Txn Volume
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-0.5 truncate tracking-tight tabular-nums">
                {formatCompactMetric(totalVolume)}
              </p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden" title={`${activeSubscriptions.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Subscriptions</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5 truncate tracking-tight tabular-nums">
                {formatCompactMetric(activeSubscriptions)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate">Completed: {formatCompactMetric(completedTransactions.length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Currencies: {formatCompactMetric(revenueByCurrency.length)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                Commerce, Subscriptions & Revenue Flow Breakdown
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">
                {totalVolume > 0 ? `${totalVolume.toLocaleString()} Total Volume` : "No completed volume yet"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev Tab
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {TABS.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Tab <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-xl overflow-x-auto">
          {TABS.map((t, idx) => (
            <button
              key={t.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 min-w-[90px] py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap",
                currentIndex === idx
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground hover:bg-card"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab.key === "subscriptions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 border rounded-xl bg-muted/20">
            <div className="p-4 border rounded-xl bg-card min-w-0 overflow-hidden">
              <p className="text-xs font-bold uppercase text-muted-foreground truncate">Active Paid Subscriptions</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-2 truncate">{activeSubscriptions.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Tenant Module Licenses</p>
            </div>
            <div className="p-4 border rounded-xl bg-indigo-500/5 border-indigo-500/20 min-w-0 overflow-hidden">
              <p className="text-xs font-bold uppercase text-muted-foreground truncate">Organizations in Scope</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2 truncate">{organizations.length.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 truncate">
                {organizations.length > 0 ? ((activeSubscriptions / organizations.length) * 100).toFixed(0) : 0}% with a paid subscription
              </p>
            </div>
          </div>
        )}

        {activeTab.key === "revenue" && (
          <div className="p-4 border rounded-xl bg-muted/20 space-y-2 max-h-[220px] overflow-y-auto min-w-0">
            {revenueByCurrency.length === 0 ? (
              <p className="text-xs font-bold text-muted-foreground text-center py-4">
                No completed transactions in scope yet.
              </p>
            ) : (
              revenueByCurrency.map(([currency, amount]) => (
                <div key={currency} className="flex items-center justify-between p-3 border rounded-xl bg-card min-w-0 gap-2">
                  <span className="text-sm font-bold text-foreground truncate">{currency}</span>
                  <span className="text-sm font-black text-indigo-600 font-mono truncate">{amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab.key === "transactions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 border rounded-xl bg-muted/20">
            <div className="p-4 border rounded-xl bg-indigo-500/5 border-indigo-500/20 min-w-0 overflow-hidden">
              <p className="text-xs font-bold uppercase text-muted-foreground truncate">Completed Transactions</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2 truncate">{completedTransactions.length.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Processed Settlements</p>
            </div>
            <div className="p-4 border rounded-xl bg-card min-w-0 overflow-hidden">
              <p className="text-xs font-bold uppercase text-muted-foreground truncate">All Transactions in Scope</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-2 truncate">{transactions.length.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 truncate">
                {transactions.length > 0 ? ((completedTransactions.length / transactions.length) * 100).toFixed(0) : 0}% completed
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
