"use client";

import { useState } from "react";
import {
  Wallet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  FileText,
  Download,
  Link2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";

interface StatementLine {
  id: string;
  date: string;
  narration: string;
  bankAmount: number;
  type: "credit" | "debit";
  bankAccount: string;
  internalTxnId: string | null;
  internalMatchName: string | null;
  status: "reconciled" | "pending" | "discrepancy";
  confidenceScore: number;
}

const mockStatementLines: StatementLine[] = [
  {
    id: "ST-8821",
    date: "2026-08-03",
    narration: "NIP/FLUTTERWAVE/ZOWASEL MARKETPLACE/PO-98210",
    bankAmount: 14500000,
    type: "credit",
    bankAccount: "Zenith Bank (Master Corp - 101492****)",
    internalTxnId: "TXN-90812",
    internalMatchName: "Grand Grains Milling Ltd (Buyer PO)",
    status: "reconciled",
    confidenceScore: 100,
  },
  {
    id: "ST-8822",
    date: "2026-08-03",
    narration: "TRF TO TERMII TECHNOLOGIES/SMS API BATCH 44",
    bankAmount: 450000,
    type: "debit",
    bankAccount: "Access Bank (Ops - 002910****)",
    internalTxnId: "EXP-44091",
    internalMatchName: "Termii SMS Gateway API Bill",
    status: "reconciled",
    confidenceScore: 100,
  },
  {
    id: "ST-8823",
    date: "2026-08-02",
    narration: "DIRECT DEBIT/PAYSTACK SETTLEMENT/SUB-ANNUAL-09",
    bankAmount: 2800000,
    type: "credit",
    bankAccount: "Zenith Bank (Master Corp - 101492****)",
    internalTxnId: "TXN-90799",
    internalMatchName: "Premier Agro Corp Subscription",
    status: "pending",
    confidenceScore: 94,
  },
  {
    id: "ST-8824",
    date: "2026-08-02",
    narration: "UNKNOWN DEPOSIT/REF: 9918273-NO-MATCH",
    bankAmount: 1200000,
    type: "credit",
    bankAccount: "Stanbic IBTC (Escrow - 902811****)",
    internalTxnId: null,
    internalMatchName: null,
    status: "discrepancy",
    confidenceScore: 0,
  },
  {
    id: "ST-8825",
    date: "2026-08-01",
    narration: "SETTLEMENT PAYOUT/MERCHANT-COOP-KANO-04",
    bankAmount: 8900000,
    type: "debit",
    bankAccount: "Stanbic IBTC (Escrow - 902811****)",
    internalTxnId: "SET-33012",
    internalMatchName: "Kano Farmers Coop Settlement",
    status: "reconciled",
    confidenceScore: 100,
  },
];

export default function MasterAccountPage() {
  const [statementFilter, setStatementFilter] = useState<"all" | "reconciled" | "pending" | "discrepancy">("all");
  const [lines, setLines] = useState<StatementLine[]>(mockStatementLines);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [matchModalLine, setMatchModalLine] = useState<StatementLine | null>(null);
  const [manualTxnInput, setManualTxnInput] = useState("");

  const filteredLines = lines.filter((line) => {
    if (statementFilter === "all") return true;
    return line.status === statementFilter;
  });

  const handleSimulateUpload = (format: string) => {
    setIsUploading(true);
    setUploadSuccess(null);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(`Bank statement file successfully imported (${format.toUpperCase()} format). 24 new entries ingested.`);
      setLines((prev) => [
        {
          id: `ST-${Math.floor(8826 + Math.random() * 100)}`,
          date: new Date().toISOString().split("T")[0],
          narration: "IMPORTED/BANK-TRANSFER/PO-102948",
          bankAmount: 5400000,
          type: "credit",
          bankAccount: "Zenith Bank (Master Corp - 101492****)",
          internalTxnId: "TXN-90999",
          internalMatchName: "AgroPlus Cooperative (PO Payment)",
          status: "pending",
          confidenceScore: 92,
        },
        ...prev,
      ]);
    }, 1000);
  };

  const handleReconcile = (id: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "reconciled",
              internalTxnId: l.internalTxnId || "TXN-AUTO-MATCH",
              confidenceScore: 100,
            }
          : l
      )
    );
  };

  const handleManualMatchSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchModalLine || !manualTxnInput) return;

    setLines((prev) =>
      prev.map((l) =>
        l.id === matchModalLine.id
          ? {
              ...l,
              status: "reconciled",
              internalTxnId: manualTxnInput,
              internalMatchName: "Manual Ledger Bind",
              confidenceScore: 100,
            }
          : l
      )
    );
    setMatchModalLine(null);
    setManualTxnInput("");
  };

  const handleExportReconciliationCSV = () => {
    const headers = ["Statement ID", "Date", "Bank Account", "Narration", "Bank Amount", "Internal Txn ID", "Status"];
    const rows = lines.map((l) => [
      l.id,
      l.date,
      `"${l.bankAccount}"`,
      `"${l.narration}"`,
      l.bankAmount,
      l.internalTxnId || "UNMATCHED",
      l.status.toUpperCase(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bank_Reconciliation_Report_${new Date().toISOString().split("T")[0]}.csv`);
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
            <h1 className="text-3xl font-bold tracking-tight">Zowasel Master Account</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
              Corporate Ledger & Bank Recon
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized view of Zowasel's internal ledger balances, corporate bank accounts, and bank statement import & reconciliation.
          </p>
        </div>

        <Button
          onClick={handleExportReconciliationCSV}
          variant="outline"
          className="h-9 text-xs font-bold gap-2 text-primary border-primary/30"
        >
          <Download className="h-4 w-4" /> Export Recon Report (CSV)
        </Button>
      </div>

      {/* Finance Hub Nav */}
      <FinanceHubNav />

      {/* Corporate Bank Accounts Ledger Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Zenith Bank Master Corporate
              </p>
              <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">₦485.2M</p>
            <p className="mt-1 text-xs text-emerald-600 font-bold">Acct: 101492**** &bull; Active Treasury</p>
          </CardContent>
        </Card>

        <Card className="border bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Stanbic IBTC Escrow Account
              </p>
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">₦84.6M</p>
            <p className="mt-1 text-xs text-amber-600 font-bold">Acct: 902811**** &bull; 18 Scheduled Payouts</p>
          </CardContent>
        </Card>

        <Card className="border bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Access Bank Operational Ops
              </p>
              <Building2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">₦14.2M</p>
            <p className="mt-1 text-xs text-sky-600 font-bold">Acct: 002910**** &bull; API & Operations</p>
          </CardContent>
        </Card>

        <Card className="border bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Reserve Escrow Account
              </p>
              <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">₦120.0M</p>
            <p className="mt-1 text-xs text-indigo-600 font-bold">Guarantee Reserve & Liquidity</p>
          </CardContent>
        </Card>
      </div>

      {/* Bank Statement File Import Section */}
      <Card className="border shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            <span>Import Corporate Bank Statements</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Upload bank statements to run automated reconciliation against Zowasel's internal ledger transactions. Supported formats: CSV, XLSX, MT940.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadSuccess && (
            <div className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div
              onClick={() => handleSimulateUpload("csv")}
              className="p-4 border border-dashed rounded-xl bg-card hover:bg-muted/50 hover:border-primary transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2 group"
            >
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <p className="text-xs font-bold text-foreground">Upload CSV Statement</p>
                <p className="text-[11px] text-muted-foreground">Standard comma-separated bank export</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7 pointer-events-none font-bold">
                {isUploading ? "Processing..." : "Select CSV File"}
              </Button>
            </div>

            <div
              onClick={() => handleSimulateUpload("xlsx")}
              className="p-4 border border-dashed rounded-xl bg-card hover:bg-muted/50 hover:border-primary transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2 group"
            >
              <FileSpreadsheet className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-bold text-foreground">Upload Excel (.xlsx)</p>
                <p className="text-[11px] text-muted-foreground">Microsoft Excel multi-tab statement</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7 pointer-events-none font-bold">
                {isUploading ? "Processing..." : "Select XLSX File"}
              </Button>
            </div>

            <div
              onClick={() => handleSimulateUpload("mt940")}
              className="p-4 border border-dashed rounded-xl bg-card hover:bg-muted/50 hover:border-primary transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2 group"
            >
              <FileText className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-bold text-foreground">Upload SWIFT MT940</p>
                <p className="text-[11px] text-muted-foreground">ISO interbank electronic statement format</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7 pointer-events-none font-bold">
                {isUploading ? "Processing..." : "Select MT940 File"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation Table View */}
      <Card className="border shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-2">
          <div>
            <CardTitle className="text-base font-bold">Bank Statement Line Items & Reconciliation</CardTitle>
            <CardDescription className="text-xs">
              Matching imported bank statement entries against internal platform ledger records.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(["all", "reconciled", "pending", "discrepancy"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatementFilter(filter)}
                className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition-colors ${
                  statementFilter === filter
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter === "all" ? "All Entries" : filter}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Statement Ref & Date</th>
                  <th className="p-3">Bank Account</th>
                  <th className="p-3">Bank Narration</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Internal System Match</th>
                  <th className="p-3">Reconciliation Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filteredLines.map((line) => (
                  <tr key={line.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-foreground font-mono">{line.id}</p>
                      <p className="text-[11px] text-muted-foreground">{line.date}</p>
                    </td>
                    <td className="p-3 font-medium text-foreground">{line.bankAccount}</td>
                    <td className="p-3 max-w-[260px] truncate text-muted-foreground font-mono text-[11px]" title={line.narration}>
                      {line.narration}
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span className={line.type === "credit" ? "text-emerald-600" : "text-rose-600"}>
                        {line.type === "credit" ? "+" : "-"}₦{line.bankAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3">
                      {line.internalTxnId ? (
                        <div>
                          <p className="font-mono text-primary font-bold">{line.internalTxnId}</p>
                          <p className="text-[11px] text-muted-foreground">{line.internalMatchName}</p>
                        </div>
                      ) : (
                        <span className="text-rose-500 font-bold italic">No match found</span>
                      )}
                    </td>
                    <td className="p-3">
                      {line.status === "reconciled" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Reconciled
                        </span>
                      )}
                      {line.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                          <Clock className="h-3 w-3" /> Pending Review ({line.confidenceScore}% Match)
                        </span>
                      )}
                      {line.status === "discrepancy" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20">
                          <AlertTriangle className="h-3 w-3" /> Discrepancy
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {line.status !== "reconciled" && (
                          <Button
                            size="sm"
                            onClick={() => handleReconcile(line.id)}
                            className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            <Check className="h-3 w-3 mr-1" /> Reconcile
                          </Button>
                        )}
                        {!line.internalTxnId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setMatchModalLine(line)}
                            className="h-7 text-[11px] font-bold text-primary border-primary/30"
                          >
                            <Link2 className="h-3 w-3 mr-1" /> Bind Match
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manual Match Finder Modal */}
      {matchModalLine && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Bind Manual Internal Transaction</h2>
              </div>
              <button
                onClick={() => setMatchModalLine(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleManualMatchSave} className="p-5 space-y-4 text-xs font-semibold">
              <div className="p-3 border rounded-lg bg-muted/30 space-y-1">
                <p className="font-bold text-foreground font-mono">{matchModalLine.id}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{matchModalLine.narration}</p>
                <p className="font-bold text-emerald-600">Amount: ₦{matchModalLine.bankAmount.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Enter Internal Transaction / PO ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TXN-90812 or PO-98210"
                  value={manualTxnInput}
                  onChange={(e) => setManualTxnInput(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 font-mono text-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMatchModalLine(null)}
                  className="h-8 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-primary font-bold">
                  Bind & Reconcile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
