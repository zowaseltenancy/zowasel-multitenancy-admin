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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import TransactionVolumeChart from "@/features/billing/components/TransactionVolumeChart";
import VolumeComparisonCard from "@/features/billing/components/VolumeComparisonCard";
import { useTransactions } from "@/features/billing/hooks/useTransactions";
import { comparePeriod } from "@/features/billing/utils/transaction";

export default function TransactionsOverviewPage() {
  const { transactions } = useTransactions();

  const dayComparison = comparePeriod(
    transactions,
    "day"
  );

  const weekComparison = comparePeriod(
    transactions,
    "week"
  );

  const monthComparison = comparePeriod(
    transactions,
    "month"
  );

  const yearComparison = comparePeriod(
    transactions,
    "year"
  );

  const today = new Date();

  const transactionsToday = transactions.filter(
    (transaction) =>
      new Date(
        transaction.createdAt
      ).toDateString() === today.toDateString()
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
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconClassName:
        "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      iconClassName:
        "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      label: "Failed",
      value: failed,
      icon: XCircle,
      iconClassName:
        "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
    {
      label: "Refunded",
      value: refunded,
      icon: RotateCcw,
      iconClassName:
        "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      label: "Disputed",
      value: disputed,
      icon: AlertTriangle,
      iconClassName:
        "bg-destructive/10 text-destructive",
    },
  ];

  const quickLinks = [
    {
      title: "All Transactions",
      description: "Every transaction, fully filterable.",
      href: "/admin/billing/transactions/all",
    },
    {
      title: "Completed",
      description: `${completed} settled transaction${completed === 1 ? "" : "s"}.`,
      href: "/admin/billing/transactions/completed",
    },
    {
      title: "Pending",
      description: `${pending} awaiting confirmation.`,
      href: "/admin/billing/transactions/pending",
    },
    {
      title: "Failed",
      description: `${failed} that didn't go through.`,
      href: "/admin/billing/transactions/failed",
    },
    {
      title: "Refunded",
      description: `${refunded} reversed transaction${refunded === 1 ? "" : "s"}.`,
      href: "/admin/billing/transactions/refunded",
    },
    {
      title: "Disputed",
      description: `${disputed} escalated for review.`,
      href: "/admin/billing/transactions/disputed",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Transactions
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor payment activity across all organizations on the platform.
        </p>
      </div>

      {/* Volume comparisons — scrollable quick stats */}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Volume
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2">
          <VolumeComparisonCard
            label="Today"
            comparisonLabel="yesterday"
            comparison={dayComparison}
          />

          <VolumeComparisonCard
            label="This Week"
            comparisonLabel="last week"
            comparison={weekComparison}
          />

          <VolumeComparisonCard
            label="This Month"
            comparisonLabel="last month"
            comparison={monthComparison}
          />

          <VolumeComparisonCard
            label="This Year"
            comparisonLabel="last year"
            comparison={yearComparison}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Volume totals sum whatever currency each transaction was recorded in — a rough estimate, not currency-converted. As of {today.toLocaleDateString()}.
        </p>
      </section>

      {/* Status cards */}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          At a Glance
        </h2>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {statusCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label}>
                <CardContent className="space-y-3 p-5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>

                    <h3 className="text-2xl font-bold">
                      {stat.value}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Chart */}

      <TransactionVolumeChart
        transactions={transactions}
      />

      {/* Quick Links */}

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            Quick Links
          </h2>

          <p className="text-sm text-muted-foreground">
            Jump into a specific view of your transactions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-semibold">
                      {link.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
