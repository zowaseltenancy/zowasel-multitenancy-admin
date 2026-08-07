"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusSegmentedBar from "@/components/shared/StatusSegmentedBar";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";
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

const AGING_BUCKETS = [
  { key: "current", label: "Current (0-30d)", tone: "info" as const, max: 30 },
  { key: "b31_60", label: "31-60d", tone: "warning" as const, max: 60 },
  { key: "b61_90", label: "61-90d", tone: "warning" as const, max: 90 },
  { key: "b90plus", label: "90d+", tone: "danger" as const, max: Infinity },
];

export default function AccountsMonitorPage() {
  const { accounts, toggleStatus, formatRelativeTime } = useMonitoredAccounts();
  const { transactions } = useLedgerTransactions();
  const { actingOfficer } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();
  const actorName = `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position})`;
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
    return {
      ...bucket,
      count: items.length,
      totalUSD: items.reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0),
    };
  });

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || acc.status === statusFilter;
    const matchesType = typeFilter === "All" || acc.accountType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Every count below is derived from the real accounts array — no
  // hardcoded header figure sitting above a handful of table rows.
  const activeCount = accounts.filter((a) => a.status === "Active").length;
  const dormantCount = accounts.filter((a) => a.status === "Dormant").length;
  const highRiskCount = accounts.filter((a) => a.riskTier === "High Risk").length;

  const handleToggleStatus = (accountId: string, accountName: string, nextStatus: string, countryCode?: string) => {
    toggleStatus(accountId);
    logAction(actorName, `${nextStatus === "Active" ? "Activated" : "Suspended"} account`, accountName, undefined, countryCode);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Accounts & Ledger Monitoring</h1>
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-600 border border-purple-500/20">
            System Risk & Audit Management
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Every account below is a real organization — volume, balance, and risk tier are computed
          from the shared ledger feed, not hand-authored figures.
        </p>
      </div>

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

      {/* AP/AR Aging — real pending/pending-approval entries bucketed by how
          long they've actually been outstanding. */}
      <Card className="border shadow-2xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Hourglass className="h-4 w-4 text-primary" />
            AP/AR Aging
          </CardTitle>
          <CardDescription className="text-xs">
            {outstanding.length === 0
              ? "Nothing outstanding right now."
              : `${outstanding.length} entries outstanding, ${formatUSD(agingBuckets.reduce((s, b) => s + b.totalUSD, 0))} total.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatusSegmentedBar segments={agingBuckets.map((b) => ({ label: b.label, count: b.count, tone: b.tone }))} />
          <div className="grid gap-3 sm:grid-cols-4">
            {agingBuckets.map((b) => (
              <div key={b.key} className="p-3 border rounded-lg text-center">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">{b.label}</p>
                <p className="text-lg font-extrabold text-foreground">{formatUSD(b.totalUSD)}</p>
                <p className="text-[10px] text-muted-foreground">{b.count} entries</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
      <Card className="border shadow-2xs">
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
