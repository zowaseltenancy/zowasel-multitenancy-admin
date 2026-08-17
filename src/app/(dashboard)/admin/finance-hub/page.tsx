"use client";

import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Clock,
  ShieldAlert,
  Building2,
  Layers,
  ShieldCheck,
  ArrowRight,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import StatusSegmentedBar from "@/components/shared/StatusSegmentedBar";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import { useTreasuryAccounts } from "@/features/finance-hub/hooks/useTreasuryAccounts";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useMonitoredAccounts } from "@/features/finance-hub/hooks/useMonitoredAccounts";
import { useLiquidityForecast } from "@/features/finance-hub/hooks/useLiquidityForecast";
import { convertToUSD, formatUSD } from "@/features/finance-hub/utils/currency";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function FinanceHubOverviewPage() {
  const { accounts: treasuryAccounts, totalUSD } = useTreasuryAccounts();
  const { transactions } = useLedgerTransactions();
  const { accounts: monitoredAccounts } = useMonitoredAccounts();
  const { runwayMonths, netInflow13wk } = useLiquidityForecast(transactions);
  const projected13WkPosition = totalUSD + netInflow13wk;
  const treasuryCountryCount = new Set(treasuryAccounts.map((a) => a.countryCode)).size;

  // eslint-disable-next-line react-hooks/purity -- "last 30 days" is inherently wall-clock-relative
  const now = Date.now();
  const recent = transactions.filter((t) => now - new Date(t.date).getTime() <= THIRTY_DAYS_MS);

  const revenueThisPeriod = recent
    .filter((t) => t.status === "Completed" && t.type === "credit")
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);

  const outflowsThisPeriod = recent
    .filter((t) => t.status === "Completed" && t.type === "debit")
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);

  const pendingSettlements = transactions
    .filter((t) => t.status === "Pending" || t.status === "Pending Approval")
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);

  const pendingCount = transactions.filter(
    (t) => t.status === "Pending" || t.status === "Pending Approval"
  ).length;

  const flaggedAccounts = monitoredAccounts.filter((a) => a.riskTier === "High Risk").length;
  const dormantAccounts = monitoredAccounts.filter((a) => a.status === "Dormant").length;
  const activeAccounts = monitoredAccounts.filter((a) => a.status === "Active").length;
  const suspendedAccounts = monitoredAccounts.filter((a) => a.status === "Suspended").length;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Finance Hub</h1>
          <PageHeaderInfo
            title="Finance Hub Scope"
            description="Glanceable roll-up of corporate treasury, revenue streams, 13-week liquidity projections, net-of-tax escrows, and tenant account risk monitoring."
          />
        </div>
      </div>

      {/* Metric Cards — 4-Metric Executive Treasury Command Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Consolidated Treasury Position
              </p>
              <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{formatUSD(totalUSD)}</p>
            <p className="mt-1 text-xs text-muted-foreground font-semibold">
              Consolidated across {treasuryAccounts.length} corporate account{treasuryAccounts.length === 1 ? "" : "s"},{" "}
              {treasuryCountryCount} {treasuryCountryCount === 1 ? "country" : "countries"}
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                13-Wk Liquidity Projection
              </p>
              <TrendingUp className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{formatUSD(projected13WkPosition)}</p>
            <p className={`mt-1 text-xs font-bold ${netInflow13wk >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {netInflow13wk >= 0 ? "+" : ""}
              {formatUSD(netInflow13wk)} net {netInflow13wk >= 0 ? "inflows" : "outflows"} forecasted
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cash Runway (13-Wk Projection)
              </p>
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{runwayMonths.toFixed(1)} Mos</p>
            <p className="mt-1 text-xs text-purple-600 font-bold">
              Projected from real debit run-rate & scheduled renewals
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Net-of-Tax Pending Escrows
              </p>
              <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{formatUSD(pendingSettlements)}</p>
            <p className="mt-1 text-xs text-amber-600 font-bold">{pendingCount} awaiting approval & WHT clearance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border shadow-2xs">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold text-foreground">Monitored Account Status</h3>
            </div>
            <StatusSegmentedBar
              segments={[
                { label: "Active", count: activeAccounts, tone: "success" },
                { label: "Dormant", count: dormantAccounts, tone: "warning" },
                { label: "Suspended", count: suspendedAccounts, tone: "danger" },
              ]}
            />
            <Link
              href="/admin/finance-hub/accounts-monitor"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              View all monitored accounts <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border shadow-2xs">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-base font-bold text-foreground">Needs Attention</h3>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between rounded-lg border p-2.5">
                <span className="text-muted-foreground">Pending approval</span>
                <span className="font-bold text-foreground">
                  {transactions.filter((t) => t.status === "Pending Approval").length}
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg border p-2.5">
                <span className="text-muted-foreground">Bank recon discrepancies</span>
                <Link href="/admin/finance-hub/account" className="font-bold text-primary hover:underline">
                  Review &rarr;
                </Link>
              </li>
              <li className="flex items-center justify-between rounded-lg border p-2.5">
                <span className="text-muted-foreground">High-risk accounts</span>
                <span className="font-bold text-rose-600">{flaggedAccounts}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/finance-hub/analytics" className="group">
          <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-cyan-500/10 p-2 text-cyan-600">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-base text-foreground">Analytics</h3>
                <p className="text-xs text-muted-foreground">
                  Revenue trends, fee breakdowns, MRR, and outflow charts.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-primary">Explore Charts &rarr;</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/finance-hub/account" className="group">
          <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-500/10 p-2 text-emerald-600">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-base text-foreground">Master Account & Statements</h3>
                <p className="text-xs text-muted-foreground">
                  Per-country treasury balances, bank statement import, reconciliation.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-primary">Manage Bank Ledger &rarr;</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/finance-hub/transactions" className="group">
          <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-sky-500/10 p-2 text-sky-600">
                    <Layers className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-base text-foreground">Platform Ledger & Outflows</h3>
                <p className="text-xs text-muted-foreground">
                  Every monetary movement, online and offline, with approval workflow.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-primary">Record & Audit &rarr;</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/finance-hub/accounts-monitor" className="group">
          <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-500/10 p-2 text-purple-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-base text-foreground">Accounts Monitoring</h3>
                <p className="text-xs text-muted-foreground">
                  Real tenant ledger accounts, risk tier, and per-account history.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-primary">Monitor Accounts &rarr;</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/finance-hub/governance" className="group">
          <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-500/10 p-2 text-amber-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-base text-foreground">Governance & Approvals</h3>
                <p className="text-xs text-muted-foreground">
                  4-level authorization tiers, CFO threshold limits, maker-checker rules.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-primary">Configure Policies &rarr;</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
