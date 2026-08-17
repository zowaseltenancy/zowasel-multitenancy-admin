"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Layers,
  AlertTriangle,
  ArrowRight,
  Wallet,
  Sprout,
  Store,
  CreditCard,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/features/billing/hooks/useSubscriptions";

const PLATFORM_PRODUCTS = [
  {
    key: "croppilot",
    label: "CropPilot",
    icon: Sprout,
    description: "Farm registry, agronomy advisory, and carbon & sustainability D-MRV tiers.",
    accentBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    key: "marketplace",
    label: "Marketplace",
    icon: Store,
    description: "Commodity trading, order matching, escrow settlements, and logistics tiers.",
    accentBg: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  },
  {
    key: "acess",
    label: "ACESS",
    icon: CreditCard,
    description: "Credit scoring, input financing, and micro-loan portfolio risk verification.",
    accentBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
] as const;

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
      title: "Active Subscriptions",
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
      title: "Past Due / Action Needed",
      value: pastDueCount,
      icon: AlertTriangle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30 font-bold",
      iconColor: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore and manage active tenant subscriptions categorized by platform product.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link href="/admin/billing/subscriptions/all">
          <Button className="gap-2 shadow-xs cursor-pointer">
            <Wallet className="h-4 w-4" />
            <span>All Subscriptions Feed</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Snapshot Stat Cards */}
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

      {/* Level 1: Subscriptions by Platform Products */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Subscriptions by Platform</h2>
          <p className="text-xs text-muted-foreground">
            Select a product to inspect its tenant subscriptions, active tiers, and renewal schedules.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLATFORM_PRODUCTS.map((prod) => {
            const Icon = prod.icon;
            const prodSubs = subscriptions.filter((s) => {
              if (s.productId) return s.productId === prod.key;
              const lower = s.product.toLowerCase();
              if (prod.key === "croppilot") return lower.includes("crop") || lower.includes("carbon");
              if (prod.key === "marketplace") return lower.includes("market") || lower.includes("trade");
              if (prod.key === "acess") return lower.includes("acess") || lower.includes("credit");
              return true;
            });
            const activeProdCount = prodSubs.filter((s) => s.status === "Active").length;
            const trialProdCount = prodSubs.filter((s) => s.status === "Trial").length;

            return (
              <Link key={prod.key} href={`/admin/billing/subscriptions/all?product=${prod.key}`} className="group block">
                <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full bg-card hover:shadow-md">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl border ${prod.accentBg}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{prod.label}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{prod.description}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Total Subscriptions</span>
                        <span className="font-bold text-foreground">{prodSubs.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Active Tiers</span>
                        <span className="text-emerald-600 font-bold">{activeProdCount} active</span>
                      </div>
                      {trialProdCount > 0 && (
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">Trials</span>
                          <span className="text-amber-600 font-bold">{trialProdCount} in trial</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
