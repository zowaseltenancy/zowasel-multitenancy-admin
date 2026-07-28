"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Layers,
  AlertTriangle,
  ArrowRight,
  Wallet,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionGrid from "@/features/billing/components/SubscriptionGrid";
import { useSubscriptions } from "@/features/billing/hooks/useSubscriptions";

export default function SubscriptionsOverviewPage() {
  const { subscriptions } = useSubscriptions();

  const activeCount = subscriptions.filter((s) => s.status === "Active").length;
  const trialCount = subscriptions.filter((s) => s.status === "Trial").length;
  const pastDueCount = subscriptions.filter((s) => s.status === "Past Due").length;

  const stats = [
    {
      title: "Total Subscriptions",
      value: subscriptions.length,
      icon: Layers,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconColor: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      title: "Active",
      value: activeCount,
      icon: CheckCircle2,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      title: "Trial Period",
      value: trialCount,
      icon: Clock3,
      cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
      iconColor: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    },
    {
      title: "Past Due (Action Required)",
      value: pastDueCount,
      icon: AlertTriangle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30 font-bold",
      iconColor: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
  ];

  // 5 Most recent subscriptions sorted by started date (newest to oldest)
  const recentSubscriptions = [...subscriptions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor tenant product subscriptions, trial periods, and urgent past-due accounts.
          </p>
        </div>

        {/* Primary Action Button taking users to tabbed filter list */}
        <Link href="/admin/billing/subscriptions/all">
          <Button className="gap-2 shadow-xs cursor-pointer">
            <Wallet className="h-4 w-4" />
            <span>View All Subscriptions</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Snapshot Stat Cards with Status Color Background Tints */}
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

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${stat.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Subscriptions (Top 5 from most recent to oldest) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Subscriptions</h2>
            <p className="text-xs text-muted-foreground">The 5 most recent tenant product subscriptions created on the platform.</p>
          </div>

          <Link href="/admin/billing/subscriptions/all" className="text-xs font-medium text-primary hover:underline">
            See full subscription history ➔
          </Link>
        </div>

        <SubscriptionGrid subscriptions={recentSubscriptions} />
      </section>
    </div>
  );
}
