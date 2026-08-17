"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ShieldCheck,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Eye,
  Ban,
  Hourglass,
  BarChart3,
  Landmark,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusSegmentedBar from "@/components/shared/StatusSegmentedBar";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import ExportMenu from "@/components/shared/ExportMenu";
import { useMonitoredAccounts } from "@/features/finance-hub/hooks/useMonitoredAccounts";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { convertToUSD, formatUSD } from "@/features/finance-hub/utils/currency";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import {
  MONITORED_ACCOUNT_RISK_TONE,
  MONITORED_ACCOUNT_STATUS_TONE,
} from "@/constants/finance";
import { statusBadgeClass } from "@/lib/statusTone";
import { mockCreditObligors } from "@/features/finance-hub/data/mockCreditObligors";

const AGING_BUCKETS = [
  { key: "current", label: "Current (0-30d)", tone: "info" as const, max: 30 },
  { key: "b31_60", label: "31-60d", tone: "warning" as const, max: 60 },
  { key: "b61_90", label: "61-90d", tone: "warning" as const, max: 90 },
  { key: "b90plus", label: "90d+", tone: "danger" as const, max: Infinity },
];

export default function AccountsMonitorPage() {
  const { accounts, toggleStatus, formatRelativeTime } = useMonitoredAccounts();
  const { transactions } = useLedgerTransactions();
  const { actingOfficer, actingOfficerCapability } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();
  const [activeTab, setActiveTab] = useState<string>("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  // AP/AR aging — real pending/pending-approval ledger entries bucketed by
  // how long they've been outstanding, not just a balance-and-status view.
  const outstanding = transactions.filter((t) => t.status === "Pending" || t.status === "Pending Approval");
  const agingBuckets = AGING_BUCKETS.map((bucket, index) => {
    const minAge = index === 0 ? -Infinity : AGING_BUCKETS[index - 1].max;
    const items = outstanding.filter((t) => {
      const days = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
      return days > minAge && days <= bucket.max;
    });
    const totalUSD = items.reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);
    return { ...bucket, count: items.length, totalUSD, items };
  });

  // Off-Taker Credit & Collateral — same real obligor data Analytics' Credit
  // & Alternative Finance tab uses, not an independently hardcoded copy.
  const totalDrawnCreditUSD = mockCreditObligors.reduce((sum, o) => sum + o.disbursedUSD, 0);
  const collateralInventoryUSD = mockCreditObligors.reduce((sum, o) => sum + o.disbursedUSD * (o.collateralRatio / 100), 0);
  const collateralCoverageRatio = totalDrawnCreditUSD > 0 ? (collateralInventoryUSD / totalDrawnCreditUSD) * 100 : 0;

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || acc.status === statusFilter;
    const matchesType = typeFilter === "All" || acc.accountType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeCount = accounts.filter((a) => a.status === "Active").length;
  const highRiskCount = accounts.filter((a) => a.riskTier === "High Risk").length;
  const dormantCount = accounts.filter((a) => a.status === "Dormant").length;

  const handleToggleStatus = (accountId: string, accountName: string, nextStatus: string, countryCode?: string) => {
    // Suspending/activating a tenant account is at least as consequential as
    // a statement-line reconciliation or VAT attestation — same Approve-level
    // gate as those, not a routine click any acting officer can make.
    if (!actingOfficerCapability.canApprove) {
      toast.error(`${actingOfficer.firstName} ${actingOfficer.lastName} does not hold Approve authority and cannot change account status.`);
      return;
    }
    toggleStatus(accountId);
    logAction(
      actingOfficer ? `${actingOfficer.firstName} ${actingOfficer.lastName}` : "System",
      `${nextStatus === "Active" ? "Activated" : "Suspended"} account`,
      accountName,
      undefined,
      countryCode
    );
  };

  const monitorPills = [
    { id: "directory", label: "Monitored Directory", icon: Users, badge: accounts.length },
    { id: "aging", label: "AP/AR 30-60-90 Aging Waterfall", icon: Hourglass, badge: outstanding.length },
    { id: "offtaker_credit", label: "Off-Taker Credit & Collateral", icon: Landmark, badge: `${collateralCoverageRatio.toFixed(1)}%` },
    { id: "quarantine", label: "Risk & Dormancy Quarantine", icon: ShieldAlert, badge: highRiskCount + dormantCount },
  ];

  const exportColumns = [
    { header: "Account ID", accessor: "id" as const },
    { header: "Account Name", accessor: "accountName" as const },
    { header: "Type", accessor: (a: any) => ORGANIZATION_TYPE_LABELS[a.accountType as keyof typeof ORGANIZATION_TYPE_LABELS] || a.accountType },
    { header: "Balance (USD)", accessor: (a: any) => formatUSD(a.currentBalance) },
    { header: "Volume Processed (USD)", accessor: (a: any) => formatUSD(a.totalVolumeProcessed) },
    { header: "Risk Tier", accessor: "riskTier" as const },
    { header: "Status", accessor: "status" as const },
    { header: "Last Active", accessor: (a: any) => a.lastActive ? formatRelativeTime(a.lastActive) : "Never" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Accounts & Ledger Monitoring</h1>
          <PageHeaderInfo
            title="Accounts Monitoring Scope"
            description="Real tenant organization tracking — volume, balance, and risk tiers computed from the shared ledger feed. Includes AP/AR 30-60-90 aging waterfall analysis, off-taker credit & collateral limits, and risk/dormancy quarantine management."
          />
        </div>

        <ExportMenu
          data={filteredAccounts}
          columns={exportColumns}
          filename={`Accounts_Monitoring_${new Date().toISOString().split("T")[0]}`}
          targetElementId="monitored-accounts-table"
        />
      </div>

      {/* Pill Navigation Bar */}
      <SubSectionPillNav items={monitorPills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 1. Monitored Directory Tab */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Metric Cards — computed from the real accounts array */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Managed Accounts
                  </p>
                  <Users className="h-4 w-4 text-foreground" />
                </div>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{accounts.length}</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Real organizations on the platform</p>
              </CardContent>
            </Card>

            <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Active Accounts
                  </p>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{activeCount}</p>
                <p className="mt-1 text-xs text-emerald-600 font-bold">
                  {accounts.length === 0 ? "0" : ((activeCount / accounts.length) * 100).toFixed(0)}% of managed accounts
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Dormant Accounts (&gt;60 days)
                  </p>
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{dormantCount}</p>
                <p className="mt-1 text-xs text-amber-600 font-bold">
                  {accounts.length === 0 ? "0" : ((dormantCount / accounts.length) * 100).toFixed(0)}% dormancy rate
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    High Risk / Flagged
                  </p>
                  <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{highRiskCount}</p>
                <p className="mt-1 text-xs text-rose-600 font-bold">Flagged for enhanced due diligence</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 2. AP/AR 30-60-90 Aging Waterfall Tab */}
      {activeTab === "aging" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Hourglass className="h-5 w-5 text-primary" />
              AP/AR 30-60-90 Aging Waterfall
            </CardTitle>
            <CardDescription className="text-xs">
              {outstanding.length === 0
                ? "Nothing outstanding right now."
                : `${outstanding.length} entries outstanding, ${formatUSD(agingBuckets.reduce((s, b) => s + b.totalUSD, 0))} total overdue.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StatusSegmentedBar segments={agingBuckets.map((b) => ({ label: b.label, count: b.count, tone: b.tone }))} />
            <div className="grid gap-4 sm:grid-cols-4">
              {agingBuckets.map((b) => (
                <div key={b.key} className="p-4 border rounded-xl bg-card text-center space-y-1">
                  <p className="text-[11px] font-extrabold uppercase text-muted-foreground">{b.label}</p>
                  <p className="text-xl font-black text-foreground font-mono">{formatUSD(b.totalUSD)}</p>
                  <p className="text-[11px] text-muted-foreground font-semibold">{b.count} overdue entries</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Off-Taker Credit & Collateral Tab */}
      {activeTab === "offtaker_credit" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-indigo-600" />
                Off-Taker Credit Facilities & Collateral Coverage Ratios
              </span>
              <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 px-2.5 py-1 rounded-md border border-indigo-500/20">
                {mockCreditObligors.filter((o) => o.nplStatus !== "Performing").length} on Watchlist
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Deep-tier supply chain credit monitoring: off-taker credit limits vs pledged warehouse collateral inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-xs font-semibold">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-xl bg-card space-y-1">
                <p className="text-[11px] text-muted-foreground font-bold uppercase">Total Drawn Credit Facilities</p>
                <p className="text-2xl font-black text-foreground font-mono mt-1">{formatUSD(totalDrawnCreditUSD)}</p>
                <p className="text-[10px] text-muted-foreground">Across {mockCreditObligors.length} approved enterprise off-takers</p>
              </div>
              <div className="p-4 border rounded-xl bg-card space-y-1">
                <p className="text-[11px] text-muted-foreground font-bold uppercase">Warehouse Collateral Inventory</p>
                <p className="text-2xl font-black text-emerald-600 font-mono mt-1">{formatUSD(collateralInventoryUSD)}</p>
                <p className="text-[10px] text-emerald-600 font-bold">{collateralCoverageRatio.toFixed(1)}% Collateral Coverage Ratio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Risk & Dormancy Quarantine Tab */}
      {activeTab === "quarantine" && (
        <Card className="border bg-rose-500/5 border-rose-500/20 shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Risk & Dormancy Quarantine
            </CardTitle>
            <CardDescription className="text-xs">
              Accounts flagged for high-risk trading behavior or inactivity exceeding 60 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-semibold">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-xl bg-card space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">High Risk Flagged Accounts</span>
                  <span className="font-mono text-rose-600 font-bold">{highRiskCount} Accounts</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Requires Enhanced Due Diligence (EDD) clearance prior to transaction payout.</p>
              </div>

              <div className="p-4 border rounded-xl bg-card space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">Dormant Accounts (&gt;60 days)</span>
                  <span className="font-mono text-amber-600 font-bold">{dormantCount} Accounts</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Inactive for 60+ days. Automatic security lock applied to prevent unauthorized withdrawals.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card className="border shadow-2xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search business name or account ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                <Filter className="h-3.5 w-3.5" /> Filters:
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Dormant">Dormant</option>
                <option value="Suspended">Suspended</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="All">All Account Types</option>
                {Object.entries(ORGANIZATION_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Monitoring Table */}
      <Card id="monitored-accounts-table" className="border shadow-2xs">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Created System Ledger Accounts</CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredAccounts.length} managed accounts
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md">
              Audit Compliance: RBAC Protected
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Account & Date</th>
                  <th className="p-3">Business Name</th>
                  <th className="p-3">Account Type</th>
                  <th className="p-3">Total Volume Processed</th>
                  <th className="p-3">Current Ledger Balance</th>
                  <th className="p-3">Risk Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono">
                      <p className="font-bold text-foreground">{acc.id}</p>
                      <p className="text-[11px] text-muted-foreground">Created {new Date(acc.createdDate).toLocaleDateString()}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{acc.accountName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Last active: {acc.lastActive ? formatRelativeTime(acc.lastActive) : "No activity yet"}
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground border">
                        {ORGANIZATION_TYPE_LABELS[acc.accountType]}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-foreground">
                      {formatUSD(acc.totalVolumeProcessed)}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-600">
                      {formatUSD(acc.currentBalance)}
                    </td>
                    <td className="p-3">
                      <span className={statusBadgeClass(MONITORED_ACCOUNT_RISK_TONE[acc.riskTier])}>
                        {acc.riskTier}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={statusBadgeClass(MONITORED_ACCOUNT_STATUS_TONE[acc.status])}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/finance-hub/accounts-monitor/${acc.organizationId}`}
                          className="inline-flex items-center gap-1 h-7 rounded-md border border-primary/30 px-2.5 text-[11px] font-bold text-primary hover:bg-primary/5"
                        >
                          <Eye className="h-3 w-3" /> Ledger History
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!actingOfficerCapability.canApprove}
                          title={!actingOfficerCapability.canApprove ? "Requires Approve authority" : undefined}
                          onClick={() => handleToggleStatus(acc.id, acc.accountName, acc.status === "Active" ? "Suspended" : "Active", acc.countryCode)}
                          className={`h-7 text-[11px] font-bold ${
                            acc.status === "Active"
                              ? "text-rose-600 hover:bg-rose-50 border-rose-200"
                              : "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                          }`}
                        >
                          {acc.status === "Active" ? (
                            <>
                              <Ban className="h-3 w-3 mr-1" /> Suspend
                            </>
                          ) : (
                            "Activate"
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
