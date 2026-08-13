"use client";

import { useMemo, useState } from "react";
import {
  PieChart as PieChartIcon,
  Zap,
  Users,
  DollarSign,
  Target,
  Calendar,
  TrendingUp,
  Landmark,
  ShieldCheck,
  FileText,
  Download,
  Sliders,
  BarChart3,
  Layers,
  Coins,
  Scale,
  Settings,
  CheckCircle2,
  Building2,
  X,
  Check,
  Plus,
} from "lucide-react";
import WhtCertificateModal from "@/features/finance-hub/components/WhtCertificateModal";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
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
import { Button } from "@/components/ui/button";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { convertToUSD, formatUSD } from "@/features/finance-hub/utils/currency";
import { LEDGER_CATEGORY_LABELS, WHT_RATES_BY_COUNTRY } from "@/constants/finance";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { LedgerCategory } from "@/types/finance";

const CATEGORY_COLORS: Record<LedgerCategory, string> = {
  "Platform Fee": "#10b981", // Emerald
  Subscription: "#0ea5e9", // Sky
  "Dispute Fee": "#f59e0b", // Amber
  "Escrow Settlement": "#8b5cf6", // Purple
  "Operational Outflow": "#f43f5e", // Rose / Red
  "Internal Transfer": "#64748b", // Slate
};

type Timeframe = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

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
  if (timeframe === "quarterly") {
    const q = Math.floor(date.getMonth() / 3) + 1;
    return `Q${q} '${String(date.getFullYear()).slice(-2)}`;
  }
  return `${date.getFullYear()}`;
}

function bucketKey(date: Date, timeframe: Timeframe): number {
  if (timeframe === "daily") return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  if (timeframe === "weekly") return Math.floor(date.getTime() / (1000 * 60 * 60 * 24 * 7));
  if (timeframe === "monthly") return date.getFullYear() * 12 + date.getMonth();
  if (timeframe === "quarterly") return date.getFullYear() * 4 + Math.floor(date.getMonth() / 3);
  return date.getFullYear();
}

const BUCKET_COUNT: Record<Timeframe, number> = { daily: 14, weekly: 8, monthly: 6, quarterly: 4, yearly: 3 };
const BUCKET_MS: Record<Timeframe, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
  quarterly: 90 * 24 * 60 * 60 * 1000,
  yearly: 365 * 24 * 60 * 60 * 1000,
};

const YEAR_OPTIONS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

// Mock GMV & Credit Data
const mockCropGmvData = [
  { crop: "Maize (Corn)", gmvNative: 5415000000, gmvUSD: 3493548, percentage: 38, color: "#10b981" },
  { crop: "Paddy Rice", gmvNative: 3705000000, gmvUSD: 2390322, percentage: 26, color: "#0ea5e9" },
  { crop: "Soybean", gmvNative: 2565000000, gmvUSD: 1654838, percentage: 18, color: "#8b5cf6" },
  { crop: "Wheat", gmvNative: 1425000000, gmvUSD: 919354, percentage: 10, color: "#f59e0b" },
  { crop: "Sesame / Cocoa", gmvNative: 1140000000, gmvUSD: 735483, percentage: 8, color: "#ec4899" },
];

const mockCreditObligors = [
  { id: "obl_01", name: "Olam Grains West Africa", segment: "Corporate Processor", disbursedUSD: 850000, nplStatus: "Performing", riskRating: "AAA", collateralRatio: 160 },
  { id: "obl_02", name: "Flour Mills of Nigeria Plc", segment: "Corporate Processor", disbursedUSD: 620000, nplStatus: "Performing", riskRating: "AAA", collateralRatio: 180 },
  { id: "obl_03", name: "Riverbend Farmers Union", segment: "Cooperative Union", disbursedUSD: 310000, nplStatus: "Performing", riskRating: "AA", collateralRatio: 140 },
  { id: "obl_04", name: "Kano Commodity Aggregators", segment: "Grain Aggregator", disbursedUSD: 220000, nplStatus: "Watchlist (>30 Days)", riskRating: "BB", collateralRatio: 110 },
  { id: "obl_05", name: "Rift Valley Grain Producers", segment: "Regional Cooperative", disbursedUSD: 180000, nplStatus: "Performing", riskRating: "A", collateralRatio: 135 },
];

export default function FinanceHubAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [primaryYear, setPrimaryYear] = useState<number>(2026);
  const [compareYear, setCompareYear] = useState<number>(2025);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [whtCertVendor, setWhtCertVendor] = useState<{ vendorName: string; countryCode: string; countryName: string; grossUSD: number; whtRate: number } | null>(null);

  // In-Chart Interactive Visualization Selector States
  const [overviewChartType, setOverviewChartType] = useState<"area" | "line" | "bar" | "composed">("area");
  const [categoryChartType, setCategoryChartType] = useState<"donut" | "pie" | "bar">("donut");
  const [outflowChartType, setOutflowChartType] = useState<"bar" | "area" | "line">("bar");
  const [liquidityChartType, setLiquidityChartType] = useState<"area" | "line" | "bar">("area");
  const [budgetChartType, setBudgetChartType] = useState<"progress" | "bar" | "composed">("progress");
  const [whtCountryFilter, setWhtCountryFilter] = useState<string>("All");

  // Tab 2 Sub-Sub Section & Activation View States
  const [categorySubTab, setCategorySubTab] = useState<"revenue" | "outflows" | "activation">("revenue");
  const [activationViewMode, setActivationViewMode] = useState<"grouped-bar" | "stacked-bar" | "funnel" | "donut">("grouped-bar");

  // Custom Activation Criteria Modal & State
  const [showActivationCriteriaModal, setShowActivationCriteriaModal] = useState(false);
  const [minTxnCount, setMinTxnCount] = useState(3);
  const [minVolumeNGN, setMinVolumeNGN] = useState(1000000);
  const [activeDaysWindow, setActiveDaysWindow] = useState(30);

  const analyticsPills = [
    { id: "overview", label: "Overview & YoY Revenue", icon: TrendingUp },
    { id: "categories", label: "Category & Product Breakdown", icon: PieChartIcon },
    { id: "liquidity", label: "13-Wk Liquidity Forecast", icon: DollarSign, badge: "14.2 Mos" },
    { id: "tax", label: "Tax & Statutory WHT", icon: Landmark, badge: "WHT 10%" },
    { id: "budget", label: "Budget Performance", icon: Target },
    { id: "gmv", label: "GMV & Trade Value", icon: Coins, badge: "₦14.2B" },
    { id: "credit", label: "Credit & Alternative Finance", icon: Scale, badge: "NPL 2.4%" },
  ];

  const { transactions } = useLedgerTransactions();
  const { organizations: allOrganizations } = useOrganizations();
  const { actingOfficer, isCountryInScope } = useActingFinanceOfficer();

  const organizations = allOrganizations.filter((org) => isCountryInScope(org.countryCode));

  const completed = useMemo(() => {
    return transactions.filter((t) => {
      if (t.status !== "Completed") return false;
      const tTime = new Date(t.date).getTime();
      if (startDate && tTime < new Date(startDate).getTime()) return false;
      if (endDate && tTime > new Date(endDate).getTime() + 86400000) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  // Gross vs Net revenue trend with dynamic YoY baseline simulation
  const revenueSeries = useMemo(() => {
    const count = BUCKET_COUNT[timeframe];
    const bucketMs = BUCKET_MS[timeframe];
    const now = Date.now();

    const buckets = Array.from({ length: count }, (_, i) => {
      const bucketDate = new Date(now - (count - 1 - i) * bucketMs);
      return {
        key: bucketKey(bucketDate, timeframe),
        label: bucketLabel(bucketDate, timeframe),
        gross: 0,
        net: 0,
        outflows: 0,
        compareGross: 0,
      };
    });

    completed.forEach((t) => {
      const d = new Date(t.date);
      const k = bucketKey(d, timeframe);
      const bucket = buckets.find((b) => b.key === k);
      if (bucket) {
        const usdVal = convertToUSD(t.amount, t.currencyCode);
        if (t.type === "credit") {
          bucket.gross += usdVal;
          bucket.net += usdVal * 0.85; // Net retained revenue (85% after payout fees)
        } else if (t.type === "debit") {
          bucket.outflows += usdVal;
        }
      }
    });

    // Simulate baseline comparative year data based on primary vs compare year ratio
    const yearDiff = primaryYear - compareYear;
    const yearGrowthFactor = 1 - Math.min(0.5, Math.max(-0.5, yearDiff * 0.08));

    return buckets.map((b) => ({
      ...b,
      compareGross: Math.round(b.gross * yearGrowthFactor * 0.85),
    }));
  }, [completed, timeframe, primaryYear, compareYear]);

  // Category breakdown for Pie/Bar charts
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    completed.forEach((t) => {
      if (t.type === "credit") {
        const usdVal = convertToUSD(t.amount, t.currencyCode);
        map[t.category] = (map[t.category] || 0) + usdVal;
      }
    });
    return Object.entries(map).map(([name, value]) => ({
      name: LEDGER_CATEGORY_LABELS[name as LedgerCategory] || name,
      value,
      color: CATEGORY_COLORS[name as LedgerCategory] || "#94a3b8",
    }));
  }, [completed]);

  // Vendor Outflow breakdown
  const vendorOutflowData = useMemo(() => {
    const map: Record<string, number> = {};
    completed.forEach((t) => {
      if (t.type === "debit" && t.accountName) {
        const usdVal = convertToUSD(t.amount, t.currencyCode);
        map[t.accountName] = (map[t.accountName] || 0) + usdVal;
      }
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [completed]);

  // Account creation vs financial activation benchmark
  const activationBenchmarkData = useMemo(() => {
    const typeMap: Record<string, { total: number; active: number }> = {};
    organizations.forEach((org) => {
      const typeLabel = ORGANIZATION_TYPE_LABELS[org.type] || org.type;
      if (!typeMap[typeLabel]) typeMap[typeLabel] = { total: 0, active: 0 };
      typeMap[typeLabel].total += 1;
      if (org.isFinanciallyActive) typeMap[typeLabel].active += 1;
    });

    return Object.entries(typeMap).map(([type, data]) => ({
      type,
      total: data.total,
      active: data.active,
      inactive: data.total - data.active,
      activationRate: data.total > 0 ? (data.active / data.total) * 100 : 0,
    }));
  }, [organizations]);

  // Budget vs Actual tracker across 6 ledger categories
  const budgetVsActual = useMemo(() => {
    const actualMap: Record<LedgerCategory, number> = {
      "Platform Fee": 0,
      Subscription: 0,
      "Dispute Fee": 0,
      "Escrow Settlement": 0,
      "Operational Outflow": 0,
      "Internal Transfer": 0,
    };

    completed.forEach((t) => {
      const usdVal = convertToUSD(t.amount, t.currencyCode);
      if (actualMap[t.category] !== undefined) {
        actualMap[t.category] += usdVal;
      }
    });

    const budgetTargets: Record<LedgerCategory, number> = {
      "Platform Fee": 180000,
      Subscription: 45000,
      "Dispute Fee": 12000,
      "Escrow Settlement": 350000,
      "Operational Outflow": 95000,
      "Internal Transfer": 150000,
    };

    return (Object.keys(budgetTargets) as LedgerCategory[]).map((cat) => {
      const actualUSD = actualMap[cat] || 0;
      const budget = budgetTargets[cat];
      const variancePct = budget > 0 ? ((actualUSD - budget) / budget) * 100 : 0;
      const isOutflow = cat === "Operational Outflow";
      return {
        category: cat,
        actualUSD,
        budget,
        variancePct,
        isOutflow,
      };
    });
  }, [completed]);

  // Statutory WHT calculations per vendor
  const whtSummaryData = useMemo(() => {
    const vendorMap: Record<string, { vendorName: string; countryCode: string; countryName: string; grossUSD: number; whtRate: number; whtLiabilityUSD: number }> = {};

    completed.forEach((t) => {
      if (t.type === "debit" && t.accountName) {
        const cCode = t.countryCode || "NG";
        const grossUSD = convertToUSD(t.amount, t.currencyCode);
        const whtRate = WHT_RATES_BY_COUNTRY[cCode] || 0.10;
        const key = `${t.accountName}_${cCode}`;

        if (!vendorMap[key]) {
          vendorMap[key] = {
            vendorName: t.accountName,
            countryCode: cCode,
            countryName: cCode === "NG" ? "Nigeria" : cCode === "KE" ? "Kenya" : "Tanzania",
            grossUSD: 0,
            whtRate,
            whtLiabilityUSD: 0,
          };
        }
        vendorMap[key].grossUSD += grossUSD;
        vendorMap[key].whtLiabilityUSD += grossUSD * whtRate;
      }
    });

    return Object.values(vendorMap).filter((item) => {
      if (whtCountryFilter === "All") return true;
      return item.countryCode === whtCountryFilter;
    });
  }, [completed, whtCountryFilter]);

  const handleExportCSV = (filename: string, rows: Record<string, any>[]) => {
    if (!rows || rows.length === 0) {
      return;
    }
    const headers = Object.keys(rows[0]).join(",");
    const csvLines = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...csvLines].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Finance Analytics & BI Intelligence</h1>
            <PageHeaderInfo
              title="Finance Analytics Scope"
              description="Enterprise BI workspace covering Gross vs Net Revenue, Year-over-Year (YoY) multi-year benchmarking, GMV & trade order volumes, credit NPL risk, 13-week liquidity projections, statutory WHT remittance, and budget vs actual performance."
            />
          </div>
        </div>
      </div>

      {/* Pill Navigation Bar */}
      <SubSectionPillNav items={analyticsPills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB 1: Overview & YoY Revenue */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card className="w-full border shadow-2xs">
            <CardHeader className="space-y-3 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <span>Gross vs. Net Revenue Trend & Multi-Year YoY Comparison</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Multi-timeframe gross vs net revenue tracking with flexible multi-year YoY benchmarking ({primaryYear} vs. {compareYear}) across daily, weekly, monthly, quarterly, and yearly intervals.
                  </CardDescription>
                </div>
              </div>

              {/* Dedicated Controls Toolbar Row */}
              <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 border bg-muted/30 px-2.5 py-1 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Range:</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
                    />
                    <span className="text-muted-foreground">&ndash;</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 border bg-card p-1 rounded-lg">
                    <span className="text-[11px] text-muted-foreground font-bold px-1">Year:</span>
                    <select
                      value={primaryYear}
                      onChange={(e) => setPrimaryYear(Number(e.target.value))}
                      className="rounded bg-background border px-1.5 py-0.5 text-xs font-extrabold text-foreground focus:outline-none"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="text-[11px] text-muted-foreground font-bold">vs:</span>
                    <select
                      value={compareYear}
                      onChange={(e) => setCompareYear(Number(e.target.value))}
                      className="rounded bg-background border px-1.5 py-0.5 text-xs font-extrabold text-foreground focus:outline-none"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 border bg-card p-1 rounded-lg">
                    <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                    <select
                      value={overviewChartType}
                      onChange={(e) => setOverviewChartType(e.target.value as any)}
                      className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                    >
                      <option value="area">Area Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="bar">Grouped Bar</option>
                      <option value="composed">Composed Combo</option>
                    </select>
                  </div>

                  <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs font-bold">
                    {(["daily", "weekly", "monthly", "quarterly", "yearly"] as Timeframe[]).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`rounded-md px-2.5 py-1 text-xs capitalize transition-all ${
                          timeframe === tf ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleExportCSV(
                        `revenue-trend-${primaryYear}-vs-${compareYear}`,
                        revenueSeries.map((s) => ({
                          Interval: s.label,
                          [`Gross Revenue ${primaryYear} (USD)`]: s.gross,
                          [`Net Revenue ${primaryYear} (USD)`]: s.net,
                          [`Benchmark Gross ${compareYear} (USD)`]: s.compareGross,
                          [`Outflows ${primaryYear} (USD)`]: s.outflows,
                        }))
                      )
                    }
                    className="h-8 text-xs font-bold gap-1.5 border-card"
                  >
                    <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[380px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {overviewChartType === "area" ? (
                    <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Area type="monotone" dataKey="gross" name={`Gross Revenue (${primaryYear})`} stroke="#10b981" fillOpacity={1} fill="url(#grossGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="net" name={`Net Revenue (${primaryYear})`} stroke="#0ea5e9" fillOpacity={1} fill="url(#netGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="compareGross" name={`Benchmark Gross (${compareYear})`} stroke="#94a3b8" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                    </AreaChart>
                  ) : overviewChartType === "line" ? (
                    <LineChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Line type="monotone" dataKey="gross" name={`Gross Revenue (${primaryYear})`} stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="net" name={`Net Revenue (${primaryYear})`} stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="compareGross" name={`Benchmark Gross (${compareYear})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  ) : overviewChartType === "bar" ? (
                    <BarChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Bar dataKey="gross" name={`Gross Revenue (${primaryYear})`} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="net" name={`Net Revenue (${primaryYear})`} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="compareGross" name={`Benchmark Gross (${compareYear})`} fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.6} />
                    </BarChart>
                  ) : (
                    <ComposedChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Bar dataKey="gross" name={`Gross Revenue (${primaryYear})`} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="net" name={`Net Revenue (${primaryYear})`} stroke="#0ea5e9" strokeWidth={2.5} />
                      <Line type="monotone" dataKey="compareGross" name={`Benchmark Gross (${compareYear})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Category & Product Breakdown */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Sub-Sub Section Nav Pills */}
          <div className="flex items-center gap-2 border-b pb-3">
            <button
              onClick={() => setCategorySubTab("revenue")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categorySubTab === "revenue"
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              🍩 Full Revenue Stream Breakdown
            </button>

            <button
              onClick={() => setCategorySubTab("outflows")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categorySubTab === "outflows"
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              ⚡ Operational Outflows by Vendor
            </button>

            <button
              onClick={() => setCategorySubTab("activation")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categorySubTab === "activation"
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              👥 Account Creation vs. Activation
            </button>
          </div>

          {/* Sub-Sub View 1: Revenue Stream Breakdown */}
          {categorySubTab === "revenue" && (
            <Card className="w-full border shadow-2xs">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-primary" />
                    <span>Full Revenue Stream Breakdown</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Aggregated platform revenue share by fee category (Platform Fee, Subscriptions, Dispute Fees, Escrow Clearing).
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold pt-2 sm:pt-0">
                  <div className="flex items-center gap-1 border bg-card p-1 rounded-lg">
                    <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                    <select
                      value={categoryChartType}
                      onChange={(e) => setCategoryChartType(e.target.value as "donut" | "pie" | "bar")}
                      className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                    >
                      <option value="donut">Donut Chart</option>
                      <option value="pie">Solid Pie</option>
                      <option value="bar">Category Bar</option>
                    </select>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleExportCSV(
                        "revenue-category-breakdown",
                        categoryData.map((c) => ({ Category: c.name, "Revenue USD": c.value }))
                      )
                    }
                    className="h-8 text-xs font-bold gap-1.5 border-card"
                  >
                    <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-[340px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {categoryChartType === "bar" ? (
                      <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Revenue"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="value" name="Revenue USD" fill="#10b981" radius={[4, 4, 0, 0]}>
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={categoryChartType === "donut" ? 70 : 0}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${formatUSD(entry.value)}`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Revenue"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sub-Sub View 2: Operational Outflows by Vendor */}
          {categorySubTab === "outflows" && (
            <Card className="w-full border shadow-2xs">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-rose-600" />
                    <span>Operational Outflows by Vendor & Vendor Category</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Granular tracking of operational expense outflows by vendor (SMS Gateways, Cloud Infrastructure, Legal, Escrow Clearing).
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold pt-2 sm:pt-0">
                  <div className="flex items-center gap-1 border bg-card p-1 rounded-lg">
                    <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                    <select
                      value={outflowChartType}
                      onChange={(e) => setOutflowChartType(e.target.value as "bar" | "area" | "line")}
                      className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                    >
                      <option value="bar">Horizontal Bar</option>
                      <option value="area">Area Outflow</option>
                      <option value="line">Line Trend</option>
                    </select>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleExportCSV(
                        "operational-vendor-outflows",
                        vendorOutflowData.map((v) => ({ Vendor: v.name, "Outflow USD": v.value }))
                      )
                    }
                    className="h-8 text-xs font-bold gap-1.5 border-card"
                  >
                    <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-[340px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {outflowChartType === "bar" ? (
                      <BarChart data={vendorOutflowData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={140} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Outflow"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="value" name="Vendor Outflow USD" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    ) : outflowChartType === "area" ? (
                      <AreaChart data={vendorOutflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Outflow"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="value" name="Vendor Outflow USD" stroke="#f43f5e" fillOpacity={1} fill="url(#outflowGrad)" strokeWidth={2} />
                      </AreaChart>
                    ) : (
                      <LineChart data={vendorOutflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Outflow"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Line type="monotone" dataKey="value" name="Vendor Outflow USD" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sub-Sub View 3: Account Creation vs Financial Activation */}
          {categorySubTab === "activation" && (
            <Card className="w-full border shadow-2xs">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Users className="h-4 w-4 text-sky-600" />
                    <span>Account Creation vs. Financial Activation Benchmark</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Entity registration volume compared against financially active transacting entities across platform roles.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold pt-2 sm:pt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowActivationCriteriaModal(true)}
                    className="h-8 text-xs font-bold gap-1.5 border-primary/30 text-primary"
                  >
                    <Settings className="h-3.5 w-3.5" /> Configure Active Criteria
                  </Button>

                  <div className="flex items-center gap-1 border bg-card p-1 rounded-lg">
                    <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                    <select
                      value={activationViewMode}
                      onChange={(e) => setActivationViewMode(e.target.value as any)}
                      className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                    >
                      <option value="grouped-bar">Grouped Bar</option>
                      <option value="stacked-bar">100% Stacked Ratio</option>
                      <option value="funnel">Conversion Funnel</option>
                      <option value="donut">Active vs Inactive Donut</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activationViewMode === "grouped-bar" ? (
                  <div className="h-[340px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activationBenchmarkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Bar dataKey="total" name="Total Registered Accounts" fill="#64748b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="active" name="Financially Active Accounts" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : activationViewMode === "stacked-bar" ? (
                  <div className="h-[340px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activationBenchmarkData} stackOffset="expand" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [Number(val).toLocaleString(), "Count"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Bar dataKey="active" name="Active % Share" stackId="a" fill="#10b981" />
                        <Bar dataKey="inactive" name="Inactive / Idle % Share" stackId="a" fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : activationViewMode === "funnel" ? (
                  <div className="space-y-3 pt-2">
                    {activationBenchmarkData.map((item) => (
                      <div key={item.type} className="p-3 border rounded-xl bg-card space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-foreground text-sm">{item.type}</span>
                          <span className="font-mono text-emerald-600 font-extrabold">
                            {item.active} active / {item.total} total ({item.activationRate.toFixed(1)}% Conversion)
                          </span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.activationRate}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[340px] w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Financially Active Accounts", value: activationBenchmarkData.reduce((s, a) => s + a.active, 0), color: "#10b981" },
                            { name: "Inactive / Pending Accounts", value: activationBenchmarkData.reduce((s, a) => s + a.inactive, 0), color: "#94a3b8" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}`}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#94a3b8" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: 13-Week Liquidity Forecast */}
      {activeTab === "liquidity" && (
        <div className="space-y-6">
          <Card className="w-full border shadow-2xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span>13-Week Rolling Liquidity Runway & Cash Flow Model</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Projects cash inflows and outflows over a 13-week quarter against foreign exchange settlement rates.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold pt-2 sm:pt-0">
                <span className="text-[11px] bg-emerald-500/10 text-emerald-600 font-extrabold px-3 py-1 rounded-md border border-emerald-500/20">
                  14.2 Months Cash Runway Cushion
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[340px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { week: "Wk 1", Inflow: 450000, Outflow: 180000, NetLiquidity: 270000 },
                      { week: "Wk 2", Inflow: 520000, Outflow: 210000, NetLiquidity: 310000 },
                      { week: "Wk 3", Inflow: 380000, Outflow: 190000, NetLiquidity: 190000 },
                      { week: "Wk 4", Inflow: 640000, Outflow: 240000, NetLiquidity: 400000 },
                      { week: "Wk 5", Inflow: 490000, Outflow: 220000, NetLiquidity: 270000 },
                      { week: "Wk 6", Inflow: 580000, Outflow: 200000, NetLiquidity: 380000 },
                      { week: "Wk 7", Inflow: 710000, Outflow: 260000, NetLiquidity: 450000 },
                      { week: "Wk 8", Inflow: 600000, Outflow: 230000, NetLiquidity: 370000 },
                      { week: "Wk 9", Inflow: 650000, Outflow: 250000, NetLiquidity: 400000 },
                      { week: "Wk 10", Inflow: 780000, Outflow: 280000, NetLiquidity: 500000 },
                      { week: "Wk 11", Inflow: 820000, Outflow: 300000, NetLiquidity: 520000 },
                      { week: "Wk 12", Inflow: 890000, Outflow: 310000, NetLiquidity: 580000 },
                      { week: "Wk 13", Inflow: 940000, Outflow: 330000, NetLiquidity: 610000 },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Area type="monotone" dataKey="Inflow" name="Projected Cash Inflow USD" stroke="#10b981" fillOpacity={1} fill="url(#inflowGrad)" strokeWidth={2} />
                    <Line type="monotone" dataKey="Outflow" name="Projected Outflow USD" stroke="#f43f5e" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: Tax & Statutory WHT */}
      {activeTab === "tax" && (
        <div className="space-y-6">
          {/* FIRS ATRS API Telemetry Card */}
          <Card className="border shadow-2xs bg-card">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-indigo-600" />
                    <span>FIRS ATRS REST API & TaxPro Max Remittance Gateway</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Automated Tax Remittance System (ATRS) API integration for direct tax credit note submission & monthly e-Tax portal spooling.
                  </CardDescription>
                </div>

                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 font-extrabold px-3 py-1 rounded-md border border-emerald-500/20 text-xs">
                  <ShieldCheck className="h-4 w-4" /> Connected to FIRS ATRS Gateway
                </span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3 text-xs font-semibold">
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">ATRS Client Identification</span>
                <p className="font-mono font-bold text-foreground">FIRS-ATRS-ZW-992014</p>
              </div>
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">API Endpoint Telemetry</span>
                <p className="font-mono font-bold text-indigo-600">https://atrs.firs.gov.ng/api/v1/bills</p>
              </div>
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Tax Authority Compliance</span>
                <p className="font-bold text-emerald-600">Nigeria (FIRS/LRS) • Kenya (KRA) • Tanzania (TRA)</p>
              </div>
            </CardContent>
          </Card>

          {/* WHT Vendor Table */}
          <Card className="w-full border shadow-2xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <span>Statutory Withholding Tax (WHT) Remittance Schedule</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  WHT deductions on operational vendor payouts, supporting 1-click tax credit note issuance and FIRS TaxPro Max Excel spooling.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-bold">Jurisdiction:</span>
                <select
                  value={whtCountryFilter}
                  onChange={(e) => setWhtCountryFilter(e.target.value)}
                  className="rounded-lg border bg-background px-3 py-1 text-xs font-bold text-foreground focus:outline-none"
                >
                  <option value="All">All Jurisdictions</option>
                  <option value="NG">Nigeria (FIRS / LRS)</option>
                  <option value="KE">Kenya (KRA iTax)</option>
                  <option value="TZ">Tanzania (TRA)</option>
                </select>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleExportCSV(
                      "firs-taxpromax-wht-schedule",
                      whtSummaryData.map((w) => ({
                        "Vendor Name": w.vendorName,
                        Jurisdiction: w.countryName,
                        "Gross Outflow USD": w.grossUSD,
                        "WHT Rate %": `${(w.whtRate * 100).toFixed(0)}%`,
                        "WHT Liability USD": w.whtLiabilityUSD,
                        Status: "Credit Note Eligible",
                      }))
                    )
                  }
                  className="h-8 text-xs font-bold gap-1.5 border-card"
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export TaxPro Max CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 font-bold border-b">
                    <tr>
                      <th className="p-3">Vendor / Beneficiary Name</th>
                      <th className="p-3">Tax Jurisdiction</th>
                      <th className="p-3 text-right">Gross Outflow</th>
                      <th className="p-3 text-center">WHT Rate</th>
                      <th className="p-3 text-right">WHT Liability</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold">
                    {whtSummaryData.map((item) => (
                      <tr key={`${item.vendorName}_${item.countryCode}`} className="hover:bg-muted/20">
                        <td className="p-3 font-bold text-foreground">{item.vendorName}</td>
                        <td className="p-3 text-muted-foreground">{item.countryName}</td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">{formatUSD(item.grossUSD)}</td>
                        <td className="p-3 text-center font-mono font-bold text-amber-600">{(item.whtRate * 100).toFixed(0)}%</td>
                        <td className="p-3 text-right font-mono font-extrabold text-emerald-600">{formatUSD(item.whtLiabilityUSD)}</td>
                        <td className="p-3 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setWhtCertVendor({
                                vendorName: item.vendorName,
                                countryCode: item.countryCode,
                                countryName: item.countryName,
                                grossUSD: item.grossUSD,
                                whtRate: item.whtRate * 100,
                              })
                            }
                            className="h-7 text-xs font-bold gap-1 text-primary border-primary/30"
                          >
                            <FileText className="h-3 w-3" /> WHT Credit Note
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: Budget Performance */}
      {activeTab === "budget" && (
        <Card className="w-full border shadow-2xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Budget vs. Actual (30-Day Performance & Variance)
              </CardTitle>
              <CardDescription className="text-xs">
                Monthly target limits against real computed actuals with standardized status color tokens.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1 border bg-card p-1 rounded-lg">
                <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={budgetChartType}
                  onChange={(e) => setBudgetChartType(e.target.value as "progress" | "bar" | "composed")}
                  className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                >
                  <option value="progress">Progress Cards</option>
                  <option value="bar">Target vs Actual Bar</option>
                  <option value="composed">Combo (Bar + Line Target)</option>
                </select>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleExportCSV(
                    "budget-vs-actual-performance",
                    budgetVsActual.map((b) => ({
                      Category: LEDGER_CATEGORY_LABELS[b.category],
                      "Actual USD": b.actualUSD,
                      "Budget USD": b.budget,
                      "Variance %": `${b.variancePct.toFixed(1)}%`,
                    }))
                  )
                }
                className="h-8 text-xs font-bold gap-1.5 border-card"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetChartType === "progress" ? (
              budgetVsActual.map((b) => {
                const over = b.variancePct > 0;
                const badDirection = b.isOutflow ? over : !over;
                return (
                  <div key={b.category} className="space-y-1.5 p-3 border rounded-xl bg-card">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-foreground text-sm">{LEDGER_CATEGORY_LABELS[b.category]}</span>
                      <span className="font-mono text-muted-foreground">
                        {formatUSD(b.actualUSD)} / {formatUSD(b.budget)} target
                        <span className={`ml-2 font-extrabold ${badDirection ? "text-rose-600" : "text-emerald-600"}`}>
                          ({over ? "+" : ""}{b.variancePct.toFixed(0)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full ${badDirection ? "bg-rose-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(100, (b.actualUSD / b.budget) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-[320px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetVsActual.map((b) => ({ name: LEDGER_CATEGORY_LABELS[b.category], Actual: b.actualUSD, Target: b.budget }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Bar dataKey="Actual" name="Actual Amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Target" name="Monthly Target" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 6: GMV & Trade Value */}
      {activeTab === "gmv" && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border bg-emerald-500/5 border-emerald-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gross Merchandise Value (GMV)</p>
                  <Coins className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">₦14.25B</p>
                <p className="mt-1 text-xs text-emerald-600 font-bold">$9,193,548 USD Gross Matched Trade Volume</p>
              </CardContent>
            </Card>

            <Card className="border bg-sky-500/5 border-sky-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Net Merchandise Value (NMV)</p>
                  <DollarSign className="h-4 w-4 text-sky-600" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">₦684.0M</p>
                <p className="mt-1 text-xs text-sky-600 font-bold">$441,290 USD Retained Platform Revenue</p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NMV Retention Margin %</p>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-3xl font-black text-primary">4.80%</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Net platform take rate of GMV</p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Matched Crop Contracts</p>
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">1,420</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Active supply contracts across NG, KE, TZ</p>
              </CardContent>
            </Card>
          </div>

          {/* GMV Crop Commodity Breakdown */}
          <Card className="w-full border shadow-2xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-emerald-600" />
                  <span>GMV Trade Volume by Crop Commodity</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Gross merchandise value breakdown across major agricultural trade commodities (Maize, Rice, Soybean, Wheat, Cocoa).
                </CardDescription>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleExportCSV(
                    "gmv-crop-commodity-breakdown",
                    mockCropGmvData.map((c) => ({
                      Crop: c.crop,
                      "GMV Native ₦": c.gmvNative,
                      "GMV USD": c.gmvUSD,
                      "Percentage Share": `${c.percentage}%`,
                    }))
                  )
                }
                className="h-8 text-xs font-bold gap-1.5 border-card"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export GMV CSV
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[340px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCropGmvData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="gmvUSD"
                      label={(entry: any) => `${entry.crop || entry.name}: ${formatUSD(entry.gmvUSD || entry.value)}`}
                    >
                      {mockCropGmvData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "GMV USD"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 7: Credit & Alternative Finance */}
      {activeTab === "credit" && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border bg-indigo-500/5 border-indigo-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Disbursed Credit Portfolio</p>
                  <Scale className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">₦3.85B</p>
                <p className="mt-1 text-xs text-indigo-600 font-bold">$2,483,870 USD Active Credit Extended</p>
              </CardContent>
            </Card>

            <Card className="border bg-emerald-500/5 border-emerald-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NPL Non-Performing Ratio</p>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-2 text-3xl font-black text-emerald-600">2.40%</p>
                <p className="mt-1 text-xs text-emerald-600 font-bold">Healthy Asset Quality (&lt;3.0% Target)</p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loan Loss Coverage Ratio</p>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">145.0%</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Collateral & Reserve Buffer</p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Credit Obligors</p>
                  <Building2 className="h-4 w-4 text-foreground" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">62 Entities</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">14 Processors • 48 Cooperatives</p>
              </CardContent>
            </Card>
          </div>

          {/* Obligor Risk Concentration Table */}
          <Card className="w-full border shadow-2xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Scale className="h-4 w-4 text-indigo-600" />
                  <span>Top Credit Obligor Risk Concentration Matrix</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Exposure monitoring for top corporate processors and regional farmer cooperative unions holding active credit facilities.
                </CardDescription>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleExportCSV(
                    "credit-obligor-risk-matrix",
                    mockCreditObligors.map((o) => ({
                      "Obligor Name": o.name,
                      Segment: o.segment,
                      "Disbursed USD": o.disbursedUSD,
                      "NPL Status": o.nplStatus,
                      "Credit Rating": o.riskRating,
                      "Collateral Coverage %": `${o.collateralRatio}%`,
                    }))
                  )
                }
                className="h-8 text-xs font-bold gap-1.5 border-card"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Obligor CSV
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 font-bold border-b">
                    <tr>
                      <th className="p-3">Obligor Holder Name</th>
                      <th className="p-3">Segment</th>
                      <th className="p-3 text-right">Disbursed Facility</th>
                      <th className="p-3 text-center">Credit Rating</th>
                      <th className="p-3 text-center">Collateral Coverage</th>
                      <th className="p-3 text-center">NPL Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold">
                    {mockCreditObligors.map((o) => (
                      <tr key={o.id} className="hover:bg-muted/20">
                        <td className="p-3 font-bold text-foreground">{o.name}</td>
                        <td className="p-3 text-muted-foreground">{o.segment}</td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">{formatUSD(o.disbursedUSD)}</td>
                        <td className="p-3 text-center font-mono font-bold text-indigo-600">{o.riskRating}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-600">{o.collateralRatio}%</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              o.nplStatus.includes("Performing")
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            <ShieldCheck className="h-3 w-3" /> {o.nplStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- MODAL: CFO Configure Active Activation Criteria --- */}
      {showActivationCriteriaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> Configure Activation Criteria
              </h3>
              <button onClick={() => setShowActivationCriteriaModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowActivationCriteriaModal(false);
              }}
              className="space-y-4 text-xs font-semibold"
            >
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Minimum Transaction Count</label>
                <input
                  type="number"
                  value={minTxnCount}
                  onChange={(e) => setMinTxnCount(parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Minimum Cumulative Volume (₦)</label>
                <input
                  type="number"
                  value={minVolumeNGN}
                  onChange={(e) => setMinVolumeNGN(parseInt(e.target.value) || 100000)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Recency Window (Days)</label>
                <input
                  type="number"
                  value={activeDaysWindow}
                  onChange={(e) => setActiveDaysWindow(parseInt(e.target.value) || 30)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t">
                <Button type="button" variant="outline" onClick={() => setShowActivationCriteriaModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold">
                  Save Active Policy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {whtCertVendor && (
        <WhtCertificateModal
          vendorName={whtCertVendor.vendorName}
          countryCode={whtCertVendor.countryCode}
          countryName={whtCertVendor.countryName}
          grossAmountUSD={whtCertVendor.grossUSD}
          whtRatePct={whtCertVendor.whtRate}
          onClose={() => setWhtCertVendor(null)}
        />
      )}
    </div>
  );
}
