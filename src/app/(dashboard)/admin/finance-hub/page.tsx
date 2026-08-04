"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Sprout,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  PieChart as PieChartIcon,
  CheckCircle2,
  DollarSign,
  FileCheck2,
  Activity,
  Layers,
  Zap,
  ArrowRight,
  Globe,
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
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";
import { GeographicFilterState } from "@/types/geo";

// Recharts Mock Data Series
const revenueSeriesData = {
  daily: [
    { label: "Mon", gross: 5.4, net: 4.2 },
    { label: "Tue", gross: 6.8, net: 5.4 },
    { label: "Wed", gross: 8.2, net: 6.6 },
    { label: "Thu", gross: 7.9, net: 6.1 },
    { label: "Fri", gross: 9.5, net: 7.8 },
    { label: "Sat", gross: 4.1, net: 3.2 },
    { label: "Sun", gross: 3.8, net: 3.0 },
  ],
  weekly: [
    { label: "Week 1", gross: 38.5, net: 31.2 },
    { label: "Week 2", gross: 42.1, net: 34.5 },
    { label: "Week 3", gross: 48.6, net: 39.8 },
    { label: "Week 4", gross: 55.3, net: 44.6 },
  ],
  monthly: [
    { label: "Jan 2026", gross: 142.5, net: 118.2 },
    { label: "Feb 2026", gross: 156.0, net: 129.4 },
    { label: "Mar 2026", gross: 168.4, net: 138.0 },
    { label: "Apr 2026", gross: 172.1, net: 140.5 },
    { label: "May 2026", gross: 180.2, net: 145.8 },
    { label: "Jun 2026", gross: 184.5, net: 142.1 },
  ],
  yearly: [
    { label: "2023", gross: 680, net: 540 },
    { label: "2024", gross: 1120, net: 890 },
    { label: "2025", gross: 1650, net: 1320 },
    { label: "2026 YTD", gross: 1003, net: 814 },
  ],
};

const revenueStreamPieData = [
  { name: "Marketplace Transaction Fees", value: 95.9, color: "#10b981" },
  { name: "Subscription & SaaS Plans", value: 44.2, color: "#0ea5e9" },
  { name: "Escalation & Dispute Fees", value: 25.8, color: "#f59e0b" },
  { name: "Escrow Service Charges", value: 18.6, color: "#8b5cf6" },
];

const outflowBarData = [
  { name: "Payment Gateways", cost: 4.2 },
  { name: "Identity & KYB API", cost: 3.1 },
  { name: "WhatsApp API", cost: 2.4 },
  { name: "Termii SMS API", cost: 1.8 },
];

const currencySymbols = {
  NGN: { symbol: "₦", rate: 1, label: "NGN (Naira)" },
  USD: { symbol: "$", rate: 0.00067, label: "USD (Dollar)" },
  KES: { symbol: "KSh ", rate: 0.086, label: "KES (Shilling)" },
  GHS: { symbol: "₵", rate: 0.0105, label: "GHS (Cedi)" },
};

export default function FinanceHubPage() {
  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<keyof typeof currencySymbols>("NGN");

  const curr = currencySymbols[currency];
  const isScoped = geoFilter.continent !== "all" || geoFilter.subRegion !== "all" || geoFilter.countryCode !== "all";

  const formatMoney = (valInNgnMillion: any) => {
    const val = Number(valInNgnMillion || 0);
    const converted = val * 1000000 * curr.rate;
    if (converted >= 1000000000) return `${curr.symbol}${(converted / 1000000000).toFixed(2)}B`;
    if (converted >= 1000000) return `${curr.symbol}${(converted / 1000000).toFixed(1)}M`;
    if (converted >= 1000) return `${curr.symbol}${(converted / 1000).toFixed(0)}k`;
    return `${curr.symbol}${converted.toFixed(0)}`;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Finance Hub</h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
              Global Treasury & BI Standard
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {isScoped
              ? "Comprehensive platform-level financial ops, revenue analytics, master ledger, and accounting intelligence."
              : "Comprehensive platform-level financial ops, revenue analytics, master ledger, and accounting intelligence across all regions."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Currency Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-bold shadow-2xs">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-transparent font-bold text-foreground focus:outline-none cursor-pointer"
            >
              {Object.entries(currencySymbols).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>

          <CompactRegionScopeSelector value={geoFilter} onChange={setGeoFilter} />
        </div>
      </div>

      {/* Finance Hub Sub-Domain Nav Tabs */}
      <FinanceHubNav />

      {/* Top Level Financial Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Gross Platform Revenue
              </p>
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{formatMoney(184.5)}</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" /> +18.4% YoY
              </span>
              <span className="text-muted-foreground font-semibold">Net: {formatMoney(142.1)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Marketplace GMV Processed
              </p>
              <TrendingUp className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{formatMoney(1240)}</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-cyan-600 font-bold">84.2% Fulfilled</span>
              <span className="text-muted-foreground font-semibold">Take Rate: 4.85%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Subscription MRR
              </p>
              <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{formatMoney(32.4)}</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-indigo-600 font-bold">ARR: {formatMoney(388.8)}</span>
              <span className="text-muted-foreground font-semibold">+12.2% MoM</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Operational Outflows (Expenses)
              </p>
              <Zap className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{formatMoney(11.5)}</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-rose-600 font-bold">API & Gateway Fees</span>
              <span className="text-muted-foreground font-semibold">6.2% of Revenue</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Recharts Analytics Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Interactive Area Chart: Gross vs Net Revenue */}
        <Card className="lg:col-span-2 border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Gross Revenue vs. Net Revenue Trend</CardTitle>
              <CardDescription className="text-xs">
                Interactive platform revenue performance before and after operational expenses.
              </CardDescription>
            </div>

            {/* Timeframe Selector */}
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
                <AreaChart data={revenueSeriesData[timeframe]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    formatter={(val: any) => [formatMoney(val), "Revenue"]}
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

        {/* Interactive Pie Chart: Platform Fee Streams */}
        <Card className="border shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-emerald-600" />
              <span>Platform Revenue Stream Breakdown</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Incoming revenue streams breakdown by category.
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
                    formatter={(val: any) => [formatMoney(val), "Revenue"]}
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
                  <span className="font-mono text-muted-foreground">{formatMoney(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Recharts Analytics Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interactive Bar Chart: Operational Outflows */}
        <Card className="border shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-rose-600" />
              <span>Operational Outflows by Vendor API Category</span>
            </CardTitle>
            <CardDescription className="text-xs">
              System-level expenditures paid for gateway processing and third-party APIs.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outflowBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [formatMoney(val), "Cost"]}
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                  />
                  <Bar dataKey="cost" name="Expense Amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Registration vs Financial Activation Rate */}
        <Card className="border shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>User Registration vs. Financial Activation</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Monitoring account creation growth alongside users who complete ledger setup and active transacting.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 border rounded-lg bg-card">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">New Accounts</p>
                <p className="text-xl font-extrabold text-foreground">1,420</p>
                <p className="text-[10px] text-muted-foreground">This Month</p>
              </div>
              <div className="p-3 border rounded-lg bg-indigo-500/5 border-indigo-500/20">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">Financially Active</p>
                <p className="text-xl font-extrabold text-indigo-600">1,180</p>
                <p className="text-[10px] text-muted-foreground">83.1% Activation</p>
              </div>
              <div className="p-3 border rounded-lg bg-card">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">Avg Speed to Txn</p>
                <p className="text-xl font-extrabold text-foreground">1.8 Days</p>
                <p className="text-[10px] text-muted-foreground">Onboarding Speed</p>
              </div>
            </div>

            <div className="space-y-3 text-xs pt-1">
              {[
                { role: "Merchants / Agrodealers", created: 480, active: 432, rate: "90.0%" },
                { role: "Commodity Buyers (Corporate)", created: 210, active: 195, rate: "92.8%" },
                { role: "Farmers & Cooperatives", created: 620, active: 480, rate: "77.4%" },
                { role: "Logistics & Warehouse Partners", created: 110, active: 73, rate: "66.4%" },
              ].map((group) => (
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
                      style={{ width: `${(group.active / group.created) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
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
                  View Zowasel master balance, upload CSV/MT940 bank statements, and run automated reconciliation.
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
                  Granular audit log of online/offline transactions, SMS/WhatsApp costs, and offline transaction recorder.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-primary">Record & Audit Transactions &rarr;</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/finance-hub/accounts-monitor" className="group">
          <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-500/10 p-2 text-purple-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-base text-foreground">Accounts Monitoring</h3>
                <p className="text-xs text-muted-foreground">
                  Track all created user and merchant ledger accounts, monitor balances, volume, active vs. dormant status.
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-primary">Monitor Accounts & Ledger &rarr;</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
