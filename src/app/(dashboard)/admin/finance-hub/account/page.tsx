"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Wallet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  FileSpreadsheet,
  Check,
  X,
  FileText,
  Download,
  Link2,
  Globe2,
  ArrowRightLeft,
  History,
  Landmark,
  Receipt,
  Lock,
  TrendingDown,
  Sliders,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurrencyPairSelector from "@/components/shared/CurrencyPairSelector";
import { getCrossRate } from "@/constants/currencies";
import ExportMenu from "@/components/shared/ExportMenu";
import StatementDetailModal from "@/features/finance-hub/components/StatementDetailModal";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import { useTreasuryAccounts } from "@/features/finance-hub/hooks/useTreasuryAccounts";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { convertToUSD, formatNative, formatUSD } from "@/features/finance-hub/utils/currency";
import { VAT_RATE_BY_COUNTRY } from "@/constants/finance";
import { StatementLine } from "@/types/finance";
import {
  buildSampleCsv,
  parseCsvStatement,
  parseMt940Statement,
  parseXlsxStatement,
  ParsedStatementRow,
} from "@/features/finance-hub/utils/statementParsers";

const mockStatementLines: StatementLine[] = [
  {
    id: "ST-8821",
    date: "2026-08-03",
    narration: "TRF TO TERMII TECHNOLOGIES/SMS API BATCH 44",
    bankAmount: 450000,
    type: "debit",
    bankAccount: "Access Bank Operational Ops (002910****)",
    internalTxnId: "TRM-SMS-202608",
    internalMatchName: "Termii Technologies",
    status: "reconciled",
    confidenceScore: 100,
  },
  {
    id: "ST-8822",
    date: "2026-08-03",
    narration: "NIP/PAYSTACK/ZOWASEL PLATFORM FEE/FARMFRESH COOP",
    bankAmount: 250000,
    type: "credit",
    bankAccount: "Zenith Bank Master Corporate (101492****)",
    internalTxnId: "TXN-0001",
    internalMatchName: "FarmFresh Cooperative",
    status: "reconciled",
    confidenceScore: 100,
  },
  {
    id: "ST-8823",
    date: "2026-08-01",
    narration: "SETTLEMENT PAYOUT/RIVERBEND FARMERS COOP UNION",
    bankAmount: 8900000,
    type: "debit",
    bankAccount: "Stanbic IBTC Escrow Account (902811****)",
    internalTxnId: "SET-RIVERBEND-04",
    internalMatchName: "Riverbend Farmers Cooperative Union",
    status: "pending",
    confidenceScore: 94,
  },
  {
    id: "ST-8824",
    date: "2026-08-02",
    narration: "UNKNOWN DEPOSIT/REF: 9918273-NO-MATCH",
    bankAmount: 1200000,
    type: "credit",
    bankAccount: "Stanbic IBTC Escrow Account (902811****)",
    internalTxnId: null,
    internalMatchName: null,
    status: "discrepancy",
    confidenceScore: 0,
  },
  {
    id: "ST-8825",
    date: "2026-08-04",
    narration: "TRF TO SAFARICOM/SMS GATEWAY 0819",
    bankAmount: 65000,
    type: "debit",
    bankAccount: "Equity Bank Kenya Collections (440217****)",
    internalTxnId: "SAF-SMS-0819",
    internalMatchName: "Safaricom SMS Gateway",
    status: "reconciled",
    confidenceScore: 100,
  },
];

export default function MasterAccountPage() {
  const { accounts, totalUSD, transferBetweenAccounts } = useTreasuryAccounts();
  const { transactions } = useLedgerTransactions();
  const { actingOfficer, canTransfer, actingOfficerCapability } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();
  const actorName = `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position})`;
  const [fxDevalPct, setFxDevalPct] = useState(0);
  const [stepIncrement, setStepIncrement] = useState(5);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [compareCurrency, setCompareCurrency] = useState("NGN");
  const selectedPair = `${baseCurrency}/${compareCurrency}`;
  const baseCrossRate = getCrossRate(baseCurrency, compareCurrency);
  const stressedCrossRate = baseCrossRate * (1 + fxDevalPct / 100);
  const [selectedStatementLine, setSelectedStatementLine] = useState<StatementLine | null>(null);

  const [activeTab, setActiveTab] = useState<string>("balances");

  const [statementFilter, setStatementFilter] = useState<"all" | "reconciled" | "pending" | "discrepancy">("all");
  const [lines, setLines] = useState<StatementLine[]>(mockStatementLines);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [matchModalLine, setMatchModalLine] = useState<StatementLine | null>(null);
  const [manualTxnInput, setManualTxnInput] = useState("");

  const [transferOpen, setTransferOpen] = useState(false);
  const [transferFromId, setTransferFromId] = useState("");
  const [transferToId, setTransferToId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const accountPills = [
    { id: "balances", label: "Treasury & Corporate Accounts", icon: Wallet, badge: accounts.length },
    { id: "stress_test", label: "Currency Evaluation & Stress-Test", icon: Sliders, badge: `${fxDevalPct > 0 ? "+" : ""}${fxDevalPct}%` },
    { id: "reconciliation", label: "Bank Statement Import & Recon", icon: FileSpreadsheet, badge: lines.length },
    { id: "tax_compliance", label: "VAT & Tax Compliance", icon: Receipt },
  ];

  const [remittedCountries, setRemittedCountries] = useState<Record<string, boolean>>({});

  const csvInputRef = useRef<HTMLInputElement>(null);
  const xlsxInputRef = useRef<HTMLInputElement>(null);
  const mt940InputRef = useRef<HTMLInputElement>(null);

  // Pending settlements + all-time revenue — the two Master Account figures
  // the original brief asked for that had drifted onto the Overview page.
  const pendingSettlementsUSD = transactions
    .filter((t) => t.status === "Pending" || t.status === "Pending Approval")
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);

  const totalHistoricalRevenueUSD = transactions
    .filter((t) => t.status === "Completed" && t.type === "credit")
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);

  // VAT liability per country in scope — real standard rates applied to
  // real completed Platform Fee revenue, not a display-only figure.
  const vatByCountry = accounts.reduce<{ countryCode: string; countryName: string; liabilityUSD: number }[]>(
    (acc, account) => {
      if (acc.some((v) => v.countryCode === account.countryCode)) return acc;
      const rate = VAT_RATE_BY_COUNTRY[account.countryCode];
      if (!rate) return acc;
      const feeRevenueUSD = transactions
        .filter(
          (t) =>
            t.countryCode === account.countryCode &&
            t.category === "Platform Fee" &&
            t.status === "Completed" &&
            t.type === "credit"
        )
        .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);
      acc.push({ countryCode: account.countryCode, countryName: account.countryName, liabilityUSD: feeRevenueUSD * rate });
      return acc;
    },
    []
  );

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!transferFromId || !transferToId || transferFromId === transferToId || !amount) return;

    const result = transferBetweenAccounts(transferFromId, transferToId, amount);
    if (!result) {
      toast.error("Transfer failed — check the amount doesn't exceed the source account's balance.");
      return;
    }

    const from = accounts.find((a) => a.id === transferFromId);
    const to = accounts.find((a) => a.id === transferToId);
    logAction(
      actorName,
      "Internal transfer between accounts",
      `${from?.accountName} → ${to?.accountName}`,
      `${formatNative(amount, from?.currencySymbol ?? "")} moved (${formatUSD(result.usdMoved)})`,
      from?.countryCode
    );
    toast.success(`Transferred ${formatNative(amount, from?.currencySymbol ?? "")} to ${to?.accountName}.`);
    setTransferOpen(false);
    setTransferFromId("");
    setTransferToId("");
    setTransferAmount("");
  };

  const handleMarkVatRemitted = (countryCode: string, countryName: string, liabilityUSD: number) => {
    // A statutory tax-remittance attestation is at least Approve-level, not
    // a routine action every officer should be able to sign off on.
    if (!actingOfficerCapability.canApprove) {
      toast.error(`${actorName} does not hold Approve authority and cannot attest a VAT remittance.`);
      return;
    }
    setRemittedCountries((prev) => ({ ...prev, [countryCode]: true }));
    logAction(
      actorName,
      "Marked VAT as remitted",
      countryName,
      `${formatUSD(liabilityUSD)} liability cleared`,
      countryCode
    );
    toast.success(`${countryName} VAT marked as remitted.`);
  };

  const filteredLines = lines.filter((line) => {
    if (statementFilter === "all") return true;
    return line.status === statementFilter;
  });

  // Real reconciliation against the shared ledger feed — an exact amount
  // match on a Completed transaction binds the statement line; no match
  // surfaces as a genuine discrepancy, not a scripted outcome.
  const ingestParsedRows = (rows: ParsedStatementRow[], format: string, bankAccount: string) => {
    if (!actingOfficerCapability.canValidate) {
      setUploadError(`${actorName} does not hold Validate authority and cannot import/auto-reconcile bank statements.`);
      setUploadSuccess(null);
      return;
    }
    if (rows.length === 0) {
      setUploadError(`No parseable statement lines found in that ${format.toUpperCase()} file.`);
      setUploadSuccess(null);
      return;
    }

    const newLines: StatementLine[] = rows.map((row, index) => {
      const match = transactions.find((t) => t.amount === row.amount && t.status === "Completed");

      return {
        id: `ST-${Date.now().toString().slice(-6)}${index}`,
        date: row.date,
        narration: row.narration || "IMPORTED BANK LINE — NO NARRATION",
        bankAmount: row.amount,
        type: row.type,
        bankAccount,
        internalTxnId: match ? match.reference : null,
        internalMatchName: match ? match.accountName : null,
        status: match ? "reconciled" : "discrepancy",
        confidenceScore: match ? 100 : 0,
      };
    });

    setLines((prev) => [...newLines, ...prev]);
    setUploadError(null);
    setUploadSuccess(
      `${format.toUpperCase()} statement imported: ${newLines.length} line${newLines.length === 1 ? "" : "s"} ingested, ${
        newLines.filter((l) => l.status === "reconciled").length
      } auto-reconciled against live ledger transactions.`
    );
    logAction(
      actorName,
      "Imported bank statement",
      bankAccount,
      `${newLines.length} lines (${format.toUpperCase()}), ${newLines.filter((l) => l.status === "reconciled").length} auto-reconciled`
    );
    toast.success(`Bank statement imported — ${newLines.length} lines ingested.`);
  };

  const handleFileSelected = async (file: File, format: "csv" | "xlsx" | "mt940") => {
    setIsUploading(true);
    setUploadSuccess(null);
    setUploadError(null);

    try {
      if (format === "csv") {
        const text = await file.text();
        ingestParsedRows(parseCsvStatement(text), format, "Zenith Bank Master Corporate (101492****)");
      } else if (format === "xlsx") {
        const rows = await parseXlsxStatement(file);
        ingestParsedRows(rows, format, "Zenith Bank Master Corporate (101492****)");
      } else {
        const text = await file.text();
        ingestParsedRows(parseMt940Statement(text), format, "Stanbic IBTC Escrow Account (902811****)");
      }
    } catch (error) {
      setUploadError(
        `Failed to parse ${format.toUpperCase()} file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      toast.error(`Could not parse that ${format.toUpperCase()} file.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([buildSampleCsv()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sample_Bank_Statement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReconcile = (id: string) => {
    // Reconciliation is the Validator's job (Level 2 of the 4-level
    // hierarchy — "Doc & Receipt Check") per the Control Center Matrix.
    // Roles with canValidate = false (e.g. the CEO, who is authorize-only)
    // can view statement lines but can't clear them.
    if (!actingOfficerCapability.canValidate) {
      toast.error(`${actorName} does not hold Validate authority under the Finance Control Center Matrix and cannot reconcile statement lines.`);
      return;
    }

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
    logAction(actorName, "Reconciled statement line", id);
  };

  const handleManualMatchSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchModalLine || !manualTxnInput) return;
    // Same outcome as handleReconcile (marks the line reconciled) — must
    // carry the same Validate-authority gate, or it's a backdoor around it.
    if (!actingOfficerCapability.canValidate) {
      toast.error(`${actorName} does not hold Validate authority under the Finance Control Center Matrix and cannot bind statement lines.`);
      return;
    }

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
    logAction(actorName, "Manually bound statement line", matchModalLine.id, `to ${manualTxnInput}`);
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
            <h1 className="text-3xl font-bold tracking-tight">Master Accounts & Bank Reconciliation</h1>
            <PageHeaderInfo
              title="Master Accounts Scope"
              description="Every corporate account stays in its native currency — country and legal entity are native properties. Includes bank statement ingestion (CSV, XLSX, MT940), automated transaction matching, discrepancy management, and inter-account transfers."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canTransfer && (
            <Button
              onClick={() => setTransferOpen(true)}
              className="h-9 text-xs font-bold gap-2"
            >
              <ArrowRightLeft className="h-4 w-4" /> Transfer Between Accounts
            </Button>
          )}
          <ExportMenu
            data={lines}
            columns={[
              { header: "Statement ID", accessor: "id" },
              { header: "Date", accessor: "date" },
              { header: "Bank Account", accessor: "bankAccount" },
              { header: "Narration", accessor: "narration" },
              { header: "Amount", accessor: (l) => `${l.type === "credit" ? "+" : "-"}₦${l.bankAmount}` },
              { header: "Internal Match", accessor: (l) => l.internalTxnId || "NO MATCH" },
              { header: "Status", accessor: "status" },
            ]}
            filename={`Bank_Reconciliation_Report_${new Date().toISOString().split("T")[0]}`}
            targetElementId="bank-reconcile-table"
          />
        </div>
      </div>

      {/* Pill Navigation Bar */}
      <SubSectionPillNav items={accountPills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 1. Treasury & Corporate Accounts Tab */}
      {activeTab === "balances" && (
        <div className="space-y-6">
          <Card className="border bg-primary/5 border-primary/20 shadow-2xs">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Globe2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Consolidated Treasury Position (USD Rollup)
                  </p>
                  <p className="text-3xl font-extrabold text-foreground">{formatUSD(totalUSD)}</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b text-muted-foreground font-bold uppercase">
                    <tr>
                      <th className="p-2.5">Currency</th>
                      <th className="p-2.5">Native Balance</th>
                      <th className="p-2.5">USD Equivalent</th>
                      <th className="p-2.5">% of Treasury</th>
                      <th className="p-2.5">FX Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold">
                    {accounts.map((a) => {
                      const usd = a.nativeBalance / a.fxRateToUSD;
                      const pct = totalUSD === 0 ? 0 : (usd / totalUSD) * 100;
                      return (
                        <tr key={a.id}>
                          <td className="p-2.5 font-mono font-bold">{a.currencyCode}</td>
                          <td className="p-2.5">{formatNative(a.nativeBalance, a.currencySymbol)}</td>
                          <td className="p-2.5">{formatUSD(usd)}</td>
                          <td className="p-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                              </div>
                              <span>{pct.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="p-2.5 font-mono text-muted-foreground text-[11px]">
                            {a.fxRateToUSD.toLocaleString()}/$ as of{" "}
                            {new Date(a.fxRateAsOf).toLocaleString(undefined, { month: "short", day: "numeric" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Account Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((a) => {
              const usdVal = a.nativeBalance / a.fxRateToUSD;
              return (
                <Card key={a.id} className="border shadow-2xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{a.accountName}</span>
                      <span className="font-mono text-xs font-bold text-muted-foreground">{a.currencyCode}</span>
                    </div>
                    <CardDescription className="text-xs">{a.bankName} &bull; {a.maskedAccountNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-2xl font-black text-foreground font-mono">{formatNative(a.nativeBalance, a.currencySymbol)}</p>
                      <p className="text-xs text-muted-foreground font-semibold">{formatUSD(usdVal)} USD equivalent</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40 border text-[10px] font-bold text-muted-foreground flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3 text-emerald-600" /> Immutable Bank Details
                      </span>
                      <span>Verified</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. FX Devaluation Stress-Test Tab */}
      {activeTab === "stress_test" && (
        <div className="space-y-6">
          {/* 2. Currency Evaluation & Stress-Test Simulator (Upgraded) */}
          <Card className="border shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  Currency Evaluation & Stress-Test Simulator
                </span>
                <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20">
                  Multi-Currency & Regional Cross-Corridor Engine
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Simulate sudden currency shifts (both appreciation and devaluation ranging from -1,000% to +1,000%) across international and regional African cross-corridor trading pairs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Currency Pair & Step Granularity Controls */}
              <div className="grid gap-4 sm:grid-cols-2 p-4 border rounded-xl bg-card">
                <CurrencyPairSelector
                  base={baseCurrency}
                  compare={compareCurrency}
                  onChange={(base, compare) => {
                    setBaseCurrency(base);
                    setCompareCurrency(compare);
                  }}
                />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Slider Drag Granularity (Step Increment)</label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[1, 5, 10, 20, 25, 50, 100].map((step) => (
                      <button
                        type="button"
                        key={step}
                        onClick={() => setStepIncrement(step)}
                        className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition-all ${
                          stepIncrement === step
                            ? "bg-primary text-white shadow-2xs"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {step}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3 text-xs font-semibold">
                <span className="text-muted-foreground">
                  Current rate: 1 {baseCurrency} = <span className="font-mono font-bold text-foreground">{baseCrossRate.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span> {compareCurrency}
                </span>
                <span className="text-muted-foreground">
                  Stressed rate: 1 {baseCurrency} = <span className={`font-mono font-bold ${fxDevalPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{stressedCrossRate.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span> {compareCurrency}
                </span>
              </div>

              {/* Slider Control */}
              <div className="p-4 border rounded-xl bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Currency Shift Percentage for <span className="font-mono font-extrabold text-foreground">{selectedPair}</span>:
                  </label>
                  <span
                    className={`font-mono text-base font-black px-3 py-1 rounded-md border ${
                      fxDevalPct > 0
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : fxDevalPct < 0
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {fxDevalPct > 0 ? `+${fxDevalPct}% (Appreciation)` : fxDevalPct < 0 ? `${fxDevalPct}% (Devaluation)` : "0% (Parity)"}
                  </span>
                </div>

                <input
                  type="range"
                  min="-1000"
                  max="1000"
                  step={stepIncrement}
                  value={fxDevalPct}
                  onChange={(e) => setFxDevalPct(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2"
                />

                <div className="flex justify-between text-[10px] text-muted-foreground font-mono font-bold">
                  <span className="text-rose-600">-1,000% Devaluation</span>
                  <span>0% Parity</span>
                  <span className="text-emerald-600">+1,000% Revaluation</span>
                </div>
              </div>

              {/* Stress Results Grid */}
              <div className="grid gap-4 sm:grid-cols-3 text-xs font-semibold">
                <div className="p-4 border rounded-xl bg-card space-y-1">
                  <p className="text-[11px] text-muted-foreground font-bold uppercase">Mark-to-Market Valuation Impact</p>
                  <p
                    className={`text-2xl font-black font-mono ${
                      fxDevalPct >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {fxDevalPct >= 0 ? "+" : ""}{formatUSD((totalUSD * fxDevalPct) / 100)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Simulated MTM impact on liquid portfolio</p>
                </div>

                <div className="p-4 border rounded-xl bg-card space-y-1">
                  <p className="text-[11px] text-muted-foreground font-bold uppercase">Adjusted Treasury Position</p>
                  <p className="text-2xl font-black text-foreground font-mono">
                    {formatUSD(totalUSD + (totalUSD * fxDevalPct) / 100)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Post-stress valuation ({selectedPair})</p>
                </div>

                <div className="p-4 border rounded-xl bg-card space-y-1">
                  <p className="text-[11px] text-muted-foreground font-bold uppercase">Escrow FX Exposure Variance</p>
                  <p
                    className={`text-2xl font-black font-mono ${
                      fxDevalPct >= 0 ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {fxDevalPct >= 0 ? "+" : ""}{formatUSD((pendingSettlementsUSD * fxDevalPct) / 100)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">FX gap on pending clearing settlements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Settlements</p>
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{formatUSD(pendingSettlementsUSD)}</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Awaiting settlement or approval</p>
              </CardContent>
            </Card>
            <Card className="border shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Historical Revenue</p>
                  <History className="h-4 w-4 text-foreground" />
                </div>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{formatUSD(totalHistoricalRevenueUSD)}</p>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">All-time completed credits, in scope</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 4. VAT & Tax Compliance Tab */}
      {activeTab === "tax_compliance" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Landmark className="h-4 w-4 text-primary" />
              Tax & Regulatory — VAT Liability
            </CardTitle>
            <CardDescription className="text-xs">
              Standard VAT rate applied to completed platform-fee revenue, per country in scope.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vatByCountry.map((v) => (
              <div key={v.countryCode} className="p-4 border rounded-xl space-y-3 bg-card">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="text-sm">{v.countryName}</span>
                  <span className="font-mono text-muted-foreground">
                    {(VAT_RATE_BY_COUNTRY[v.countryCode] * 100).toFixed(1)}% VAT Rate
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-foreground font-mono">{formatUSD(v.liabilityUSD)}</p>
                {remittedCountries[v.countryCode] ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Remitted to Tax Authority
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!actingOfficerCapability.canApprove}
                    title={!actingOfficerCapability.canApprove ? `${actorName} lacks Approve authority` : undefined}
                    onClick={() => handleMarkVatRemitted(v.countryCode, v.countryName, v.liabilityUSD)}
                    className="h-8 text-xs font-bold w-full"
                  >
                    <Receipt className="h-3.5 w-3.5 mr-1.5 text-primary" /> Mark as Remitted
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 3. Bank Statement Import & Reconciliation Tab */}
      {activeTab === "reconciliation" && (
        <div className="space-y-6">

      {/* Bank Statement File Import Section */}
      <Card className="border shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            <span>Import Corporate Bank Statements</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Upload bank statements to run automated reconciliation against Zowasel&rsquo;s internal ledger transactions. Supported formats: CSV, XLSX, MT940.{" "}
            <button type="button" onClick={handleDownloadSample} className="font-bold text-primary underline">
              Download a sample CSV
            </button>{" "}
            to try it end to end.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadSuccess && (
            <div className="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3 rounded-lg border bg-rose-500/10 border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file, "csv");
                e.target.value = "";
              }}
            />
            <div
              onClick={() => csvInputRef.current?.click()}
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

            <input
              ref={xlsxInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file, "xlsx");
                e.target.value = "";
              }}
            />
            <div
              onClick={() => xlsxInputRef.current?.click()}
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

            <input
              ref={mt940InputRef}
              type="file"
              accept=".sta,.940,.mt940,text/plain"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file, "mt940");
                e.target.value = "";
              }}
            />
            <div
              onClick={() => mt940InputRef.current?.click()}
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
      <Card id="bank-reconcile-table" className="border shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-2">
          <div>
            <CardTitle className="text-base font-bold">Bank Statement Line Items & Reconciliation</CardTitle>
            <CardDescription className="text-xs">
              Matching imported bank statement entries against the shared internal ledger feed. Click any row for full statement line audit.
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
                  <tr
                    key={line.id}
                    onClick={() => setSelectedStatementLine(line)}
                    className="hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="p-3">
                      <p className="font-bold text-foreground font-mono hover:underline">{line.id}</p>
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
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {line.status !== "reconciled" && (
                          <Button
                            size="sm"
                            disabled={!actingOfficerCapability.canValidate}
                            title={!actingOfficerCapability.canValidate ? `${actorName} lacks Validate authority` : undefined}
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

      {/* Statement Detail Modal Overlay */}
      {selectedStatementLine && (
        <StatementDetailModal
          line={selectedStatementLine}
          onClose={() => setSelectedStatementLine(null)}
          onReconcile={handleReconcile}
          onBindMatch={setMatchModalLine}
        />
      )}

      {/* Manual Match Finder Modal */}
      {matchModalLine && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-md min-w-[50vw] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                <Button
                  type="submit"
                  disabled={!actingOfficerCapability.canValidate}
                  title={!actingOfficerCapability.canValidate ? `${actorName} lacks Validate authority` : undefined}
                  className="h-8 text-xs bg-primary font-bold"
                >
                  Bind & Reconcile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
      )}

      {/* Internal Transfer Modal — moving money between Zowasel's OWN
          accounts, distinct from reconciling against an external statement.
          Continental/Global only: cross-entity movement is a heavier
          operation than routine approval, not another maker-checker tier. */}
      {transferOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-md min-w-[50vw] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Transfer Between Accounts</h2>
              </div>
              <button
                onClick={() => setTransferOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-muted-foreground mb-1">From Account *</label>
                <Select value={transferFromId} onValueChange={(value) => setTransferFromId(value ?? "")}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select source account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.accountName} ({formatNative(a.nativeBalance, a.currencySymbol)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">To Account *</label>
                <Select value={transferToId} onValueChange={(value) => setTransferToId(value ?? "")}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select destination account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.id !== transferFromId).map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">
                  Amount ({accounts.find((a) => a.id === transferFromId)?.currencyCode ?? "native currency"}) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 font-mono font-bold text-foreground focus:outline-none"
                />
                {transferFromId && transferToId && accounts.find((a) => a.id === transferFromId)?.currencyCode !==
                  accounts.find((a) => a.id === transferToId)?.currencyCode && (
                  <p className="mt-1 text-[11px] text-muted-foreground italic">
                    Converted at the live FX rate on transfer — destination currency differs.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => setTransferOpen(false)} className="h-8 text-xs font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-primary font-bold">
                  Confirm Transfer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" />
        <span>
          Reconciliation checks amount + status against the shared Platform Ledger feed — the same
          data shown on the Platform Ledger &amp; Outflows page.
        </span>
      </div>
    </div>
  );
}
