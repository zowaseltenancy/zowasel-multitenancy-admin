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
import { cn, formatCompactMetric } from "@/lib/utils";
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
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                Platform Activity
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 shrink-0 whitespace-nowrap">
              <TrendingUp className="h-3 w-3" /> +14.2% Growth
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 rounded-lg border bg-sky-500/5 border-sky-500/20 min-w-0 overflow-hidden" title={`${totalTxns.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Completed Txns</p>
              <p className="text-xl sm:text-2xl font-extrabold text-sky-600 mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(totalTxns)}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">System Health</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5 truncate tracking-tight tabular-nums">99.9%</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate">Settlements: {formatCompactMetric(transactions.length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">KYB: {formatCompactMetric(organizations.length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Payouts: 18</span>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                Platform Activity & Event Velocity Comparison
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{totalTxns} Live Completed Operations</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-xl overflow-x-auto">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.label}
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
              {slide.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const change = metric.current - metric.previous;
            const isPositive = change >= 0;
            const percentChange = metric.previous === 0 ? null : (change / metric.previous) * 100;

            return (
              <div key={metric.label} className="p-4 border rounded-xl bg-muted/20 space-y-2 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground truncate">{metric.label}</span>
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground font-mono truncate">{metric.current.toLocaleString()}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                  {percentChange !== null ? (
                    <span className={cn("truncate", isPositive ? "text-emerald-600" : "text-rose-600")}>
                      {isPositive ? "↑ +" : "↓ "}{percentChange.toFixed(0)}% vs previous
                    </span>
                  ) : (
                    <span className="text-muted-foreground truncate">Baseline active</span>
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
