"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  CreditCard,
  DollarSign,
  Wallet,
  FileText,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BillingTabs from "@/features/billing/components/BillingTabs";

export default function BillingOverviewPage() {
  const snapshot = {
    revenue: "₦24.5M",
    revenueGrowth: "+12.5%",

    provider: "Paystack",
    providerHealth: "Healthy",

    transactionsToday: "324",
    transactionsGrowth: "+18 today",

    subscriptions: "24",
    renewals: "2 renewals",
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Financial Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor payment gateways, multi-currency exchange markups, subscriptions, invoices, and payouts.
          </p>
        </div>

        <Card className="shrink-0 border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Gateway Status</p>
              <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> All Systems Operational
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Navigation Tabs */}
      <BillingTabs />

      {/* Operational Snapshot with Status Color Background Tints */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Operational Snapshot</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Revenue Card - Distinct Cyan Tint for Total Metric */}
          <Card className="bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Total Revenue</p>
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:text-cyan-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{snapshot.revenue}</h3>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">{snapshot.revenueGrowth} vs last month</p>
            </CardContent>
          </Card>

          {/* Active Gateway - Emerald Tint */}
          <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Active Gateway</p>
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{snapshot.provider}</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{snapshot.providerHealth}</span>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Today - Blue Tint */}
          <Card className="bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 shadow-2xs">
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Transactions Today</p>
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 border border-blue-500/30 dark:text-blue-400">
                  <Receipt className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{snapshot.transactionsToday}</h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{snapshot.transactionsGrowth}</p>
            </CardContent>
          </Card>

          {/* Active Subscriptions - Emerald Tint */}
          <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
            <CardContent className="space-y-2 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Active Subscriptions</p>
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
                  <Wallet className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{snapshot.subscriptions}</h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{snapshot.renewals}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Operational Alerts & System Health */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Billing Health & Alerts</h2>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Provider Healthy</p>
                  <p className="text-xs text-muted-foreground">Paystack & Interswitch operational.</p>
                </div>
              </div>
              <Link href="/admin/billing/providers">
                <Button variant="ghost" size="sm" className="text-xs gap-1 cursor-pointer">Manage</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Pending Settlements</p>
                  <p className="text-xs text-muted-foreground">1 settlement awaiting payout.</p>
                </div>
              </div>
              <Link href="/admin/billing/settlements">
                <Button variant="ghost" size="sm" className="text-xs gap-1 cursor-pointer">View</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 shadow-2xs">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 border border-blue-500/30 dark:text-blue-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">FX Exchange Rates</p>
                  <p className="text-xs text-muted-foreground">Synced 12 minutes ago.</p>
                </div>
              </div>
              <Link href="/admin/billing/currency">
                <Button variant="ghost" size="sm" className="text-xs gap-1 cursor-pointer">Configure</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Billing Activity</h2>

        <Card className="bg-card shadow-2xs">
          <CardContent className="flex min-h-[140px] flex-col items-center justify-center text-center p-6 space-y-2">
            <Receipt className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="font-semibold text-sm">No recent billing alerts</h3>
            <p className="max-w-md text-xs text-muted-foreground">
              Payments, provider changes, subscription renewals, currency updates, and billing configuration changes will appear here in real-time.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}