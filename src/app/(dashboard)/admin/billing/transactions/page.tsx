"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
  Receipt,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionVolumeChart from "@/features/billing/components/TransactionVolumeChart";
import VolumeCarouselCard from "@/features/billing/components/VolumeCarouselCard";
import { useTransactions } from "@/features/billing/hooks/useTransactions";
import { comparePeriod } from "@/features/billing/utils/transaction";

export default function TransactionsOverviewPage() {
  const { transactions } = useTransactions();

  const dayComparison = comparePeriod(transactions, "day");
  const weekComparison = comparePeriod(transactions, "week");
  const monthComparison = comparePeriod(transactions, "month");
  const yearComparison = comparePeriod(transactions, "year");

  const today = new Date();

  const transactionsToday = transactions.filter(
    (transaction) =>
      new Date(transaction.createdAt).toDateString() === today.toDateString()
  ).length;

  const completed = transactions.filter(
    (transaction) => transaction.status === "Completed"
  ).length;

  const pending = transactions.filter(
    (transaction) => transaction.status === "Pending"
  ).length;

  const failed = transactions.filter(
    (transaction) => transaction.status === "Failed"
  ).length;

  const refunded = transactions.filter(
    (transaction) => transaction.status === "Refunded"
  ).length;

  const disputed = transactions.filter(
    (transaction) => transaction.disputed
  ).length;

  const statusCards = [
    {
      label: "Transactions Today",
      value: transactionsToday,
      icon: CalendarCheck,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
      iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    },
    {
      label: "Failed",
      value: failed,
      icon: XCircle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
      iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
    {
      label: "Refunded",
      value: refunded,
      icon: RotateCcw,
      cardBg: "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20",
      iconClassName: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
    },
    {
      label: "Disputed",
      value: disputed,
      icon: AlertTriangle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
      iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor payment volume, currency distribution, and disputes across all operating regions.
          </p>
        </div>

        {/* Primary Action Button to detailed history */}
        <Link href="/admin/billing/transactions/all">
          <Button className="gap-2 shadow-xs cursor-pointer">
            <Receipt className="h-4 w-4" />
            <span>Detailed Transaction History</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Side-by-Side Line: Volume Overview Carousel Card + Volume Trend Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <VolumeCarouselCard
            dayComparison={dayComparison}
            weekComparison={weekComparison}
            monthComparison={monthComparison}
            yearComparison={yearComparison}
          />
        </div>

        <div className="lg:col-span-8">
          <TransactionVolumeChart transactions={transactions} />
        </div>
      </section>

      {/* At a Glance Status Cards with Status Color Background Tints */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Status Breakdown</h2>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {statusCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label} className={`border shadow-2xs transition-colors ${stat.cardBg}`}>
                <CardContent className="space-y-3 p-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.iconClassName}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
