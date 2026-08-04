"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SettlementTable from "@/features/billing/components/SettlementTable";
import { useSettlements } from "@/features/billing/hooks/useSettlements";

export default function SettlementsOverviewPage() {
  const { settlements } = useSettlements();

  const completed = settlements.filter(
    (settlement) => settlement.status === "Completed"
  ).length;

  const processing = settlements.filter(
    (settlement) => settlement.status === "Processing"
  ).length;

  const failed = settlements.filter(
    (settlement) => settlement.status === "Failed"
  ).length;

  const stats = [
    {
      title: "Total Settlements",
      value: settlements.length,
      icon: Wallet,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      title: "Processing",
      value: processing,
      icon: Clock3,
      cardBg: "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20",
      iconClassName: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
    },
    {
      title: "Failed",
      value: failed,
      icon: XCircle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
      iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
  ];

  // Top 5 recent settlements
  const recentSettlements = [...settlements]
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settlements Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Payouts disbursed to merchants, agrodealers, buyers and cooperatives selling on the platform.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link href="/admin/billing/settlements/all">
          <Button className="gap-2 shadow-xs cursor-pointer">
            <ShieldCheck className="h-4 w-4" />
            <span>View All Settlements</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Snapshot Cards with Status Color Background Tints */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className={`border shadow-2xs transition-colors ${stat.cardBg}`}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${stat.iconClassName}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Settlements Triggered */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Settlements Triggered</h2>
            <p className="text-xs text-muted-foreground">The 5 most recent payouts processed or scheduled on the platform.</p>
          </div>

          <Link href="/admin/billing/settlements/all" className="text-xs font-medium text-primary hover:underline">
            See full settlement history ➔
          </Link>
        </div>

        <SettlementTable settlements={recentSettlements} />
      </section>
    </div>
  );
}
