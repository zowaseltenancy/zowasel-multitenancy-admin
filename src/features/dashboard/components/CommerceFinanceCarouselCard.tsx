"use client";

import { useState, useMemo, useEffect } from "react";
import { CreditCard, ChevronLeft, ChevronRight, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

  // Headline currency for the summary tile — whichever currency has the most
  // completed volume in the current scope, real data, not a fixed constant.
  const topCurrency = revenueByCurrency[0];
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
      <Card className="h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  Commerce & Finance
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-500/20">
              <Wallet className="h-3 w-3" /> {completionRate}% Completed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg border bg-indigo-500/5 border-indigo-500/20">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                {topCurrency ? `${topCurrency[0]} Volume` : "Txn Volume"}
              </p>
              <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">
                {topCurrency ? topCurrency[1].toLocaleString() : 0}
              </p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Subscriptions</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{activeSubscriptions}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1 border-t">
            <span>Completed: {completedTransactions.length}</span>
            <span>&bull;</span>
            <span>Currencies: {revenueByCurrency.length}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Commerce, Subscriptions & Revenue Flow Breakdown
              </p>
              <h3 className="text-2xl font-extrabold text-foreground">
                {topCurrency ? `${topCurrency[0]} ${topCurrency[1].toLocaleString()}` : "No completed volume yet"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="w-full flex items-center gap-2 p-1.5 bg-muted/60 rounded-xl">
          {TABS.map((t, idx) => (
            <button
              key={t.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
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
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-xl bg-muted/20">
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-xs font-bold uppercase text-muted-foreground">Active Paid Subscriptions</p>
              <p className="text-3xl font-black text-foreground mt-2">{activeSubscriptions}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1">Tenant Module Licenses</p>
            </div>
            <div className="p-4 border rounded-xl bg-indigo-500/5 border-indigo-500/20">
              <p className="text-xs font-bold uppercase text-muted-foreground">Organizations in Scope</p>
              <p className="text-3xl font-black text-indigo-600 mt-2">{organizations.length}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1">
                {organizations.length > 0 ? ((activeSubscriptions / organizations.length) * 100).toFixed(0) : 0}% with a paid subscription
              </p>
            </div>
          </div>
        )}

        {activeTab.key === "revenue" && (
          <div className="p-4 border rounded-xl bg-muted/20 space-y-2 max-h-[180px] overflow-y-auto">
            {revenueByCurrency.length === 0 ? (
              <p className="text-xs font-bold text-muted-foreground text-center py-4">
                No completed transactions in scope yet.
              </p>
            ) : (
              revenueByCurrency.map(([currency, amount]) => (
                <div key={currency} className="flex items-center justify-between p-3 border rounded-xl bg-card">
                  <span className="text-sm font-bold text-foreground">{currency}</span>
                  <span className="text-sm font-black text-indigo-600 font-mono">{amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab.key === "transactions" && (
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-xl bg-muted/20">
            <div className="p-4 border rounded-xl bg-indigo-500/5 border-indigo-500/20">
              <p className="text-xs font-bold uppercase text-muted-foreground">Completed Transactions</p>
              <p className="text-3xl font-black text-indigo-600 mt-2">{completedTransactions.length}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1">Processed Settlements</p>
            </div>
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-xs font-bold uppercase text-muted-foreground">All Transactions in Scope</p>
              <p className="text-3xl font-black text-foreground mt-2">{transactions.length}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1">
                {transactions.length > 0 ? ((completedTransactions.length / transactions.length) * 100).toFixed(0) : 0}% completed
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
