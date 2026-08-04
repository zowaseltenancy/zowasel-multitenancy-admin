"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Eye,
  Ban,
  FileText,
  Download,
  X,
  ArrowDownLeft,
  ArrowUpRight as ArrowUpRightIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";

interface LedgerAccount {
  id: string;
  accountName: string;
  accountType: "Merchant" | "Commodity Buyer" | "Agrodealer" | "Cooperative" | "Financer";
  createdDate: string;
  totalVolumeProcessed: number;
  currentBalance: number;
  riskTier: "Low Risk" | "Medium Risk" | "High Risk";
  status: "Active" | "Dormant" | "Suspended";
  lastActive: string;
  ledgerHistory: {
    id: string;
    date: string;
    description: string;
    type: "credit" | "debit";
    amount: number;
    runningBalance: number;
  }[];
}

const mockAccounts: LedgerAccount[] = [
  {
    id: "ACC-BUY-8819",
    accountName: "Grand Grains Milling Ltd",
    accountType: "Commodity Buyer",
    createdDate: "2025-11-12",
    totalVolumeProcessed: 420500000,
    currentBalance: 34200000,
    riskTier: "Low Risk",
    status: "Active",
    lastActive: "2 hours ago",
    ledgerHistory: [
      { id: "TXN-90812", date: "2026-08-03 14:22", description: "PO Fulfillment Payment - 500MT Maize", type: "credit", amount: 14500000, runningBalance: 34200000 },
      { id: "TXN-90710", date: "2026-08-01 10:15", description: "Escrow Deposit - Purchase Order PO-98210", type: "credit", amount: 25000000, runningBalance: 19700000 },
      { id: "TXN-90602", date: "2026-07-28 16:40", description: "Platform Service Charge Settlement", type: "debit", amount: 530000, runningBalance: -530000 },
    ],
  },
  {
    id: "ACC-MERCH-4091",
    accountName: "Kano Farmers Produce Supply Ltd",
    accountType: "Merchant",
    createdDate: "2025-08-04",
    totalVolumeProcessed: 185000000,
    currentBalance: 12400000,
    riskTier: "Low Risk",
    status: "Active",
    lastActive: "1 day ago",
    ledgerHistory: [
      { id: "TXN-88291", date: "2026-08-02 09:30", description: "Merchant Payout - Sorghum Delivery", type: "credit", amount: 8900000, runningBalance: 12400000 },
      { id: "TXN-88120", date: "2026-07-25 11:00", description: "Quality Escalation Deduction", type: "debit", amount: 350000, runningBalance: 3500000 },
    ],
  },
  {
    id: "ACC-COOP-1120",
    accountName: "Sokoto Grains Cooperative Association",
    accountType: "Cooperative",
    createdDate: "2025-04-19",
    totalVolumeProcessed: 98000000,
    currentBalance: 4800000,
    riskTier: "Medium Risk",
    status: "Active",
    lastActive: "3 days ago",
    ledgerHistory: [
      { id: "TXN-77192", date: "2026-08-02 16:45", description: "Offline Cheque Subscription Deposit", type: "credit", amount: 1500000, runningBalance: 4800000 },
    ],
  },
  {
    id: "ACC-DEALER-0092",
    accountName: "AgroInput Solutions West Africa",
    accountType: "Agrodealer",
    createdDate: "2025-01-15",
    totalVolumeProcessed: 64000000,
    currentBalance: 0,
    riskTier: "Low Risk",
    status: "Dormant",
    lastActive: "75 days ago",
    ledgerHistory: [],
  },
  {
    id: "ACC-FIN-9901",
    accountName: "Verdant Capital & Credit Fund",
    accountType: "Financer",
    createdDate: "2026-02-01",
    totalVolumeProcessed: 620000000,
    currentBalance: 88500000,
    riskTier: "High Risk",
    status: "Active",
    lastActive: "5 hours ago",
    ledgerHistory: [],
  },
];

export default function AccountsMonitorPage() {
  const [accounts, setAccounts] = useState<LedgerAccount[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState<LedgerAccount | null>(null);

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || acc.status === statusFilter;
    const matchesType = typeFilter === "All" || acc.accountType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleToggleStatus = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const nextStatus = acc.status === "Active" ? "Suspended" : "Active";
          return { ...acc, status: nextStatus };
        }
        return acc;
      })
    );
  };

  const handleExportStatementCSV = (acc: LedgerAccount) => {
    const headers = ["Transaction ID", "Date", "Description", "Type", "Amount (NGN)", "Running Balance (NGN)"];
    const rows = acc.ledgerHistory.map((item) => [
      item.id,
      item.date,
      `"${item.description}"`,
      item.type.toUpperCase(),
      item.amount,
      item.runningBalance,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Ledger_Statement_${acc.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          Monitor all user, merchant, buyer, and partner ledger accounts created across Zowasel for financial volume, active status, and compliance risk.
        </p>
      </div>

      {/* Finance Hub Nav */}
      <FinanceHubNav />

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-card shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Managed Accounts
              </p>
              <Users className="h-4 w-4 text-foreground" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">4,850</p>
            <p className="mt-1 text-xs text-muted-foreground font-semibold">Across 6 Operating Regions</p>
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
            <p className="mt-2 text-3xl font-extrabold text-foreground">3,980</p>
            <p className="mt-1 text-xs text-emerald-600 font-bold">82.1% Active 30-Day Transacting</p>
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
            <p className="mt-2 text-3xl font-extrabold text-foreground">720</p>
            <p className="mt-1 text-xs text-amber-600 font-bold">14.8% Dormancy Rate</p>
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
            <p className="mt-2 text-3xl font-extrabold text-foreground">150</p>
            <p className="mt-1 text-xs text-rose-600 font-bold">3.1% Flagged for Enhanced Due Diligence</p>
          </CardContent>
        </Card>
      </div>

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
                <option value="Commodity Buyer">Commodity Buyer</option>
                <option value="Merchant">Merchant</option>
                <option value="Agrodealer">Agrodealer</option>
                <option value="Cooperative">Cooperative</option>
                <option value="Financer">Financer</option>
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
                  <th className="p-3">Account ID & Date</th>
                  <th className="p-3">Business / User Name</th>
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
                      <p className="text-[11px] text-muted-foreground">Created {acc.createdDate}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{acc.accountName}</p>
                      <p className="text-[11px] text-muted-foreground">Last active: {acc.lastActive}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground border">
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-foreground">
                      ₦{acc.totalVolumeProcessed.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-600">
                      ₦{acc.currentBalance.toLocaleString()}
                    </td>
                    <td className="p-3">
                      {acc.riskTier === "Low Risk" && (
                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                          Low Risk
                        </span>
                      )}
                      {acc.riskTier === "Medium Risk" && (
                        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                          Medium Risk
                        </span>
                      )}
                      {acc.riskTier === "High Risk" && (
                        <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20">
                          High Risk
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {acc.status === "Active" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      )}
                      {acc.status === "Dormant" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                          <Clock className="h-3 w-3" /> Dormant
                        </span>
                      )}
                      {acc.status === "Suspended" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20">
                          <Ban className="h-3 w-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLedgerAccount(acc)}
                          className="h-7 text-[11px] font-bold border-primary/30 text-primary hover:bg-primary/5"
                        >
                          <Eye className="h-3 w-3 mr-1" /> Ledger History
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(acc.id)}
                          className={`h-7 text-[11px] font-bold ${
                            acc.status === "Active"
                              ? "text-rose-600 hover:bg-rose-50 border-rose-200"
                              : "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                          }`}
                        >
                          {acc.status === "Active" ? "Suspend" : "Activate"}
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

      {/* Account Ledger History Modal Drawer */}
      {selectedLedgerAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-base font-bold text-foreground">{selectedLedgerAccount.accountName}</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Account ID: {selectedLedgerAccount.id} &bull; Type: {selectedLedgerAccount.accountType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLedgerAccount(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 border rounded-lg bg-card">
                  <p className="text-[11px] text-muted-foreground uppercase font-bold">Ledger Balance</p>
                  <p className="text-lg font-extrabold text-emerald-600">
                    ₦{selectedLedgerAccount.currentBalance.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-card">
                  <p className="text-[11px] text-muted-foreground uppercase font-bold">Total Volume</p>
                  <p className="text-lg font-extrabold text-foreground">
                    ₦{selectedLedgerAccount.totalVolumeProcessed.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-card">
                  <p className="text-[11px] text-muted-foreground uppercase font-bold">Risk Status</p>
                  <p className="text-lg font-extrabold text-indigo-600">{selectedLedgerAccount.riskTier}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">Immutable Ledger Statement History</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportStatementCSV(selectedLedgerAccount)}
                    className="h-7 text-xs font-bold gap-1 text-primary border-primary/30"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Statement (CSV)
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b text-muted-foreground font-bold uppercase">
                      <tr>
                        <th className="p-2.5">Txn ID & Date</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-semibold">
                      {selectedLedgerAccount.ledgerHistory.length > 0 ? (
                        selectedLedgerAccount.ledgerHistory.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/30">
                            <td className="p-2.5 font-mono">
                              <p className="font-bold text-foreground">{item.id}</p>
                              <p className="text-[10px] text-muted-foreground">{item.date}</p>
                            </td>
                            <td className="p-2.5 text-foreground">{item.description}</td>
                            <td className="p-2.5 font-mono font-bold">
                              <span className={item.type === "credit" ? "text-emerald-600" : "text-rose-600"}>
                                {item.type === "credit" ? "+" : "-"}₦{item.amount.toLocaleString()}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-right font-bold text-foreground">
                              ₦{item.runningBalance.toLocaleString()}
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
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button onClick={() => setSelectedLedgerAccount(null)} className="h-8 text-xs font-bold">
                  Close Statement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
