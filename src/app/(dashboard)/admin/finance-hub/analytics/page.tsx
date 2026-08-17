"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  PieChart as PieChartIcon,
  Zap,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Landmark,
  ShieldCheck,
  FileText,
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
  ArrowRight,
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
  ReferenceLine,
  TooltipValueType,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import ExportMenu from "@/components/shared/ExportMenu";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useLiquidityForecast } from "@/features/finance-hub/hooks/useLiquidityForecast";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { convertToUSD, formatUSD } from "@/features/finance-hub/utils/currency";
import { LEDGER_CATEGORY_LABELS, WHT_RATES_BY_COUNTRY } from "@/constants/finance";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { LedgerCategory } from "@/types/finance";
import { mockCreditObligors } from "@/features/finance-hub/data/mockCreditObligors";

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

// The one filter control that's genuinely meaningful across tabs beyond
// Overview — Category and Tax/WHT derive from the same date-filtered
// `completed` transaction set, so a shared date range applies to both of
// them for real. Year-compare and timeframe bucketing stay Overview-only
// since they're specific to that trend chart, not something these tabs
// actually compute.
function DateRangeFilterBar({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 border bg-muted/30 px-2.5 py-1 rounded-lg w-fit text-xs font-semibold">
      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-[11px] font-bold text-muted-foreground uppercase">Range:</span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
      />
      <span className="text-muted-foreground">&ndash;</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
      />
    </div>
  );
}

// Reusable filter row for every chart tab besides Overview (which keeps its
// own richer toolbar — year-vs-year and period bucketing that only apply to
// a real trend chart). Lives inside the chart's own CardHeader, not floating
// above the page, so "where are the filters for this chart" always has the
// same answer: right here, next to the chart they filter.
function ChartFilterToolbar({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  right,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
      <div className="flex items-center gap-1.5 border bg-muted/30 px-2.5 py-1 rounded-lg">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] font-bold text-muted-foreground uppercase">Range:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
        />
        <span className="text-muted-foreground">&ndash;</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
        />
      </div>

      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

// Mock GMV & Credit Data
// 18-month generated series (not a single fixed-date snapshot) — a real
// trend/YoY toolbar needs actual monthly data points to bucket and compare,
// the same reason mockLedgerTransactions got the same treatment earlier.
// Seeded so the numbers are stable across reloads, not fresh random on
// every visit.
function gmvSeedRandom(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface CropGmvEntry {
  crop: string;
  gmvNative: number;
  gmvUSD: number;
  color: string;
  date: string;
}

const CROP_PROFILES: { crop: string; color: string; baseMonthlyNGN: number }[] = [
  { crop: "Maize (Corn)", color: "#10b981", baseMonthlyNGN: 5_400_000_000 },
  { crop: "Paddy Rice", color: "#0ea5e9", baseMonthlyNGN: 3_700_000_000 },
  { crop: "Soybean", color: "#8b5cf6", baseMonthlyNGN: 2_550_000_000 },
  { crop: "Wheat", color: "#f59e0b", baseMonthlyNGN: 1_400_000_000 },
  { crop: "Sesame / Cocoa", color: "#ec4899", baseMonthlyNGN: 1_150_000_000 },
];

const NGN_TO_USD_RATE = 1540;

const mockCropGmvData: CropGmvEntry[] = (() => {
  const rand = gmvSeedRandom(70311);
  const entries: CropGmvEntry[] = [];
  for (let m = 17; m >= 0; m--) {
    const monthDate = new Date();
    monthDate.setDate(1);
    monthDate.setMonth(monthDate.getMonth() - m);
    // Mild seasonal wave (harvest-season bump) plus organic month-to-month
    // jitter, so a real trend chart has real shape instead of a flat line.
    const seasonal = 1 + 0.18 * Math.sin((monthDate.getMonth() / 12) * Math.PI * 2);
    CROP_PROFILES.forEach(({ crop, color, baseMonthlyNGN }, cropIndex) => {
      const jitter = 0.85 + rand() * 0.3;
      const gmvNative = Math.round(baseMonthlyNGN * seasonal * jitter);
      entries.push({
        crop,
        color,
        gmvNative,
        gmvUSD: Math.round(gmvNative / NGN_TO_USD_RATE),
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 5 + cropIndex * 4).toISOString().split("T")[0],
      });
    });
  }
  return entries;
})();

// Every GMV/Credit KPI tile below is derived from the two arrays above via
// reduce(), not hand-typed — so the tiles can never drift out of sync with
// the table/chart rendering the same data.
const nmvRetentionMargin = 0.048; // platform's take rate — the one manual input, not derived

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
  const [gmvChartType, setGmvChartType] = useState<"area" | "line" | "bar">("area");
  const [gmvTimeframe, setGmvTimeframe] = useState<Timeframe>("monthly");
  const [gmvPrimaryYear, setGmvPrimaryYear] = useState<number>(2026);
  const [gmvCompareYear, setGmvCompareYear] = useState<number>(2025);
  const [categoryChartType, setCategoryChartType] = useState<"donut" | "pie" | "bar">("donut");
  const [outflowChartType, setOutflowChartType] = useState<"bar">("bar");
  // Shared by both Category sub-views (revenue trend and outflow trend) —
  // switching granularity on one carries over to the other, the same way
  // switching tabs doesn't reset your place. Deliberately its own state, not
  // Overview's timeframe/primaryYear/compareYear — reusing those would mean
  // changing Overview's period silently changes Category's too.
  const [categoryTimeframe, setCategoryTimeframe] = useState<Timeframe>("monthly");
  const [categoryPrimaryYear, setCategoryPrimaryYear] = useState<number>(2026);
  const [categoryCompareYear, setCategoryCompareYear] = useState<number>(2025);
  const [categoryTrendChartType, setCategoryTrendChartType] = useState<"area" | "line" | "bar">("area");
  const [outflowTrendChartType, setOutflowTrendChartType] = useState<"area" | "line" | "bar">("area");
  const [liquidityChartType, setLiquidityChartType] = useState<"area" | "line" | "bar">("area");
  const [whtCountryFilter, setWhtCountryFilter] = useState<string>("All");
  const [whtPageSize, setWhtPageSize] = useState<number>(5);
  const [whtPage, setWhtPage] = useState<number>(1);

  // Liquidity Forecast scenario controls — a historical date-range picker
  // doesn't fit a forward-looking projection (that's a deliberate choice,
  // not a gap), but the finance team can still stress-test it: how far out
  // to project, and two scenario levers that scale the real baseline.
  const [liquidityHorizonWeeks, setLiquidityHorizonWeeks] = useState<number>(13);
  const [liquidityOutflowStress, setLiquidityOutflowStress] = useState<number>(0);
  const [liquidityRenewalConfidence, setLiquidityRenewalConfidence] = useState<number>(100);

  // Tab 2 Sub-Sub Section & Activation View States
  const [categorySubTab, setCategorySubTab] = useState<"revenue" | "outflows" | "activation">("revenue");
  const [activationViewMode, setActivationViewMode] = useState<"grouped-bar" | "stacked-bar" | "funnel" | "donut">("grouped-bar");

  // Custom Activation Criteria Modal & State
  const [showActivationCriteriaModal, setShowActivationCriteriaModal] = useState(false);
  const [minTxnCount, setMinTxnCount] = useState(3);
  const [minVolumeNGN, setMinVolumeNGN] = useState(1000000);
  const [activeDaysWindow, setActiveDaysWindow] = useState(30);

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
      // Rendered as a negative-facing series so the chart can show outflows
      // hanging below the zero line instead of only ever going up.
      outflowsNegative: -b.outflows,
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

  // Revenue category composition over time — real period bucketing plus a
  // YoY benchmark, same methodology as Overview's revenueSeries and GMV's
  // trend. categoryData/vendorOutflowData above answer "what's the share
  // right now"; this answers "how has that composition moved," which a
  // snapshot pie/bar structurally can't show no matter which chart type you
  // pick on it.
  const categoryTrendSeries = useMemo(() => {
    const count = BUCKET_COUNT[categoryTimeframe];
    const bucketMs = BUCKET_MS[categoryTimeframe];
    const now = Date.now();

    const buckets = Array.from({ length: count }, (_, i) => {
      const bucketDate = new Date(now - (count - 1 - i) * bucketMs);
      return {
        key: bucketKey(bucketDate, categoryTimeframe),
        label: bucketLabel(bucketDate, categoryTimeframe),
        "Platform Fee": 0,
        Subscription: 0,
      };
    });

    completed.forEach((t) => {
      if (t.type !== "credit") return;
      if (t.category !== "Platform Fee" && t.category !== "Subscription") return;
      const k = bucketKey(new Date(t.date), categoryTimeframe);
      const bucket = buckets.find((b) => b.key === k);
      if (bucket) bucket[t.category] += convertToUSD(t.amount, t.currencyCode);
    });

    const yearDiff = categoryPrimaryYear - categoryCompareYear;
    const yearGrowthFactor = 1 - Math.min(0.5, Math.max(-0.5, yearDiff * 0.08));

    return buckets.map((b) => {
      const total = b["Platform Fee"] + b.Subscription;
      return { ...b, compareTotal: Math.round(total * yearGrowthFactor) };
    });
  }, [completed, categoryTimeframe, categoryPrimaryYear, categoryCompareYear]);

  // Total operational outflow over time — the real trend the Outflows
  // sub-view's chart-type selector used to imply ("Area Outflow," "Line
  // Trend") without ever actually plotting time on the x-axis; it was
  // secretly the same per-vendor ranking as the bar view, just redrawn.
  const outflowTrendSeries = useMemo(() => {
    const count = BUCKET_COUNT[categoryTimeframe];
    const bucketMs = BUCKET_MS[categoryTimeframe];
    const now = Date.now();

    const buckets = Array.from({ length: count }, (_, i) => {
      const bucketDate = new Date(now - (count - 1 - i) * bucketMs);
      return {
        key: bucketKey(bucketDate, categoryTimeframe),
        label: bucketLabel(bucketDate, categoryTimeframe),
        outflowUSD: 0,
      };
    });

    completed.forEach((t) => {
      if (t.type !== "debit") return;
      const k = bucketKey(new Date(t.date), categoryTimeframe);
      const bucket = buckets.find((b) => b.key === k);
      if (bucket) bucket.outflowUSD += convertToUSD(t.amount, t.currencyCode);
    });

    const yearDiff = categoryPrimaryYear - categoryCompareYear;
    const yearGrowthFactor = 1 - Math.min(0.5, Math.max(-0.5, yearDiff * 0.08));

    return buckets.map((b) => ({ ...b, compareOutflowUSD: Math.round(b.outflowUSD * yearGrowthFactor) }));
  }, [completed, categoryTimeframe, categoryPrimaryYear, categoryCompareYear]);

  // Account creation vs financial activation benchmark — "active" is
  // computed live from the shared ledger feed against the finance team's own
  // configurable policy (Configure Activation Criteria modal below: min
  // transaction count + min cumulative volume, both within a recency
  // window), not a static isFinanciallyActive flag. That flag used to sit
  // permanently false on every org (nothing ever set it), so this chart
  // silently showed 0% activation for every entity type regardless of real
  // activity, and the modal's three inputs did nothing on save.
  const activationBenchmarkData = useMemo(() => {
    const cutoff = Date.now() - activeDaysWindow * 24 * 60 * 60 * 1000;
    const minVolumeUSD = convertToUSD(minVolumeNGN, "NGN");

    const activityByOrg: Record<string, { count: number; volumeUSD: number }> = {};
    transactions.forEach((t) => {
      if (t.status !== "Completed") return;
      if (new Date(t.date).getTime() < cutoff) return;
      const org = organizations.find((o) => o.id === t.organizationId || o.name === t.accountName);
      if (!org) return;
      if (!activityByOrg[org.id]) activityByOrg[org.id] = { count: 0, volumeUSD: 0 };
      activityByOrg[org.id].count += 1;
      activityByOrg[org.id].volumeUSD += convertToUSD(t.amount, t.currencyCode);
    });

    const typeMap: Record<string, { total: number; active: number }> = {};
    organizations.forEach((org) => {
      const typeLabel = ORGANIZATION_TYPE_LABELS[org.type] || org.type;
      if (!typeMap[typeLabel]) typeMap[typeLabel] = { total: 0, active: 0 };
      typeMap[typeLabel].total += 1;
      const activity = activityByOrg[org.id];
      const isActive = !!activity && activity.count >= minTxnCount && activity.volumeUSD >= minVolumeUSD;
      if (isActive) typeMap[typeLabel].active += 1;
    });

    return Object.entries(typeMap).map(([type, data]) => ({
      type,
      total: data.total,
      active: data.active,
      inactive: data.total - data.active,
      activationRate: data.total > 0 ? (data.active / data.total) * 100 : 0,
    }));
  }, [organizations, transactions, minTxnCount, minVolumeNGN, activeDaysWindow]);


  // Shared with the Finance Hub overview cards (useLiquidityForecast) so the
  // two pages can never silently disagree on the same headline number.
  // Uses the raw, unfiltered `transactions` feed — not `completed` (which
  // inherits the shared startDate/endDate range from other tabs). This tab
  // deliberately shows no date-range control (a historical filter doesn't
  // fit a forward-looking projection), so it must not silently pick up a
  // filter left set on another tab; the forecast already does its own
  // real lookback (oldest debit / oldest Platform Fee) independent of any
  // UI filter.
  const liquidityForecast = useLiquidityForecast(transactions, {
    horizonWeeks: liquidityHorizonWeeks,
    outflowStressPct: liquidityOutflowStress,
    renewalConfidencePct: liquidityRenewalConfidence,
  });

  // GMV — genuinely date-filtered (the meeting's own ask), not decorative:
  // every derived total recomputes from whichever crop entries actually
  // fall inside the selected range.
  const filteredCropGmvData = useMemo(() => {
    return mockCropGmvData.filter((c) => {
      const t = new Date(c.date).getTime();
      if (startDate && t < new Date(startDate).getTime()) return false;
      if (endDate && t > new Date(endDate).getTime() + 86400000) return false;
      return true;
    });
  }, [startDate, endDate]);

  const gmvTotalNative = filteredCropGmvData.reduce((sum, c) => sum + c.gmvNative, 0);
  const gmvTotalUSD = filteredCropGmvData.reduce((sum, c) => sum + c.gmvUSD, 0);
  const nmvTotalUSD = Math.round(gmvTotalUSD * nmvRetentionMargin);
  const nmvTotalNative = Math.round(gmvTotalNative * nmvRetentionMargin);

  // Per-crop share within the selected range — computed fresh from whichever
  // rows survive the date filter, not a fixed percentage baked into the mock
  // data (that only ever worked when there was exactly one row per crop).
  const cropShareData = useMemo(() => {
    const totals: Record<string, { gmvNative: number; gmvUSD: number; color: string }> = {};
    filteredCropGmvData.forEach((c) => {
      if (!totals[c.crop]) totals[c.crop] = { gmvNative: 0, gmvUSD: 0, color: c.color };
      totals[c.crop].gmvNative += c.gmvNative;
      totals[c.crop].gmvUSD += c.gmvUSD;
    });
    const grandTotalUSD = Object.values(totals).reduce((s, t) => s + t.gmvUSD, 0);
    return Object.entries(totals)
      .map(([crop, t]) => ({
        crop,
        gmvNative: t.gmvNative,
        gmvUSD: t.gmvUSD,
        color: t.color,
        percentage: grandTotalUSD > 0 ? Math.round((t.gmvUSD / grandTotalUSD) * 100) : 0,
      }))
      .sort((a, b) => b.gmvUSD - a.gmvUSD);
  }, [filteredCropGmvData]);

  const leadingCrop = cropShareData[0];

  // GMV trend — real month-over-month bucketing of the (now 18-month) crop
  // series, same bucketing helpers and YoY simulation methodology as the
  // Overview trend chart, so "granular like Overview" means the same thing
  // in both places instead of a second, different notion of "granular."
  const gmvTrendSeries = useMemo(() => {
    const count = BUCKET_COUNT[gmvTimeframe];
    const bucketMs = BUCKET_MS[gmvTimeframe];
    const now = Date.now();

    const buckets = Array.from({ length: count }, (_, i) => {
      const bucketDate = new Date(now - (count - 1 - i) * bucketMs);
      return {
        key: bucketKey(bucketDate, gmvTimeframe),
        label: bucketLabel(bucketDate, gmvTimeframe),
        gmvUSD: 0,
        compareGmvUSD: 0,
      };
    });

    filteredCropGmvData.forEach((c) => {
      const d = new Date(c.date);
      const k = bucketKey(d, gmvTimeframe);
      const bucket = buckets.find((b) => b.key === k);
      if (bucket) bucket.gmvUSD += c.gmvUSD;
    });

    const yearDiff = gmvPrimaryYear - gmvCompareYear;
    const yearGrowthFactor = 1 - Math.min(0.5, Math.max(-0.5, yearDiff * 0.08));

    return buckets.map((b) => ({
      ...b,
      compareGmvUSD: Math.round(b.gmvUSD * yearGrowthFactor),
    }));
  }, [filteredCropGmvData, gmvTimeframe, gmvPrimaryYear, gmvCompareYear]);

  // Credit — the loose end from the audit closed: obligors now carry a real
  // disbursedAt date (when the loan was actually extended), so the shared
  // date range genuinely filters this tab too, instead of being left off
  // because "there's no date to filter by." There was one — it just wasn't
  // modeled.
  const filteredCreditObligors = useMemo(() => {
    return mockCreditObligors.filter((o) => {
      const t = new Date(o.disbursedAt).getTime();
      if (startDate && t < new Date(startDate).getTime()) return false;
      if (endDate && t > new Date(endDate).getTime() + 86400000) return false;
      return true;
    });
  }, [startDate, endDate]);

  const creditTotalDisbursedUSD = filteredCreditObligors.reduce((sum, o) => sum + o.disbursedUSD, 0);
  const creditWatchlistUSD = filteredCreditObligors
    .filter((o) => o.nplStatus !== "Performing")
    .reduce((sum, o) => sum + o.disbursedUSD, 0);
  const creditNplRatio = creditTotalDisbursedUSD > 0 ? (creditWatchlistUSD / creditTotalDisbursedUSD) * 100 : 0;
  const creditCoverageRatio =
    creditTotalDisbursedUSD > 0
      ? filteredCreditObligors.reduce((sum, o) => sum + o.disbursedUSD * o.collateralRatio, 0) / creditTotalDisbursedUSD
      : 0;
  const creditProcessorCount = filteredCreditObligors.filter((o) => o.segment === "Corporate Processor").length;
  const creditCooperativeCount = filteredCreditObligors.filter((o) => o.segment.toLowerCase().includes("cooperative")).length;

  // Real cumulative growth of the credit book — each obligor's actual
  // disbursedAt date, sorted and running-summed, not a fabricated monthly
  // series. This tab used to just duplicate Accounts Monitoring's per-
  // obligor table; the aggregate/trend view is what an Analytics tab should
  // show, the operational per-account detail stays on Monitoring's page.
  const creditGrowthSeries = useMemo(() => {
    const sorted = [...filteredCreditObligors].sort((a, b) => new Date(a.disbursedAt).getTime() - new Date(b.disbursedAt).getTime());
    let running = 0;
    return sorted.map((o) => {
      running += o.disbursedUSD;
      return {
        label: new Date(o.disbursedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        obligor: o.name,
        cumulativeUSD: running,
      };
    });
  }, [filteredCreditObligors]);

  const creditRiskDistribution = useMemo(() => {
    const map: Record<string, { count: number; disbursedUSD: number }> = {};
    filteredCreditObligors.forEach((o) => {
      const bucket = o.nplStatus.includes("Performing") ? "Performing" : "Watchlist";
      if (!map[bucket]) map[bucket] = { count: 0, disbursedUSD: 0 };
      map[bucket].count += 1;
      map[bucket].disbursedUSD += o.disbursedUSD;
    });
    return Object.entries(map).map(([status, d]) => ({
      status,
      count: d.count,
      disbursedUSD: d.disbursedUSD,
      color: status === "Performing" ? "#10b981" : "#f59e0b",
    }));
  }, [filteredCreditObligors]);

  const analyticsPills = [
    { id: "overview", label: "Overview & YoY Revenue", icon: TrendingUp },
    { id: "categories", label: "Category & Product Breakdown", icon: PieChartIcon },
    { id: "liquidity", label: "13-Wk Liquidity Forecast", icon: DollarSign, badge: `${liquidityForecast.runwayMonths.toFixed(1)} Mos` },
    { id: "tax", label: "Tax & Statutory WHT", icon: Landmark, badge: "WHT 10%" },
    { id: "gmv", label: "GMV & Trade Value", icon: Coins, badge: `₦${(gmvTotalNative / 1_000_000_000).toFixed(1)}B` },
    { id: "credit", label: "Credit & Alternative Finance", icon: Scale, badge: `NPL ${creditNplRatio.toFixed(1)}%` },
  ];

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
            // Real lookup against the platform's one country table — this
            // used to be a 3-way ternary that mislabeled every non-NG/KE
            // country as "Tanzania" (silently wrong for CI, GH, ZA, ZM, etc).
            countryName: GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === cCode)?.countryName || cCode,
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Finance Analytics & BI Intelligence</h1>
            <PageHeaderInfo
              title="Finance Analytics Scope"
              description="Enterprise BI workspace covering Gross vs Net Revenue, Year-over-Year (YoY) multi-year benchmarking, GMV & trade order volumes, credit NPL risk, 13-week liquidity projections, and statutory WHT remittance. Budget vs actual performance now lives on its own Budget Performance page."
            />
          </div>
        </div>
      </div>

      {/* Pill Navigation Bar */}
      <SubSectionPillNav items={analyticsPills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB 1: Overview & YoY Revenue */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card id="overview-revenue-chart" className="w-full border shadow-2xs">
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
                <ExportMenu
                  data={revenueSeries.map((s) => ({
                    Interval: s.label,
                    [`Gross Revenue ${primaryYear} (USD)`]: s.gross,
                    [`Net Revenue ${primaryYear} (USD)`]: s.net,
                    [`Benchmark Gross ${compareYear} (USD)`]: s.compareGross,
                    [`Outflows ${primaryYear} (USD)`]: s.outflows,
                  }))}
                  columns={[
                    { header: "Interval", accessor: "Interval" },
                    { header: `Gross Revenue ${primaryYear} (USD)`, accessor: `Gross Revenue ${primaryYear} (USD)` },
                    { header: `Net Revenue ${primaryYear} (USD)`, accessor: `Net Revenue ${primaryYear} (USD)` },
                    { header: `Benchmark Gross ${compareYear} (USD)`, accessor: `Benchmark Gross ${compareYear} (USD)` },
                    { header: `Outflows ${primaryYear} (USD)`, accessor: `Outflows ${primaryYear} (USD)` },
                  ]}
                  filename={`revenue-trend-${primaryYear}-vs-${compareYear}`}
                  targetElementId="overview-revenue-chart"
                />
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
                        <linearGradient id="outflowsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ReferenceLine y={0} stroke="#94a3b8" />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Area type="monotone" dataKey="gross" name={`Gross Revenue (${primaryYear})`} stroke="#10b981" fillOpacity={1} fill="url(#grossGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="net" name={`Net Revenue (${primaryYear})`} stroke="#0ea5e9" fillOpacity={1} fill="url(#netGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="compareGross" name={`Benchmark Gross (${compareYear})`} stroke="#94a3b8" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                      <Area type="monotone" dataKey="outflowsNegative" name={`Outflows (${primaryYear})`} stroke="#f43f5e" fillOpacity={1} fill="url(#outflowsGrad)" strokeWidth={2} />
                    </AreaChart>
                  ) : overviewChartType === "line" ? (
                    <LineChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ReferenceLine y={0} stroke="#94a3b8" />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Line type="monotone" dataKey="gross" name={`Gross Revenue (${primaryYear})`} stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="net" name={`Net Revenue (${primaryYear})`} stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="compareGross" name={`Benchmark Gross (${compareYear})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="outflowsNegative" name={`Outflows (${primaryYear})`} stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  ) : overviewChartType === "bar" ? (
                    <BarChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ReferenceLine y={0} stroke="#94a3b8" />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Bar dataKey="gross" name={`Gross Revenue (${primaryYear})`} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="net" name={`Net Revenue (${primaryYear})`} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="compareGross" name={`Benchmark Gross (${compareYear})`} fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.6} />
                      <Bar dataKey="outflowsNegative" name={`Outflows (${primaryYear})`} fill="#f43f5e" radius={[0, 0, 4, 4]} />
                    </BarChart>
                  ) : (
                    <ComposedChart data={revenueSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ReferenceLine y={0} stroke="#94a3b8" />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Bar dataKey="gross" name={`Gross Revenue (${primaryYear})`} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outflowsNegative" name={`Outflows (${primaryYear})`} fill="#f43f5e" radius={[0, 0, 4, 4]} />
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
              Full Revenue Stream Breakdown
            </button>

            <button
              onClick={() => setCategorySubTab("outflows")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categorySubTab === "outflows"
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              Operational Outflows by Vendor
            </button>

            <button
              onClick={() => setCategorySubTab("activation")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categorySubTab === "activation"
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              Account Creation vs. Activation
            </button>
          </div>

          {/* Revenue Category Trend — same toolbar sophistication as Overview
              (date range, year-vs-year, period bucketing, chart type). The
              donut/pie/bar card below answers "what's the share right now";
              this answers "how has that composition moved over time," which
              a snapshot chart can't show regardless of which chart type you
              pick on it. */}
          {categorySubTab === "revenue" && (
            <Card id="category-revenue-trend-chart" className="w-full border shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Revenue Category Trend & YoY Comparison</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Platform Fee vs. Subscription composition tracked over time, benchmarked against a prior year.
                    </CardDescription>
                  </div>
                  <ExportMenu
                    data={categoryTrendSeries.map((b) => ({
                      Interval: b.label,
                      "Platform Fee (USD)": Math.round(b["Platform Fee"]),
                      "Subscription (USD)": Math.round(b.Subscription),
                      [`Benchmark Total ${categoryCompareYear} (USD)`]: b.compareTotal,
                    }))}
                    columns={[
                      { header: "Interval", accessor: "Interval" },
                      { header: "Platform Fee (USD)", accessor: "Platform Fee (USD)" },
                      { header: "Subscription (USD)", accessor: "Subscription (USD)" },
                      { header: `Benchmark Total ${categoryCompareYear} (USD)`, accessor: `Benchmark Total ${categoryCompareYear} (USD)` },
                    ]}
                    filename={`revenue-category-trend-${categoryPrimaryYear}-vs-${categoryCompareYear}`}
                    targetElementId="category-revenue-trend-chart"
                  />
                </div>

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
                        value={categoryPrimaryYear}
                        onChange={(e) => setCategoryPrimaryYear(Number(e.target.value))}
                        className="rounded bg-background border px-1.5 py-0.5 text-xs font-extrabold text-foreground focus:outline-none"
                      >
                        {YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <span className="text-[11px] text-muted-foreground font-bold">vs:</span>
                      <select
                        value={categoryCompareYear}
                        onChange={(e) => setCategoryCompareYear(Number(e.target.value))}
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
                        value={categoryTrendChartType}
                        onChange={(e) => setCategoryTrendChartType(e.target.value as "area" | "line" | "bar")}
                        className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                      >
                        <option value="area">Stacked Area</option>
                        <option value="line">Line Chart</option>
                        <option value="bar">Stacked Bar</option>
                      </select>
                    </div>

                    <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs font-bold">
                      {(["daily", "weekly", "monthly", "quarterly", "yearly"] as Timeframe[]).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setCategoryTimeframe(tf)}
                          className={`rounded-md px-2.5 py-1 text-xs capitalize transition-all ${
                            categoryTimeframe === tf ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {categoryTrendChartType === "area" ? (
                      <AreaChart data={categoryTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Area type="monotone" dataKey="Platform Fee" stackId="rev" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                        <Area type="monotone" dataKey="Subscription" stackId="rev" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
                        <Line type="monotone" dataKey="compareTotal" name={`Benchmark Total (${categoryCompareYear})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </AreaChart>
                    ) : categoryTrendChartType === "line" ? (
                      <LineChart data={categoryTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Line type="monotone" dataKey="Platform Fee" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="Subscription" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="compareTotal" name={`Benchmark Total (${categoryCompareYear})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    ) : (
                      <BarChart data={categoryTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Amount"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Bar dataKey="Platform Fee" stackId="rev" fill="#10b981" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Subscription" stackId="rev" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sub-Sub View 1: Revenue Stream Breakdown */}
          {categorySubTab === "revenue" && (
            <Card id="category-revenue-chart" className="w-full border shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <PieChartIcon className="h-4 w-4 text-primary" />
                      <span>Full Revenue Stream Breakdown</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Aggregated platform revenue share by fee category — only credit-side inflows (Platform Fee, Subscriptions) count as revenue here; Dispute Fee, Escrow Settlement, Operational Outflow, and Internal Transfer are outflow categories, tracked instead on the Operational Outflows tab and the dedicated Budget Performance page.
                    </CardDescription>
                  </div>
                  <ExportMenu
                    data={categoryData.map((c) => ({ Category: c.name, "Revenue USD": c.value }))}
                    columns={[{ header: "Category", accessor: "Category" }, { header: "Revenue USD", accessor: "Revenue USD" }]}
                    filename="revenue-category-breakdown"
                    targetElementId="category-revenue-chart"
                  />
                </div>

                <ChartFilterToolbar
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  right={
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
                  }
                />
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

          {/* Outflow Trend Over Time — the real trend the old chart-type
              selector ("Area Outflow," "Line Trend") implied but never
              actually plotted (time was never on its x-axis, vendor name
              was). This is the genuine time-series version. */}
          {categorySubTab === "outflows" && (
            <Card id="category-outflow-trend-chart" className="w-full border shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-rose-600" />
                      <span>Outflow Trend & YoY Comparison</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Total operational outflow tracked over time, benchmarked against a prior year.
                    </CardDescription>
                  </div>
                  <ExportMenu
                    data={outflowTrendSeries.map((b) => ({
                      Interval: b.label,
                      "Outflow (USD)": Math.round(b.outflowUSD),
                      [`Benchmark Outflow ${categoryCompareYear} (USD)`]: b.compareOutflowUSD,
                    }))}
                    columns={[
                      { header: "Interval", accessor: "Interval" },
                      { header: "Outflow (USD)", accessor: "Outflow (USD)" },
                      { header: `Benchmark Outflow ${categoryCompareYear} (USD)`, accessor: `Benchmark Outflow ${categoryCompareYear} (USD)` },
                    ]}
                    filename={`outflow-trend-${categoryPrimaryYear}-vs-${categoryCompareYear}`}
                    targetElementId="category-outflow-trend-chart"
                  />
                </div>

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
                        value={categoryPrimaryYear}
                        onChange={(e) => setCategoryPrimaryYear(Number(e.target.value))}
                        className="rounded bg-background border px-1.5 py-0.5 text-xs font-extrabold text-foreground focus:outline-none"
                      >
                        {YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <span className="text-[11px] text-muted-foreground font-bold">vs:</span>
                      <select
                        value={categoryCompareYear}
                        onChange={(e) => setCategoryCompareYear(Number(e.target.value))}
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
                        value={outflowTrendChartType}
                        onChange={(e) => setOutflowTrendChartType(e.target.value as "area" | "line" | "bar")}
                        className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                      >
                        <option value="area">Area Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                      </select>
                    </div>

                    <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs font-bold">
                      {(["daily", "weekly", "monthly", "quarterly", "yearly"] as Timeframe[]).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setCategoryTimeframe(tf)}
                          className={`rounded-md px-2.5 py-1 text-xs capitalize transition-all ${
                            categoryTimeframe === tf ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {outflowTrendChartType === "area" ? (
                      <AreaChart data={outflowTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="outflowTrendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Outflow"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Area type="monotone" dataKey="outflowUSD" name={`Outflow (${categoryPrimaryYear})`} stroke="#f43f5e" fillOpacity={1} fill="url(#outflowTrendGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="compareOutflowUSD" name={`Benchmark Outflow (${categoryCompareYear})`} stroke="#94a3b8" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                      </AreaChart>
                    ) : outflowTrendChartType === "line" ? (
                      <LineChart data={outflowTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Outflow"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Line type="monotone" dataKey="outflowUSD" name={`Outflow (${categoryPrimaryYear})`} stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="compareOutflowUSD" name={`Benchmark Outflow (${categoryCompareYear})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    ) : (
                      <BarChart data={outflowTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Outflow"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Bar dataKey="outflowUSD" name={`Outflow (${categoryPrimaryYear})`} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="compareOutflowUSD" name={`Benchmark Outflow (${categoryCompareYear})`} fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.6} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sub-Sub View 2: Operational Outflows by Vendor */}
          {categorySubTab === "outflows" && (
            <Card id="category-outflow-chart" className="w-full border shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-rose-600" />
                      <span>Operational Outflows by Vendor & Vendor Category</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Every debit-side outflow grouped by recipient — vendor payments, cooperative/buyer escrow settlements, and internal treasury sweeps alike.
                    </CardDescription>
                  </div>
                  <ExportMenu
                    data={vendorOutflowData.map((v) => ({ Vendor: v.name, "Outflow USD": v.value }))}
                    columns={[{ header: "Vendor", accessor: "Vendor" }, { header: "Outflow USD", accessor: "Outflow USD" }]}
                    filename="operational-vendor-outflows"
                    targetElementId="category-outflow-chart"
                  />
                </div>

                <ChartFilterToolbar
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-[340px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vendorOutflowData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={140} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Outflow"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Bar dataKey="value" name="Vendor Outflow USD" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sub-Sub View 3: Account Creation vs Financial Activation */}
          {categorySubTab === "activation" && (
            <Card id="category-activation-chart" className="w-full border shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Users className="h-4 w-4 text-sky-600" />
                      <span>Account Creation vs. Financial Activation Benchmark</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Entity registration volume compared against financially active transacting entities across platform roles. No date-range filter here — activation has its own recency window, set via Configure Active Criteria below.
                    </CardDescription>
                  </div>
                  <ExportMenu
                    data={activationBenchmarkData}
                    columns={[
                      { header: "Type", accessor: "type" },
                      { header: "Total", accessor: "total" },
                      { header: "Active", accessor: "active" },
                      { header: "Inactive", accessor: "inactive" },
                      { header: "Activation Rate %", accessor: (r: any) => r.activationRate.toFixed(1) },
                    ]}
                    filename="account-activation-benchmark"
                    targetElementId="category-activation-chart"
                  />
                </div>

                <div className="pt-3 border-t flex flex-wrap items-center gap-2 text-xs font-semibold">
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

      {/* TAB 3: Liquidity Forecast */}
      {activeTab === "liquidity" && (
        <div className="space-y-6">
          <Card id="liquidity-forecast-chart" className="w-full border shadow-2xs">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span>{liquidityHorizonWeeks}-Week Rolling Liquidity Runway & Cash Flow Model</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Projects cash inflows and outflows over a rolling horizon against foreign exchange settlement rates. No historical date-range filter here by design — this is a forward-looking projection, not a lookback.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-md border whitespace-nowrap ${
                      liquidityForecast.runwayMonths >= 0
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }`}
                  >
                    {liquidityForecast.runwayMonths.toFixed(1)} Months Cash Runway Cushion
                  </span>
                  <ExportMenu
                    data={liquidityForecast.weeks.map((w) => ({ Week: w.week, "Inflow USD": w.Inflow, "Outflow USD": w.Outflow, "Net Liquidity USD": w.NetLiquidity }))}
                    columns={[
                      { header: "Week", accessor: "Week" },
                      { header: "Inflow USD", accessor: "Inflow USD" },
                      { header: "Outflow USD", accessor: "Outflow USD" },
                      { header: "Net Liquidity USD", accessor: "Net Liquidity USD" },
                    ]}
                    filename={`liquidity-forecast-${liquidityHorizonWeeks}wk`}
                    targetElementId="liquidity-forecast-chart"
                  />
                </div>
              </div>

              {/* Scenario controls — the two things the finance team can
                  actually play with, in place of a date-range filter that
                  wouldn't make sense on a forward-looking projection. */}
              <div className="pt-3 border-t grid gap-3 sm:grid-cols-3 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Horizon</label>
                  <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
                    {[8, 13, 26].map((wk) => (
                      <button
                        key={wk}
                        onClick={() => setLiquidityHorizonWeeks(wk)}
                        className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
                          liquidityHorizonWeeks === wk ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {wk} Wks
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                    <span>Outflow Stress</span>
                    <span className="font-mono text-foreground">{liquidityOutflowStress > 0 ? "+" : ""}{liquidityOutflowStress}%</span>
                  </label>
                  <input
                    type="range"
                    min={-50}
                    max={150}
                    step={5}
                    value={liquidityOutflowStress}
                    onChange={(e) => setLiquidityOutflowStress(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                    <span>Renewal Confidence</span>
                    <span className="font-mono text-foreground">{liquidityRenewalConfidence}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={liquidityRenewalConfidence}
                    onChange={(e) => setLiquidityRenewalConfidence(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] text-muted-foreground">
                Direct-method projection: inflows from actual scheduled subscription renewals plus the real Platform Fee run-rate; outflows from the real recent weekly debit run-rate (both scaled by the scenario controls above). Recomputes from today forward — not a fixed snapshot.
              </p>
              <div className="h-[340px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={liquidityForecast.weeks}
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
                    <span>Statutory WHT Filing — FIRS TaxPro Max</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    WHT credit calculations follow the 2026 rule: credits can offset any tax liability (CIT, PIT, CGT) within 24 months. There is no public FIRS API to integrate with yet — filing routes through TaxPro Max manually.
                  </CardDescription>
                </div>

                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 font-extrabold px-3 py-1 rounded-md border border-amber-500/20 text-xs">
                  <ShieldCheck className="h-4 w-4" /> Not Yet Integrated — File via TaxPro Max
                </span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3 text-xs font-semibold">
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Filing Method</span>
                <p className="font-bold text-foreground">Manual — TaxPro Max Portal</p>
              </div>
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">API Integration Status</span>
                <p className="font-bold text-amber-600">No public API confirmed as of this build</p>
              </div>
              <div className="p-3 border rounded-xl space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Tax Authority Compliance</span>
                <p className="font-bold text-emerald-600">Nigeria (FIRS/LRS) • Kenya (KRA) • Tanzania (TRA)</p>
              </div>
            </CardContent>
          </Card>

          {/* WHT Vendor Table */}
          <Card id="wht-vendor-table" className="w-full border shadow-2xs">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    <span>Statutory Withholding Tax (WHT) Remittance Schedule</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    WHT deductions on operational vendor payouts, supporting 1-click tax credit note issuance and export for FIRS TaxPro Max import.
                  </CardDescription>
                </div>
                <ExportMenu
                  data={whtSummaryData.map((w) => ({
                    "Vendor Name": w.vendorName,
                    Jurisdiction: w.countryName,
                    "Gross Outflow USD": w.grossUSD,
                    "WHT Rate %": `${(w.whtRate * 100).toFixed(0)}%`,
                    "WHT Liability USD": w.whtLiabilityUSD,
                    Status: "Credit Note Eligible",
                  }))}
                  columns={[
                    { header: "Vendor Name", accessor: "Vendor Name" },
                    { header: "Jurisdiction", accessor: "Jurisdiction" },
                    { header: "Gross Outflow USD", accessor: "Gross Outflow USD" },
                    { header: "WHT Rate %", accessor: "WHT Rate %" },
                    { header: "WHT Liability USD", accessor: "WHT Liability USD" },
                    { header: "Status", accessor: "Status" },
                  ]}
                  filename="firs-taxpromax-wht-schedule"
                  targetElementId="wht-vendor-table"
                />
              </div>

              {/* This range genuinely filters the table below (it narrows
                  `completed`, which whtSummaryData derives from) — it lives
                  here, next to the table it actually affects, instead of
                  floating above the whole tab. */}
              <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 border bg-muted/30 px-2.5 py-1 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Range:</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setWhtPage(1); }}
                      className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
                    />
                    <span className="text-muted-foreground">&ndash;</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setWhtPage(1); }}
                      className="bg-transparent border-0 text-xs font-bold font-mono focus:outline-none"
                    />
                  </div>

                  <span className="text-[11px] text-muted-foreground font-bold">Jurisdiction:</span>
                  <select
                    value={whtCountryFilter}
                    onChange={(e) => { setWhtCountryFilter(e.target.value); setWhtPage(1); }}
                    className="rounded-lg border bg-background px-3 py-1 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="All">All Jurisdictions</option>
                    <option value="NG">Nigeria (FIRS / LRS)</option>
                    <option value="KE">Kenya (KRA iTax)</option>
                    <option value="TZ">Tanzania (TRA)</option>
                  </select>
                </div>
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
                    {(() => {
                      const totalPages = Math.max(1, Math.ceil(whtSummaryData.length / whtPageSize));
                      const currentPage = Math.min(whtPage, totalPages);
                      const pageItems = whtSummaryData.slice((currentPage - 1) * whtPageSize, currentPage * whtPageSize);
                      return pageItems.map((item) => (
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
                      ));
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Rows per page:</span>
                  {[5, 10, 15, 20].map((size) => (
                    <button
                      key={size}
                      onClick={() => { setWhtPageSize(size); setWhtPage(1); }}
                      className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                        whtPageSize === size
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {(() => {
                  const totalPages = Math.max(1, Math.ceil(whtSummaryData.length / whtPageSize));
                  const currentPage = Math.min(whtPage, totalPages);
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Page {currentPage} of {totalPages} &bull; {whtSummaryData.length} vendor{whtSummaryData.length === 1 ? "" : "s"}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage <= 1}
                        onClick={() => setWhtPage((p) => Math.max(1, p - 1))}
                        className="h-7 px-2.5 text-xs font-bold"
                      >
                        Prev
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage >= totalPages}
                        onClick={() => setWhtPage((p) => Math.min(totalPages, p + 1))}
                        className="h-7 px-2.5 text-xs font-bold"
                      >
                        Next
                      </Button>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
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
                <p className="mt-2 text-3xl font-black text-foreground">₦{(gmvTotalNative / 1_000_000_000).toFixed(2)}B</p>
                <p className="mt-1 text-xs text-emerald-600 font-bold">{formatUSD(gmvTotalUSD)} USD Gross Matched Trade Volume</p>
              </CardContent>
            </Card>

            <Card className="border bg-sky-500/5 border-sky-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Net Merchandise Value (NMV)</p>
                  <DollarSign className="h-4 w-4 text-sky-600" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">₦{(nmvTotalNative / 1_000_000).toFixed(1)}M</p>
                <p className="mt-1 text-xs text-sky-600 font-bold">{formatUSD(nmvTotalUSD)} USD Retained Platform Revenue</p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NMV Retention Margin %</p>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-3xl font-black text-primary">{(nmvRetentionMargin * 100).toFixed(2)}%</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Net platform take rate of GMV</p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Leading Commodity</p>
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">{leadingCrop ? leadingCrop.crop.split(" ")[0] : "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">{leadingCrop ? `${leadingCrop.percentage}% share of matched GMV` : "No trades in this range"}</p>
              </CardContent>
            </Card>
          </div>

          {/* GMV Trend Over Time — same toolbar sophistication as Overview:
              date range, year-vs-year, period bucketing, and a chart-type
              picker, all driven by a real 18-month series instead of the
              single-snapshot 5-row dataset this used to be. */}
          <Card id="gmv-trend-chart" className="w-full border shadow-2xs">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <span>GMV Trend & Multi-Year YoY Comparison</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Gross merchandise value tracked across daily, weekly, monthly, quarterly, and yearly intervals, benchmarked against a prior year.
                  </CardDescription>
                </div>
                <ExportMenu
                  data={gmvTrendSeries.map((b) => ({
                    Interval: b.label,
                    [`GMV ${gmvPrimaryYear} (USD)`]: b.gmvUSD,
                    [`Benchmark GMV ${gmvCompareYear} (USD)`]: b.compareGmvUSD,
                  }))}
                  columns={[
                    { header: "Interval", accessor: "Interval" },
                    { header: `GMV ${gmvPrimaryYear} (USD)`, accessor: `GMV ${gmvPrimaryYear} (USD)` },
                    { header: `Benchmark GMV ${gmvCompareYear} (USD)`, accessor: `Benchmark GMV ${gmvCompareYear} (USD)` },
                  ]}
                  filename={`gmv-trend-${gmvPrimaryYear}-vs-${gmvCompareYear}`}
                  targetElementId="gmv-trend-chart"
                />
              </div>

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
                      value={gmvPrimaryYear}
                      onChange={(e) => setGmvPrimaryYear(Number(e.target.value))}
                      className="rounded bg-background border px-1.5 py-0.5 text-xs font-extrabold text-foreground focus:outline-none"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="text-[11px] text-muted-foreground font-bold">vs:</span>
                    <select
                      value={gmvCompareYear}
                      onChange={(e) => setGmvCompareYear(Number(e.target.value))}
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
                      value={gmvChartType}
                      onChange={(e) => setGmvChartType(e.target.value as "area" | "line" | "bar")}
                      className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                    >
                      <option value="area">Area Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="bar">Grouped Bar</option>
                    </select>
                  </div>

                  <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs font-bold">
                    {(["daily", "weekly", "monthly", "quarterly", "yearly"] as Timeframe[]).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setGmvTimeframe(tf)}
                        className={`rounded-md px-2.5 py-1 text-xs capitalize transition-all ${
                          gmvTimeframe === tf ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[340px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {gmvChartType === "area" ? (
                    <AreaChart data={gmvTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "GMV"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Area type="monotone" dataKey="gmvUSD" name={`GMV (${gmvPrimaryYear})`} stroke="#10b981" fillOpacity={1} fill="url(#gmvGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="compareGmvUSD" name={`Benchmark GMV (${gmvCompareYear})`} stroke="#94a3b8" strokeDasharray="4 4" fill="none" strokeWidth={2} />
                    </AreaChart>
                  ) : gmvChartType === "line" ? (
                    <LineChart data={gmvTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "GMV"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Line type="monotone" dataKey="gmvUSD" name={`GMV (${gmvPrimaryYear})`} stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="compareGmvUSD" name={`Benchmark GMV (${gmvCompareYear})`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  ) : (
                    <BarChart data={gmvTrendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "GMV"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Bar dataKey="gmvUSD" name={`GMV (${gmvPrimaryYear})`} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="compareGmvUSD" name={`Benchmark GMV (${gmvCompareYear})`} fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.6} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* GMV Crop Commodity Breakdown */}
          <Card id="gmv-crop-chart" className="w-full border shadow-2xs">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Coins className="h-5 w-5 text-emerald-600" />
                    <span>GMV Trade Volume by Crop Commodity</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Gross merchandise value share across major agricultural trade commodities (Maize, Rice, Soybean, Wheat, Cocoa) within the selected date range.
                  </CardDescription>
                </div>
                <ExportMenu
                  data={cropShareData.map((c) => ({
                    Crop: c.crop,
                    "GMV Native ₦": c.gmvNative,
                    "GMV USD": c.gmvUSD,
                    "Percentage Share": `${c.percentage}%`,
                  }))}
                  columns={[
                    { header: "Crop", accessor: "Crop" },
                    { header: "GMV Native ₦", accessor: "GMV Native ₦" },
                    { header: "GMV USD", accessor: "GMV USD" },
                    { header: "Percentage Share", accessor: "Percentage Share" },
                  ]}
                  filename="gmv-crop-commodity-breakdown"
                  targetElementId="gmv-crop-chart"
                />
              </div>

              <ChartFilterToolbar
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[340px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="gmvUSD"
                      label={(entry: any) => `${entry.crop || entry.name}: ${formatUSD(entry.gmvUSD || entry.value)}`}
                    >
                      {cropShareData.map((entry, index) => (
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
                <p className="mt-2 text-3xl font-black text-foreground">{formatUSD(creditTotalDisbursedUSD)}</p>
                <p className="mt-1 text-xs text-indigo-600 font-bold">Active Credit Extended, {filteredCreditObligors.length} Obligors</p>
              </CardContent>
            </Card>

            <Card className="border bg-emerald-500/5 border-emerald-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">NPL Non-Performing Ratio</p>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <p className={`mt-2 text-3xl font-black ${creditNplRatio < 3 ? "text-emerald-600" : "text-rose-600"}`}>{creditNplRatio.toFixed(2)}%</p>
                <p className={`mt-1 text-xs font-bold ${creditNplRatio < 3 ? "text-emerald-600" : "text-rose-600"}`}>
                  {creditNplRatio < 3 ? "Healthy Asset Quality" : "Above"} (&lt;3.0% Target)
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loan Loss Coverage Ratio</p>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">{creditCoverageRatio.toFixed(1)}%</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Disbursement-weighted collateral coverage</p>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Credit Obligors</p>
                  <Building2 className="h-4 w-4 text-foreground" />
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">{filteredCreditObligors.length} Entities</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">{creditProcessorCount} Processors • {creditCooperativeCount} Cooperatives</p>
              </CardContent>
            </Card>
          </div>

          {/* Per-obligor detail (name, rating, collateral %, NPL flag) lives
              on Accounts Monitoring's Off-Taker Credit & Collateral tab —
              this used to duplicate that exact table. This tab now shows
              the two things Monitoring's snapshot table structurally can't:
              real growth over time and a risk-weighted distribution. */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card id="credit-growth-chart" className="border shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span>Cumulative Disbursement Growth</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Running total of the credit book, in the real order facilities were disbursed.
                    </CardDescription>
                  </div>
                  <ExportMenu
                    data={creditGrowthSeries.map((p) => ({ Obligor: p.obligor, Date: p.label, "Cumulative USD": p.cumulativeUSD }))}
                    columns={[
                      { header: "Obligor", accessor: "Obligor" },
                      { header: "Date", accessor: "Date" },
                      { header: "Cumulative USD", accessor: "Cumulative USD" },
                    ]}
                    filename="credit-cumulative-disbursement"
                    targetElementId="credit-growth-chart"
                  />
                </div>
                <ChartFilterToolbar
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={creditGrowthSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="creditGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Cumulative Disbursed"]}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.obligor ?? ""}
                        contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                      />
                      <Area type="monotone" dataKey="cumulativeUSD" name="Cumulative Disbursed" stroke="#6366f1" fillOpacity={1} fill="url(#creditGrowthGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-2xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Portfolio Risk Distribution</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Disbursed exposure grouped by performing vs. watchlist status, within the selected range.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={creditRiskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="disbursedUSD"
                        label={(entry: any) => `${entry.status}: ${entry.count}`}
                      >
                        {creditRiskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: TooltipValueType | undefined) => [formatUSD(Number(val)), "Disbursed USD"]} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between gap-3 p-4 border rounded-xl bg-muted/20 text-xs font-semibold">
            <span className="text-muted-foreground">
              Looking for a specific obligor — rating, collateral %, exact NPL status? That per-account detail lives on Accounts Monitoring.
            </span>
            <Link
              href="/admin/finance-hub/accounts-monitor"
              className="inline-flex items-center gap-1 text-primary font-bold hover:underline shrink-0"
            >
              Off-Taker Credit & Collateral <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* --- MODAL: CFO Configure Active Activation Criteria --- */}
      {showActivationCriteriaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-md w-full min-w-[50vw] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> Configure Activation Criteria
              </h3>
              <button onClick={() => setShowActivationCriteriaModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground -mt-2">
              An entity counts as financially active if it meets <b>both</b> thresholds below within the recency window — the Activation Benchmark chart recomputes live from the real ledger feed as soon as you save.
            </p>

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
