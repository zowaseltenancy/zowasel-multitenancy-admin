"use client";

import { useState } from "react";
import {
  Building2,
  Globe2,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Search,
  ExternalLink,
  Download,
  Filter,
  Plus,
  Key,
  Code2,
  Layers,
  TrendingUp,
  FileText,
  Copy,
  Lock,
  ArrowRightLeft,
  X,
  Check,
  Activity,
  Sliders,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import { toast } from "sonner";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { formatNative, formatUSD } from "@/features/finance-hub/utils/currency";

// --- Types ---
interface ConnectedBankProvider {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  balanceNative: number;
  fxRateToUSD: number;
  apiStatus: "connected" | "syncing" | "error" | "auth_required";
  lastSynced: string;
  channelType: "Naira Commercial" | "USD Corporate" | "Multi-FX Engine";
  swiftBic?: string;
}

interface VirtualAccount {
  id: string;
  virtualNuban: string;
  bankName: string;
  assignedTo: string;
  assignedRole: string;
  currency: string;
  balanceNative: number;
  status: "Active" | "Frozen" | "Closed";
  collectionTag: string;
  createdAt: string;
}

interface FxRateLock {
  id: string;
  pair: string;
  rate: number;
  amountUSD: number;
  expiryDate: string;
  status: "Active Lock" | "Settled" | "Expired";
  purpose: string;
}

interface WebhookLog {
  id: string;
  event: string;
  endpoint: string;
  status: 200 | 400 | 500;
  timestamp: string;
  payloadSnippet: string;
}

// --- Initial Mock Data ---
const initialBankConnections: ConnectedBankProvider[] = [
  {
    id: "bank_gtb_01",
    bankName: "GTBank Commercial",
    accountName: "Zowasel Operations Nigeria Ltd",
    accountNumber: "012399****81",
    countryCode: "NG",
    countryName: "Nigeria",
    currencyCode: "NGN",
    currencySymbol: "₦",
    balanceNative: 185400000,
    fxRateToUSD: 1550,
    apiStatus: "connected",
    lastSynced: "Just now",
    channelType: "Naira Commercial",
    swiftBic: "GTBIGLBA",
  },
  {
    id: "bank_zenith_02",
    bankName: "Zenith Bank Treasury",
    accountName: "Zowasel Escrow Reserve Account",
    accountNumber: "101492****04",
    countryCode: "NG",
    countryName: "Nigeria",
    currencyCode: "NGN",
    currencySymbol: "₦",
    balanceNative: 420000000,
    fxRateToUSD: 1550,
    apiStatus: "connected",
    lastSynced: "2 mins ago",
    channelType: "Naira Commercial",
    swiftBic: "ZEIBNGLA",
  },
  {
    id: "bank_ceviant_us_03",
    bankName: "Ceviant Multi-Currency Gateway",
    accountName: "Zowasel Continental Clearing Escrow",
    accountNumber: "CV-US-990142",
    countryCode: "US",
    countryName: "United States (Global)",
    currencyCode: "USD",
    currencySymbol: "$",
    balanceNative: 840000,
    fxRateToUSD: 1.0,
    apiStatus: "connected",
    lastSynced: "5 mins ago",
    channelType: "USD Corporate",
    swiftBic: "CEVUS33X",
  },
  {
    id: "bank_equity_ke_04",
    bankName: "Equity Bank Kenya",
    accountName: "Zowasel Agribusiness Kenya Ltd",
    accountNumber: "440217****99",
    countryCode: "KE",
    countryName: "Kenya",
    currencyCode: "KES",
    currencySymbol: "KSh",
    balanceNative: 28500000,
    fxRateToUSD: 130,
    apiStatus: "connected",
    lastSynced: "12 mins ago",
    channelType: "Multi-FX Engine",
    swiftBic: "EQBLKENA",
  },
  {
    id: "bank_stanchart_tz_05",
    bankName: "Standard Chartered Tanzania",
    accountName: "Zowasel Commodity Sourcing TZ",
    accountNumber: "902811****33",
    countryCode: "TZ",
    countryName: "Tanzania",
    currencyCode: "TZS",
    currencySymbol: "TSh",
    balanceNative: 480000000,
    fxRateToUSD: 2700,
    apiStatus: "connected",
    lastSynced: "18 mins ago",
    channelType: "Multi-FX Engine",
    swiftBic: "SCBLTZTZ",
  },
];

const initialVirtualAccounts: VirtualAccount[] = [
  {
    id: "va_01",
    virtualNuban: "9920148810",
    bankName: "GTBank (via Ceviant)",
    assignedTo: "Olam Grains West Africa",
    assignedRole: "Grain Processor / Off-Taker",
    currency: "NGN",
    balanceNative: 45000000,
    status: "Active",
    collectionTag: "Escrow Settlement",
    createdAt: "2026-08-01",
  },
  {
    id: "va_02",
    virtualNuban: "9920148811",
    bankName: "Zenith Bank (via Ceviant)",
    assignedTo: "Flour Mills of Nigeria Plc",
    assignedRole: "Corporate Processor",
    currency: "NGN",
    balanceNative: 120000000,
    status: "Active",
    collectionTag: "Wheat Sourcing Escrow",
    createdAt: "2026-08-03",
  },
  {
    id: "va_03",
    virtualNuban: "CV-VA-88401",
    bankName: "Ceviant USD Gateway",
    assignedTo: "Cargill International Trading",
    assignedRole: "Global Buyer",
    currency: "USD",
    balanceNative: 320000,
    status: "Active",
    collectionTag: "Cross-Border Trade",
    createdAt: "2026-08-05",
  },
  {
    id: "va_04",
    virtualNuban: "9920148814",
    bankName: "Equity Bank (via Ceviant)",
    assignedTo: "East Africa Grain Council",
    assignedRole: "Regional Aggregator",
    currency: "KES",
    balanceNative: 8400000,
    status: "Active",
    collectionTag: "Maize Clearing",
    createdAt: "2026-08-08",
  },
];

const initialFxLocks: FxRateLock[] = [
  {
    id: "fx_01",
    pair: "USD/NGN",
    rate: 1545.0,
    amountUSD: 250000,
    expiryDate: "2026-08-28",
    status: "Active Lock",
    purpose: "Q3 Fertilizer Import Clearing",
  },
  {
    id: "fx_02",
    pair: "USD/KES",
    rate: 129.5,
    amountUSD: 100000,
    expiryDate: "2026-08-20",
    status: "Active Lock",
    purpose: "East Africa Commodity Sourcing",
  },
];

const initialWebhookLogs: WebhookLog[] = [
  {
    id: "wh_101",
    event: "virtual_account.credited",
    endpoint: "https://admin.zowasel.com/api/v1/ceviant/webhooks",
    status: 200,
    timestamp: "Just now",
    payloadSnippet: '{"va": "9920148810", "amount": 15000000, "currency": "NGN", "payer": "Olam Grains"}',
  },
  {
    id: "wh_102",
    event: "bank_balance.synced",
    endpoint: "https://admin.zowasel.com/api/v1/ceviant/webhooks",
    status: 200,
    timestamp: "3 mins ago",
    payloadSnippet: '{"bank": "GTBank", "balance_ngn": 185400000, "status": "synced"}',
  },
  {
    id: "wh_103",
    event: "fx_lock.executed",
    endpoint: "https://admin.zowasel.com/api/v1/ceviant/webhooks",
    status: 200,
    timestamp: "1 hour ago",
    payloadSnippet: '{"pair": "USD/NGN", "rate": 1545.00, "amount_usd": 250000}',
  },
];

export default function CeviantSubHubPage() {
  const { actingOfficer, isCountryInScope } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();

  const [activeSubTab, setActiveSubTab] = useState<string>("accounts");
  const [connections, setConnections] = useState<ConnectedBankProvider[]>(initialBankConnections);
  const [virtualAccounts, setVirtualAccounts] = useState<VirtualAccount[]>(initialVirtualAccounts);
  const [fxLocks, setFxLocks] = useState<FxRateLock[]>(initialFxLocks);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>(initialWebhookLogs);

  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");

  // Modals state
  const [showConnectBankModal, setShowConnectBankModal] = useState(false);
  const [showIssueVirtualModal, setShowIssueVirtualModal] = useState(false);
  const [showFxSwapModal, setShowFxSwapModal] = useState(false);
  const [statementBank, setStatementBank] = useState<ConnectedBankProvider | null>(null);

  // New Bank Form State
  const [newBankName, setNewBankName] = useState("");
  const [newAccName, setNewAccName] = useState("");
  const [newAccNum, setNewAccNum] = useState("");
  const [newCurrency, setNewCurrency] = useState("NGN");

  // New Virtual Account Form State
  const [vaAssignedTo, setVaAssignedTo] = useState("");
  const [vaRole, setVaRole] = useState("Corporate Processor");
  const [vaBankProvider, setVaBankProvider] = useState("GTBank (via Ceviant)");

  // FX Swap Form State
  const [fxPair, setFxPair] = useState("USD/NGN");
  const [fxAmountUSD, setFxAmountUSD] = useState("50000");

  const actorName = `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position || "Officer"})`;

  const ceviantPills = [
    { id: "accounts", label: "Multi-Bank Aggregator & Balances", icon: Building2 },
    { id: "virtual-accounts", label: "NUBAN Virtual Accounts Engine", icon: CreditCard, badge: `${virtualAccounts.length} Active` },
    { id: "fx-liquidity", label: "Ceviant X FX & Liquidity Sweeping", icon: Globe2, badge: "130+ Currencies" },
    { id: "developer-api", label: "APIs, Webhooks & Open Connectivity", icon: Zap, badge: "99.9% Uptime" },
  ];

  const scopedConnections = connections.filter((conn) => {
    if (conn.countryCode === "US") return true;
    return isCountryInScope(conn.countryCode);
  });

  const filteredConnections = scopedConnections.filter((conn) => {
    const matchesSearch =
      conn.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.accountNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === "All" || conn.channelType === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const totalUSDPos = scopedConnections.reduce((sum, c) => sum + c.balanceNative / c.fxRateToUSD, 0);

  // Handlers
  const handleSyncBank = (id: string, bankName: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, apiStatus: "syncing" } : c))
    );

    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                apiStatus: "connected",
                lastSynced: "Just now",
                balanceNative: c.balanceNative + Math.floor(Math.random() * 50000),
              }
            : c
        )
      );
      logAction(actorName, "Synced bank API balance via Ceviant Sub-Hub", bankName);
      toast.success(`Successfully pulled live balance & statement API feed from ${bankName}.`);
    }, 1200);
  };

  const handleRefreshAllAPIs = () => {
    setIsRefreshingAll(true);
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) => ({
          ...c,
          apiStatus: "connected",
          lastSynced: "Just now",
        }))
      );
      setIsRefreshingAll(false);
      logAction(actorName, "Triggered full Ceviant multi-bank API balance refresh", "All Banks");
      toast.success("All connected banking API channels successfully refreshed.");
    }, 1800);
  };

  const handleCreateBankConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName || !newAccName || !newAccNum) {
      toast.error("Please fill in all bank connection fields.");
      return;
    }
    const newConn: ConnectedBankProvider = {
      id: `bank_custom_${Date.now()}`,
      bankName: newBankName,
      accountName: newAccName,
      accountNumber: newAccNum,
      countryCode: newCurrency === "NGN" ? "NG" : newCurrency === "KES" ? "KE" : "US",
      countryName: newCurrency === "NGN" ? "Nigeria" : newCurrency === "KES" ? "Kenya" : "United States",
      currencyCode: newCurrency,
      currencySymbol: newCurrency === "NGN" ? "₦" : newCurrency === "KES" ? "KSh" : "$",
      balanceNative: 50000000,
      fxRateToUSD: newCurrency === "NGN" ? 1550 : newCurrency === "KES" ? 130 : 1.0,
      apiStatus: "connected",
      lastSynced: "Just now",
      channelType: newCurrency === "NGN" ? "Naira Commercial" : "USD Corporate",
      swiftBic: "CEVIMBXX",
    };
    setConnections([newConn, ...connections]);
    setShowConnectBankModal(false);
    setNewBankName("");
    setNewAccName("");
    setNewAccNum("");
    logAction(actorName, "Connected new bank API via Ceviant", newBankName);
    toast.success(`Successfully linked Open Banking API for ${newBankName}.`);
  };

  const handleIssueVirtualAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaAssignedTo) {
      toast.error("Please enter assigned organization name.");
      return;
    }
    const randomNuban = `992${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newVa: VirtualAccount = {
      id: `va_${Date.now()}`,
      virtualNuban: randomNuban,
      bankName: vaBankProvider,
      assignedTo: vaAssignedTo,
      assignedRole: vaRole,
      currency: "NGN",
      balanceNative: 0,
      status: "Active",
      collectionTag: "Automated Sub-Ledger Escrow",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setVirtualAccounts([newVa, ...virtualAccounts]);
    setShowIssueVirtualModal(false);
    setVaAssignedTo("");
    logAction(actorName, "Issued NUBAN Virtual Account via Ceviant", `${vaAssignedTo} (${randomNuban})`);
    toast.success(`NUBAN Virtual Account ${randomNuban} issued for ${vaAssignedTo}.`);
  };

  const handleExecuteFxSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const amountUSD = parseFloat(fxAmountUSD) || 10000;
    const newLock: FxRateLock = {
      id: `fx_${Date.now()}`,
      pair: fxPair,
      rate: fxPair === "USD/NGN" ? 1548.5 : 129.8,
      amountUSD,
      expiryDate: "2026-09-15",
      status: "Active Lock",
      purpose: "Treasury Liquidity Buffer Sweeping",
    };
    setFxLocks([newLock, ...fxLocks]);
    setShowFxSwapModal(false);
    logAction(actorName, "Executed FX Rate Lock via Ceviant X", `${fxPair} $${amountUSD}`);
    toast.success(`Successfully locked FX rate for ${fxPair} ($${amountUSD.toLocaleString()}).`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Ceviant Multi-Bank & Open-API Sub-Hub</h1>
            <PageHeaderInfo
              title="Ceviant Treasury Infrastructure Scope"
              description="Centralized corporate treasury engine providing multi-bank cash aggregation (GTBank, Zenith, StanChart), NUBAN Virtual Account sub-ledgers, Ceviant X FX liquidity sweeping, and Open Banking API webhooks."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowConnectBankModal(true)}
            variant="outline"
            className="h-9 text-xs font-bold gap-1.5 border-primary/30 text-primary"
          >
            <Plus className="h-4 w-4" /> Link Bank API
          </Button>

          <Button
            onClick={handleRefreshAllAPIs}
            disabled={isRefreshingAll}
            className="h-9 bg-primary hover:bg-primary/90 text-xs font-bold gap-2 shadow-2xs"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshingAll ? "animate-spin" : ""}`} />
            {isRefreshingAll ? "Pulling Bank APIs..." : "Refresh All Bank APIs"}
          </Button>
        </div>
      </div>

      {/* Pill Navigation Bar */}
      <SubSectionPillNav items={ceviantPills} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {/* TAB 1: Multi-Bank Aggregator & Cash Balances */}
      {activeSubTab === "accounts" && (
        <div className="space-y-6">
          {/* Compact Treasury Cash Summary Bar */}
          <Card className="border bg-card shadow-2xs">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                  <Globe2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Consolidated Multi-Bank Cash Position (USD Rollup)
                  </p>
                  <p className="text-2xl font-black text-foreground font-mono mt-0.5">{formatUSD(totalUSDPos)}</p>
                  <p className="text-xs text-emerald-600 font-bold">
                    Aggregated across {scopedConnections.length} open bank gateways &bull; Real-time Open Banking API feeds
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 text-xs font-semibold">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[11px] font-bold">Gateway Health:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5" /> 100% Operational
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[11px] font-bold">Operating Corridors:</span>
                  <span className="font-mono text-foreground font-bold bg-muted px-2.5 py-0.5 rounded text-[11px]">
                    NGN &bull; USD &bull; KES &bull; TZS
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search & Filter Controls */}
          <Card className="border shadow-2xs">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search bank name, account number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
                >
                  <option value="All">All Gateway Types</option>
                  <option value="Naira Commercial">Naira Commercial Banks</option>
                  <option value="USD Corporate">USD Corporate Platforms</option>
                  <option value="Multi-FX Engine">East Africa / Multi-FX Corridors</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Connected Bank Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredConnections.map((c) => {
              const usdVal = c.balanceNative / c.fxRateToUSD;
              return (
                <Card key={c.id} className="border shadow-2xs">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        {c.bankName}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> {c.apiStatus.toUpperCase()}
                      </span>
                    </div>
                    <CardDescription className="text-xs font-semibold">
                      {c.accountName} &bull; <span className="font-mono text-foreground">{c.accountNumber}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs font-semibold">
                    <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
                      <p className="text-[11px] text-muted-foreground font-bold uppercase">Real-Time Native Balance</p>
                      <p className="text-2xl font-black text-foreground font-mono">
                        {formatNative(c.balanceNative, c.currencySymbol)}
                      </p>
                      <p className="text-xs text-emerald-600 font-extrabold">{formatUSD(usdVal)} USD equivalent</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2 font-medium">
                      <span>Gateway: <strong className="text-foreground">{c.channelType}</strong></span>
                      <span>Last Sync: <strong className="text-foreground">{c.lastSynced}</strong></span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSyncBank(c.id, c.bankName)}
                        disabled={c.apiStatus === "syncing"}
                        className="text-xs font-bold gap-1 h-8"
                      >
                        <RefreshCw className={`h-3 w-3 ${c.apiStatus === "syncing" ? "animate-spin" : ""}`} />
                        Sync API
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatementBank(c)}
                        className="text-xs font-bold gap-1 h-8 text-primary border-primary/30"
                      >
                        <FileText className="h-3 w-3" /> E-Statement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: NUBAN Virtual Accounts & Sub-Ledger Engine */}
      {activeSubTab === "virtual-accounts" && (
        <div className="space-y-6">
          <Card className="border shadow-2xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <span>NUBAN Virtual Accounts & Sub-Ledgers</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Assigned virtual accounts providing instant payment identification, sub-ledger accounting, and automatic escrow collection tags via Ceviant API.
                </CardDescription>
              </div>

              <Button
                onClick={() => setShowIssueVirtualModal(true)}
                className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 shadow-2xs"
              >
                <Plus className="h-4 w-4" /> Issue Virtual NUBAN Account
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 font-bold border-b">
                    <tr>
                      <th className="p-3">Virtual NUBAN</th>
                      <th className="p-3">Issuing Provider</th>
                      <th className="p-3">Assigned Organization</th>
                      <th className="p-3">Role / Segment</th>
                      <th className="p-3">Collection Tag</th>
                      <th className="p-3 text-right">Sub-Ledger Balance</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold">
                    {virtualAccounts.map((va) => (
                      <tr key={va.id} className="hover:bg-muted/20">
                        <td className="p-3 font-mono font-extrabold text-foreground">{va.virtualNuban}</td>
                        <td className="p-3 text-muted-foreground">{va.bankName}</td>
                        <td className="p-3 font-bold text-foreground">{va.assignedTo}</td>
                        <td className="p-3 text-muted-foreground">{va.assignedRole}</td>
                        <td className="p-3">
                          <span className="bg-muted px-2 py-0.5 rounded text-[11px] font-mono font-bold text-foreground">
                            {va.collectionTag}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-emerald-600">
                          {formatNative(va.balanceNative, va.currency === "NGN" ? "₦" : va.currency === "KES" ? "KSh" : "$")}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                            <Check className="h-3 w-3" /> {va.status}
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

      {/* TAB 3: Ceviant X FX & Cross-Border Liquidity */}
      {activeSubTab === "fx-liquidity" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border shadow-2xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-sky-600" />
                    <span>Ceviant X FX Rate Locks & Forward Contracts</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Lock in real-time FX rates across 130+ currencies to hedge commodity sourcing exposure and stabilize treasury operations.
                  </CardDescription>
                </div>

                <Button
                  onClick={() => setShowFxSwapModal(true)}
                  className="h-9 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold gap-1.5 shadow-2xs"
                >
                  <ArrowRightLeft className="h-4 w-4" /> Lock FX Rate
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {fxLocks.map((lock) => (
                    <div key={lock.id} className="p-4 border rounded-xl bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-foreground font-mono">{lock.pair}</span>
                          <span className="bg-sky-500/10 text-sky-600 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-500/20">
                            {lock.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{lock.purpose}</p>
                      </div>

                      <div className="flex items-center gap-6 text-right font-mono">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Locked Rate</p>
                          <p className="text-base font-extrabold text-foreground">{lock.rate.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Hedged Volume</p>
                          <p className="text-base font-extrabold text-emerald-600">{formatUSD(lock.amountUSD)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-2xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span>Real-Time FX Board</span>
                </CardTitle>
                <CardDescription className="text-xs">Live market feeds via Ceviant X</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs font-semibold">
                {[
                  { pair: "USD / NGN", rate: "1,548.50", change: "-0.4%" },
                  { pair: "USD / KES", rate: "129.80", change: "+0.1%" },
                  { pair: "USD / TZS", rate: "2,710.00", change: "0.0%" },
                  { pair: "EUR / USD", rate: "1.0920", change: "+0.2%" },
                  { pair: "GBP / USD", rate: "1.2840", change: "+0.3%" },
                ].map((item) => (
                  <div key={item.pair} className="p-2.5 border rounded-lg flex items-center justify-between bg-card font-mono">
                    <span className="font-bold text-foreground">{item.pair}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold">{item.rate}</span>
                      <span className={`text-[10px] ${item.change.startsWith("+") ? "text-emerald-600" : item.change.startsWith("-") ? "text-rose-600" : "text-muted-foreground"}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: Developer APIs, Webhooks & Open Connectivity */}
      {activeSubTab === "developer-api" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* API Credentials */}
            <Card className="border shadow-2xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Key className="h-5 w-5 text-amber-600" />
                  <span>Ceviant Open API Keys</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Production API credentials for syncing multi-bank balances and statement feeds directly to Zowasel Platform Admin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs font-semibold">
                <div className="p-3 border rounded-xl bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Production Secret Key</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="cv_live_sec_99401284819920418571"
                      readOnly
                      className="w-full rounded border bg-muted px-2.5 py-1 text-xs font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success("API Secret Key copied to clipboard.")}
                      className="h-7 text-xs font-bold gap-1"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                </div>

                <div className="p-3 border rounded-xl bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Webhook Endpoint URL</span>
                    <span className="text-[10px] bg-sky-500/10 text-sky-600 font-bold px-2 py-0.5 rounded">Listening</span>
                  </div>
                  <input
                    type="text"
                    value="https://admin.zowasel.com/api/v1/ceviant/webhooks"
                    readOnly
                    className="w-full rounded border bg-muted px-2.5 py-1 text-xs font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Webhook Delivery Telemetry */}
            <Card className="border shadow-2xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  <span>Real-Time Webhook Telemetry</span>
                </CardTitle>
                <CardDescription className="text-xs">Recent incoming event webhooks from connected banking gateways.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-xl bg-card space-y-1 text-xs font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-indigo-600 font-bold">{log.event}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-mono font-bold">
                        HTTP {log.status} OK
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground truncate">{log.payloadSnippet}</p>
                    <span className="text-[10px] text-muted-foreground block text-right font-medium">{log.timestamp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* --- MODAL 1: Connect New Bank API --- */}
      {showConnectBankModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Connect New Bank API
              </h3>
              <button onClick={() => setShowConnectBankModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBankConnection} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Bank Name / Provider</label>
                <input
                  type="text"
                  placeholder="e.g. Access Bank Corporate, FirstBank Nigeria"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zowasel Operations Reserve Account"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Account Number / IBAN</label>
                <input
                  type="text"
                  placeholder="e.g. 0019284711"
                  value={newAccNum}
                  onChange={(e) => setNewAccNum(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Operating Currency</label>
                <select
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="NGN">NGN - Nigerian Naira (₦)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="KES">KES - Kenyan Shilling (KSh)</option>
                  <option value="TZS">TZS - Tanzanian Shilling (TSh)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t">
                <Button type="button" variant="outline" onClick={() => setShowConnectBankModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold">
                  Connect Bank API
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Issue NUBAN Virtual Account --- */}
      {showIssueVirtualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" /> Issue NUBAN Virtual Account
              </h3>
              <button onClick={() => setShowIssueVirtualModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleIssueVirtualAccount} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Bank Gateway Provider</label>
                <select
                  value={vaBankProvider}
                  onChange={(e) => setVaBankProvider(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="GTBank (via Ceviant)">GTBank (via Ceviant)</option>
                  <option value="Zenith Bank (via Ceviant)">Zenith Bank (via Ceviant)</option>
                  <option value="Ceviant USD Gateway">Ceviant USD Gateway</option>
                  <option value="Equity Bank (via Ceviant)">Equity Bank (via Ceviant)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Assigned Organization / Entity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dangote Sugar Refinery Plc"
                  value={vaAssignedTo}
                  onChange={(e) => setVaAssignedTo(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Organization Segment / Role</label>
                <select
                  value={vaRole}
                  onChange={(e) => setVaRole(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="Corporate Processor">Corporate Processor / Off-Taker</option>
                  <option value="Grain Aggregator">Grain Aggregator</option>
                  <option value="Commercial Buyer">Commercial Buyer</option>
                  <option value="Inputs Supplier">Inputs Supplier</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t">
                <Button type="button" variant="outline" onClick={() => setShowIssueVirtualModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                  Generate NUBAN Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Execute FX Swap / Rate Lock --- */}
      {showFxSwapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-sky-600" /> Ceviant X FX Rate Lock
              </h3>
              <button onClick={() => setShowFxSwapModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteFxSwap} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Currency Pair</label>
                <select
                  value={fxPair}
                  onChange={(e) => setFxPair(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="USD/NGN">USD / NGN (Guaranteed Rate: 1,548.50)</option>
                  <option value="USD/KES">USD / KES (Guaranteed Rate: 129.80)</option>
                  <option value="USD/TZS">USD / TZS (Guaranteed Rate: 2,710.00)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Volume (USD Equivalent)</label>
                <input
                  type="number"
                  value={fxAmountUSD}
                  onChange={(e) => setFxAmountUSD(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 border rounded-xl bg-sky-500/5 border-sky-500/20 text-[11px] space-y-1">
                <p className="font-bold text-sky-600">Guaranteed Treasury Rate Lock</p>
                <p className="text-muted-foreground">Locks rate for 30 days via Ceviant X hedging engine.</p>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t">
                <Button type="button" variant="outline" onClick={() => setShowFxSwapModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
                  Execute Rate Lock
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: Preview Electronic Bank Statement --- */}
      {statementBank && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Electronic Bank Statement API Feed
                </h3>
                <p className="text-xs text-muted-foreground font-semibold">
                  {statementBank.bankName} &bull; {statementBank.accountNumber}
                </p>
              </div>
              <button onClick={() => setStatementBank(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="p-3 border rounded-xl bg-muted/20 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-muted-foreground font-bold uppercase block">Current Available Balance</span>
                  <span className="text-xl font-mono font-extrabold text-foreground">
                    {formatNative(statementBank.balanceNative, statementBank.currencySymbol)}
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded">API Live</span>
              </div>

              <div className="border rounded-xl p-3 space-y-2">
                <p className="font-bold text-foreground">Recent Electronic API Ingress Transactions</p>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="p-2 border rounded bg-card flex justify-between items-center">
                    <div>
                      <p className="font-bold text-foreground">CR - Cargill Commodity Clearing</p>
                      <p className="text-[10px] text-muted-foreground">Today 09:14 AM &bull; Ref: CV-992014</p>
                    </div>
                    <span className="text-emerald-600 font-bold">+₦15,000,000</span>
                  </div>
                  <div className="p-2 border rounded bg-card flex justify-between items-center">
                    <div>
                      <p className="font-bold text-foreground">DR - Termii SMS Gateway API</p>
                      <p className="text-[10px] text-muted-foreground">Yesterday 04:30 PM &bull; Ref: CV-881023</p>
                    </div>
                    <span className="text-rose-600 font-bold">-₦450,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex gap-2 justify-end border-t">
              <Button variant="outline" onClick={() => setStatementBank(null)} className="text-xs font-bold">
                Close
              </Button>
              <Button
                onClick={() => {
                  toast.success(`Exporting official PDF statement feed for ${statementBank.bankName}...`);
                  setStatementBank(null);
                }}
                className="bg-primary hover:bg-primary/90 text-white text-xs font-bold gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download E-Statement PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
