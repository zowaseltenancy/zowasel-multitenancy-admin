"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingDown,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComparisonUnit, countInPeriod } from "@/lib/activityComparison";
import { Organization } from "@/types/organization";
import { PlatformUser } from "@/types/user";
import { Transaction } from "@/types/transaction";

interface Props {
  organizations: Organization[];
  users: PlatformUser[];
  transactions: Transaction[];
  isExpanded?: boolean;
}

const SLIDES: { label: string; unit: ComparisonUnit }[] = [
  { label: "Today", unit: "day" },
  { label: "This Week", unit: "week" },
  { label: "This Month", unit: "month" },
  { label: "This Year", unit: "year" },
];

export default function PlatformActivityCarouselCard({
  organizations,
  users,
  transactions,
  isExpanded = false,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isExpanded]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const activeSlide = SLIDES[currentIndex];

  const metrics = useMemo(() => {
    const orgCounts = countInPeriod(
      organizations.map((organization) => organization.createdAt),
      activeSlide.unit
    );
    const userCounts = countInPeriod(
      users.map((user) => user.dateJoined),
      activeSlide.unit
    );
    const transactionCounts = countInPeriod(
      transactions.filter((transaction) => transaction.status === "Completed").map((t) => t.createdAt),
      activeSlide.unit
    );

    return [
      { label: "New Organizations", icon: Building2, ...orgCounts },
      { label: "New Platform Users", icon: Users, ...userCounts },
      { label: "Transactions Completed", icon: ArrowRightLeft, ...transactionCounts },
    ];
  }, [organizations, users, transactions, activeSlide.unit]);

  const totalTxns = transactions.filter((t) => t.status === "Completed").length;

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden transition-all duration-200">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  Platform Activity
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" /> +14.2% Growth
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg border bg-sky-500/5 border-sky-500/20">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Completed Txns</p>
              <p className="text-2xl font-extrabold text-sky-600 mt-0.5">{totalTxns}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">System Health</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">99.9%</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1 border-t">
            <span>Settlements: {transactions.length}</span>
            <span>&bull;</span>
            <span>KYB Checks: {organizations.length}</span>
            <span>&bull;</span>
            <span>Payouts: 18</span>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Platform Activity & Event Velocity Comparison
              </p>
              <h3 className="text-2xl font-extrabold text-foreground">{totalTxns} Live Completed Operations</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev Period
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {SLIDES.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Period <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 p-1.5 bg-muted/60 rounded-xl">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.label}
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
              {slide.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const change = metric.current - metric.previous;
            const isPositive = change >= 0;
            const percentChange = metric.previous === 0 ? null : (change / metric.previous) * 100;

            return (
              <div key={metric.label} className="p-4 border rounded-xl bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">{metric.label}</span>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-3xl font-black text-foreground font-mono">{metric.current.toLocaleString()}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {percentChange !== null ? (
                    <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
                      {isPositive ? "↑ +" : "↓ "}{percentChange.toFixed(0)}% vs previous
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Baseline active</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
