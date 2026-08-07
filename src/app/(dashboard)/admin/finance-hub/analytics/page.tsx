"use client";

import { useMemo, useState } from "react";
import {
  PieChart as PieChartIcon,
  Zap,
  Users,
  DollarSign,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  TooltipValueType,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { convertToUSD, formatUSD } from "@/features/finance-hub/utils/currency";
import { LEDGER_CATEGORY_LABELS, MONTHLY_BUDGET_USD } from "@/constants/finance";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { LedgerCategory } from "@/types/finance";

const CATEGORY_COLORS: Record<LedgerCategory, string> = {
  "Platform Fee": "#10b981",
  Subscription: "#0ea5e9",
  "Dispute Fee": "#f59e0b",
  "Escrow Settlement": "#8b5cf6",
  "Operational Outflow": "#f43f5e",
  "Internal Transfer": "#64748b",
};

type Timeframe = "daily" | "weekly" | "monthly" | "yearly";

function bucketLabel(date: Date, timeframe: Timeframe): string {
  if (timeframe === "daily") {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  if (timeframe === "weekly") {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return `Wk of ${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }
  if (timeframe === "monthly") {
    const short = date.toLocaleDateString(undefined, { month: "short" });
    return `${short} '${String(date.getFullYear()).slice(-2)}`;
  }
  return `${date.getFullYear()}`;
}

function bucketKey(date: Date, timeframe: Timeframe): number {
  if (timeframe === "daily") return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  if (timeframe === "weekly") return Math.floor(date.getTime() / (1000 * 60 * 60 * 24 * 7));
  if (timeframe === "monthly") return date.getFullYear() * 12 + date.getMonth();
  return date.getFullYear();
}

const BUCKET_COUNT: Record<Timeframe, number> = { daily: 14, weekly: 8, monthly: 6, yearly: 3 };
const BUCKET_MS: Record<Timeframe, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
  yearly: 365 * 24 * 60 * 60 * 1000,
};

export default function FinanceHubAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const { transactions } = useLedgerTransactions();
  const { organizations: allOrganizations } = useOrganizations();
  const { actingOfficer, isCountryInScope } = useActingFinanceOfficer();

  // Scoped the same way useMonitoredAccounts scopes them — otherwise a
  // Country officer sees the global org count in the denominator against
  // only their own country's activity in the numerator, understating
  // activation for no real reason.
  const organizations = allOrganizations.filter((org) => isCountryInScope(org.countryCode));

  const completed = transactions.filter((t) => t.status === "Completed");

  // Gross vs Net revenue trend — computed by bucketing real completed
  // transactions, not a hand-drawn curve.
  const revenueSeries = useMemo(() => {
    const count = BUCKET_COUNT[timeframe];
    const bucketMs = BUCKET_MS[timeframe];
    // eslint-disable-next-line react-hooks/purity -- bucketing is inherently wall-clock-relative
    const now = Date.now();

    const buckets = Array.from({ length: count }, (_, i) => {
      const bucketDate = new Date(now - (count - 1 - i) * bucketMs);
      return { key: bucketKey(bucketDate, timeframe), label: bucketLabel(bucketDate, timeframe), gross: 0, net: 0 };
    });

    completed.forEach((t) => {
      const txnDate = new Date(t.date);
      const key = bucketKey(txnDate, timeframe);
      const bucket = buckets.find((b) => b.key === key);
      if (!bucket) return;
      const usd = convertToUSD(t.amount, t.currencyCode);
      if (t.type === "credit") {
        bucket.gross += usd;
        bucket.net += usd;
      } else {
        bucket.net -= usd;
      }
    });

    return buckets;
  }, [completed, timeframe]);

  // Revenue stream breakdown — real category totals, not a fixed pie.
  const revenueStreamPieData = useMemo(() => {
    const totals = new Map<LedgerCategory, number>();
    completed
      .filter((t) => t.type === "credit")
      .forEach((t) => {
        const usd = convertToUSD(t.amount, t.currencyCode);
        totals.set(t.category, (totals.get(t.category) ?? 0) + usd);
      });
    return Array.from(totals.entries())
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        name: LEDGER_CATEGORY_LABELS[category],
        value,
        color: CATEGORY_COLORS[category],
      }));
  }, [completed]);

  // Operational outflows by vendor — real debit totals grouped by payee.
  const outflowBarData = useMemo(() => {
    const totals = new Map<string, number>();
    completed
      .filter((t) => t.type === "debit" && t.category === "Operational Outflow")
      .forEach((t) => {
        const usd = convertToUSD(t.amount, t.currencyCode);
        totals.set(t.accountName, (totals.get(t.accountName) ?? 0) + usd);
      });
    return Array.from(totals.entries()).map(([name, cost]) => ({ name, cost }));
  }, [completed]);

  // Account creation vs financial activation — real org counts, grouped by
  // whether each org has at least one completed ledger transaction.
  const activationByType = useMemo(() => {
    const grouped = new Map<string, { created: number; active: number }>();
    organizations.forEach((org) => {
      const entry = grouped.get(org.type) ?? { created: 0, active: 0 };
      entry.created += 1;
      const hasActivity = completed.some(
        (t) => t.organizationId === org.id || t.accountName === org.name
      );
      if (hasActivity) entry.active += 1;
      grouped.set(org.type, entry);
    });
    return Array.from(grouped.entries()).map(([type, stats]) => ({
      role: ORGANIZATION_TYPE_LABELS[type as keyof typeof ORGANIZATION_TYPE_LABELS] ?? type,
      ...stats,
      rate: stats.created === 0 ? "0%" : `${((stats.active / stats.created) * 100).toFixed(1)}%`,
    }));
  }, [organizations, completed]);

  const grossRevenueTotal = revenueStreamPieData.reduce((sum, s) => sum + s.value, 0);
  const netRevenueTotal = revenueSeries.reduce((sum, b) => sum + b.net, 0);

  // Budget vs Actual — mock monthly targets against real computed actuals
  // for the last 30 days, not a static mock-up.
  // eslint-disable-next-line react-hooks/purity -- "this month" is inherently wall-clock-relative
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const budgetVsActual = (Object.keys(MONTHLY_BUDGET_USD) as LedgerCategory[])
    .filter((category) => MONTHLY_BUDGET_USD[category] > 0)
    .map((category) => {
      const isOutflow = category === "Operational Outflow" || category === "Escrow Settlement";
      const actualUSD = completed
        .filter(
          (t) =>
            t.category === category &&
            new Date(t.date).getTime() >= thirtyDaysAgo &&
            (isOutflow ? t.type === "debit" : t.type === "credit")
        )
        .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);
      const budget = MONTHLY_BUDGET_USD[category];
      return {
        category,
        actualUSD,
        budget,
        variancePct: ((actualUSD - budget) / budget) * 100,
        isOutflow,
      };
    });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Finance Analytics</h1>
          <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-600 border border-cyan-500/20">
            Interactive Drill-Down
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Revenue trends, fee breakdowns, and outflow analysis — all computed from the shared
          ledger feed, in USD.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Gross Revenue vs. Net Revenue Trend</CardTitle>
              <CardDescription className="text-xs">
                Platform revenue before and after operational outflows, in USD.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`rounded px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                    timeframe === t
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Revenue"]}
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Area type="monotone" dataKey="gross" name="Gross Revenue" stroke="#10b981" fillOpacity={1} fill="url(#grossGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="net" name="Net Revenue" stroke="#0ea5e9" fillOpacity={1} fill="url(#netGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-emerald-600" />
              <span>Platform Revenue Stream Breakdown</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {revenueStreamPieData.length === 0
                ? "No completed revenue transactions yet."
                : `Total: ${formatUSD(grossRevenueTotal)}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueStreamPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {revenueStreamPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Revenue"]}
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t">
              {revenueStreamPieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-foreground text-[11px] truncate max-w-[170px]" title={item.name}>{item.name}</span>
                  </div>
                  <span className="font-mono text-muted-foreground">{formatUSD(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-rose-600" />
              <span>Operational Outflows by Vendor</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Zowasel&rsquo;s own vendor/API spend, from the shared ledger.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {outflowBarData.length === 0 ? (
              <p className="py-10 text-center text-xs text-muted-foreground">No operational outflows recorded yet.</p>
            ) : (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={outflowBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Cost"]}
                      contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                    />
                    <Bar dataKey="cost" name="Expense Amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Account Creation vs. Financial Activation</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Real organizations, grouped by whether they have a completed ledger transaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 border rounded-lg bg-card">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">Total Orgs</p>
                <p className="text-xl font-extrabold text-foreground">{organizations.length}</p>
              </div>
              <div className="p-3 border rounded-lg bg-indigo-500/5 border-indigo-500/20">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">Financially Active</p>
                <p className="text-xl font-extrabold text-indigo-600">
                  {activationByType.reduce((s, a) => s + a.active, 0)}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-card">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">Net Revenue (Chart Period)</p>
                <p className="text-lg font-extrabold text-foreground flex items-center justify-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatUSD(netRevenueTotal)}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs pt-1">
              {activationByType.map((group) => (
                <div key={group.role} className="space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-foreground">{group.role}</span>
                    <span className="font-mono text-indigo-600">
                      {group.active} active / {group.created} total ({group.rate})
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${group.created === 0 ? 0 : (group.active / group.created) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual — real 30-day actuals against mock monthly
          targets, with variance. For outflow categories, over-budget is
          the bad direction; for revenue categories, under-budget is. */}
      <Card className="border shadow-2xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Budget vs. Actual (Last 30 Days)
          </CardTitle>
          <CardDescription className="text-xs">
            {actingOfficer.geographicScopeLevel === "global"
              ? "Mock monthly targets against real computed actuals, per category."
              : "Company-wide monthly targets — actuals below are narrowed to your scope, the target is not."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {budgetVsActual.map((b) => {
            const over = b.variancePct > 0;
            const badDirection = b.isOutflow ? over : !over;
            return (
              <div key={b.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-foreground">{LEDGER_CATEGORY_LABELS[b.category]}</span>
                  <span className="font-mono text-muted-foreground">
                    {formatUSD(b.actualUSD)} / {formatUSD(b.budget)} target
                    <span className={`ml-2 ${badDirection ? "text-rose-600" : "text-emerald-600"}`}>
                      ({over ? "+" : ""}{b.variancePct.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${badDirection ? "bg-rose-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min((b.actualUSD / b.budget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
