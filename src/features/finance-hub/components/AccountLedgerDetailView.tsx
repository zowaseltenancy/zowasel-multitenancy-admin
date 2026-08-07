"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Download,
  FileText,
  Wallet,
  ShieldAlert,
  Printer,
  History,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePageHeader } from "@/components/layout/PageHeaderContext";
import { useMonitoredAccounts } from "../hooks/useMonitoredAccounts";
import { useLedgerTransactions } from "../hooks/useLedgerTransactions";
import { useActingFinanceOfficer } from "../context/FinanceOfficerContext";
import { useFinanceAuditLog } from "../context/FinanceAuditLogContext";
import { currencySymbolFor, formatUSD } from "../utils/currency";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { LEDGER_CATEGORY_LABELS, MONITORED_ACCOUNT_RISK_TONE, MONITORED_ACCOUNT_STATUS_TONE } from "@/constants/finance";
import { statusBadgeClass } from "@/lib/statusTone";

interface Props {
  organizationId: string;
}

// A real, linkable page per Austin's note — this used to be a modal on the
// Accounts Monitoring table. Ledger detail needs a URL: it gets pasted into
// support tickets and audit notes, and needs its own browser history entry.
export default function AccountLedgerDetailView({ organizationId }: Props) {
  const { accounts, toggleStatus } = useMonitoredAccounts();
  const { transactions } = useLedgerTransactions();
  const { actingOfficer } = useActingFinanceOfficer();
  const { entries, logAction } = useFinanceAuditLog();
  const actorName = `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position})`;

  const account = accounts.find((a) => a.organizationId === organizationId);

  usePageHeader(
    account?.accountName ?? "Account",
    account ? `${ORGANIZATION_TYPE_LABELS[account.accountType]} ledger history` : undefined
  );

  if (!account) {
    notFound();
  }

  const ledgerHistory = transactions
    .filter((t) => t.organizationId === organizationId || t.accountName === account.accountName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Per-account activity panel — the NetSuite/Xero pattern (a per-record
  // history section) layered on top of the global Activity Log page.
  const accountActivity = entries.filter((e) => e.target === account.accountName);

  const handleToggleStatus = () => {
    toggleStatus(account.id);
    logAction(
      actorName,
      `${account.status === "Active" ? "Suspended" : "Activated"} account`,
      account.accountName,
      undefined,
      account.countryCode
    );
  };

  const handleExportStatementCSV = () => {
    const headers = ["Transaction ID", "Date", "Description", "Type", "Amount", "Currency", "Status"];
    const rows = ledgerHistory.map((t) => [
      t.id,
      t.date,
      `"${LEDGER_CATEGORY_LABELS[t.category]} — ${t.reference}"`,
      t.type.toUpperCase(),
      t.amount,
      t.currencyCode,
      t.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Ledger_Statement_${account.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #account-statement-print, #account-statement-print * { visibility: visible; }
          #account-statement-print { position: fixed; inset: 0; margin: 0; }
        }
      `}</style>

      <Link
        href="/admin/finance-hub/accounts-monitor"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground print:hidden"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Accounts Monitoring
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{account.accountName}</h1>
            <span className={statusBadgeClass(MONITORED_ACCOUNT_STATUS_TONE[account.status])}>
              {account.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            {account.id} &bull; {ORGANIZATION_TYPE_LABELS[account.accountType]}
            {account.countryName ? ` • ${account.countryName}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.print()} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Print Statement
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            className={`gap-1.5 ${
              account.status === "Active"
                ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            {account.status === "Active" ? (
              <>
                <Ban className="h-3.5 w-3.5" /> Suspend Account
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Activate Account
              </>
            )}
          </Button>
        </div>
      </div>

      <div id="account-statement-print" className="space-y-6">
      <div className="print:block hidden mb-4">
        <p className="text-lg font-extrabold">Zowasel Technologies — Account Statement</p>
        <p className="text-xs">{account.accountName} &bull; Generated {new Date().toLocaleString()}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ledger Balance</p>
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-600">{formatUSD(account.currentBalance)}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Volume</p>
              <FileText className="h-4 w-4 text-foreground" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-foreground">{formatUSD(account.totalVolumeProcessed)}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Risk Status</p>
              <ShieldAlert className="h-4 w-4 text-indigo-600" />
            </div>
            <span className={statusBadgeClass(MONITORED_ACCOUNT_RISK_TONE[account.riskTier])}>
              {account.riskTier}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Immutable Ledger Statement History</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportStatementCSV}
            className="h-8 text-xs font-bold gap-1.5 text-primary border-primary/30"
          >
            <Download className="h-3.5 w-3.5" /> Export Statement (CSV)
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase">
                <tr>
                  <th className="p-3">Txn ID & Date</th>
                  <th className="p-3">Category & Reference</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {ledgerHistory.length > 0 ? (
                  ledgerHistory.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono">
                        <p className="font-bold text-foreground">{t.id}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(t.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>
                      <td className="p-3 text-foreground">
                        {LEDGER_CATEGORY_LABELS[t.category]}
                        <p className="text-[10px] text-muted-foreground font-mono">{t.reference}</p>
                      </td>
                      <td className="p-3 text-muted-foreground">{t.status}</td>
                      <td className="p-3 font-mono text-right font-bold">
                        <span className={t.type === "credit" ? "text-emerald-600" : "text-rose-600"}>
                          {t.type === "credit" ? "+" : "-"}
                          {currencySymbolFor(t.currencyCode)}
                          {t.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground italic">
                      No ledger transactions recorded yet for this account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Per-account activity panel — the NetSuite/Xero pattern: who
          touched this specific account, in context, distinct from the
          global Activity Log page. */}
      <Card className="border shadow-2xs print:hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Recent Activity on This Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accountActivity.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No actions recorded against this account yet.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {accountActivity.slice(0, 8).map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-3 border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground">{e.action}</p>
                    <p className="text-muted-foreground">{e.actor}{e.details ? ` — ${e.details}` : ""}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(e.timestamp).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
