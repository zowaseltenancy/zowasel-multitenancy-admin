"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  PlusCircle,
  Search,
  Filter,
  Clock,
  Upload,
  X,
  Download,
  ThumbsUp,
  ThumbsDown,
  ArrowUpCircle,
  Receipt as ReceiptIcon,
  FileSpreadsheet,
  Calendar,
  Eye,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExportMenu from "@/components/shared/ExportMenu";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import ReceiptView from "@/features/finance-hub/components/ReceiptView";
import TransactionDetailModal from "@/features/finance-hub/components/TransactionDetailModal";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { convertToUSD, currencySymbolFor, formatUSD } from "@/features/finance-hub/utils/currency";
import { LEDGER_CATEGORY_LABELS, LEDGER_STATUS_TONE } from "@/constants/finance";
import { statusBadgeClass } from "@/lib/statusTone";
import { LedgerCategory, LedgerTransaction } from "@/types/finance";
import { buildBulkSampleCsv, parseBulkLedgerCsv } from "@/features/finance-hub/utils/statementParsers";

const CURRENCY_OPTIONS = ["NGN", "KES", "TZS", "GHS", "USD"];
const COUNTRY_OPTIONS = [
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "TZ", name: "Tanzania" },
];

const NEXT_LEVEL_LABEL: Record<string, string> = {
  country: "Regional Finance Manager",
  sub_region: "Continental Finance Director",
  continent: "Chief Financial Officer",
};

export default function PlatformLedgerPage() {
  const { transactions, addOfflineTransaction, approveTransaction, rejectTransaction } = useLedgerTransactions();
  const { actingOfficer, canApprove, approvalThresholdUSD } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();
  const actorName = `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position})`;

  const [activeTab, setActiveTab] = useState<string>("ledger");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [channelFilter, setChannelFilter] = useState<string>("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [minAmountUSD, setMinAmountUSD] = useState<string>("");
  const [maxAmountUSD, setMaxAmountUSD] = useState<string>("");

  const pendingApprovalsCount = transactions.filter((t) => t.status === "Pending Approval" || t.status === "Pending").length;

  const ledgerPills = [
    { id: "ledger", label: "All Transactions Audit", icon: Search, badge: transactions.length },
    { id: "pending", label: "Pending Approvals Queue", icon: Clock, badge: pendingApprovalsCount },
    { id: "analytics", label: "Outflow Expense Analytics", icon: Filter },
    { id: "offline_voucher", label: "Manual Voucher & Bulk Import", icon: PlusCircle },
  ];

  const [showRecorderModal, setShowRecorderModal] = useState(false);
  const [recorderTab, setRecorderTab] = useState<"single" | "bulk">("single");

  const [receiptTransaction, setReceiptTransaction] = useState<LedgerTransaction | null>(null);
  const [selectedAuditTransaction, setSelectedAuditTransaction] = useState<LedgerTransaction | null>(null);

  // Single-entry form state
  const [formAccountName, setFormAccountName] = useState("");
  const [formCategory, setFormCategory] = useState<LedgerCategory>("Platform Fee");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("NGN");
  const [formCountryCode, setFormCountryCode] = useState("NG");
  const [formType, setFormType] = useState<"credit" | "debit">("credit");
  const [formMethod, setFormMethod] = useState("Bank Transfer");
  const [formReference, setFormReference] = useState("");
  const [formReceiptFile, setFormReceiptFile] = useState<File | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchesChannel = channelFilter === "All" || t.channel === channelFilter;
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;

    const usdVal = convertToUSD(t.amount, t.currencyCode);
    const matchesMinAmount = !minAmountUSD || usdVal >= parseFloat(minAmountUSD);
    const matchesMaxAmount = !maxAmountUSD || usdVal <= parseFloat(maxAmountUSD);

    const tTime = new Date(t.date).getTime();
    const matchesStartDate = !startDate || tTime >= new Date(startDate).getTime();
    const matchesEndDate = !endDate || tTime <= new Date(endDate).getTime() + 86400000;

    return matchesSearch && matchesCategory && matchesChannel && matchesStatus && matchesMinAmount && matchesMaxAmount && matchesStartDate && matchesEndDate;
  });

  const handleRecordOfflineTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccountName || !formAmount) return;

    const entry = addOfflineTransaction({
      accountName: formAccountName,
      category: formCategory,
      amount: parseFloat(formAmount),
      currencyCode: formCurrency,
      countryCode: formCountryCode,
      type: formType,
      method: formMethod,
      reference: formReference || `MANUAL-${Date.now().toString().slice(-6)}`,
      receiptFileName: formReceiptFile?.name,
      recordedBy: actorName,
    });

    logAction(actorName, "Recorded offline transaction", entry.id, "Awaiting approval", formCountryCode);
    toast.success(`${entry.id} recorded — pending approval before it clears the ledger.`);
    setShowRecorderModal(false);

    setFormAccountName("");
    setFormAmount("");
    setFormReference("");
    setFormReceiptFile(null);
  };

  const handleBulkFileSelected = async (file: File) => {
    const text = await file.text();
    const rows = parseBulkLedgerCsv(text);

    if (rows.length === 0) {
      toast.error("No valid rows found in that CSV — check the template columns.");
      return;
    }

    rows.forEach((row) => {
      addOfflineTransaction({
        accountName: row.accountName,
        category: (row.category as LedgerCategory) || "Platform Fee",
        amount: row.amount,
        currencyCode: row.currencyCode,
        countryCode: row.countryCode,
        type: row.type,
        method: row.method,
        reference: row.reference || `BULK-${Date.now().toString().slice(-6)}`,
        recordedBy: actorName,
      });
    });

    logAction(actorName, "Bulk-recorded offline transactions", `${rows.length} rows`, "All awaiting approval");
    toast.success(`${rows.length} transactions imported — all pending approval.`);
    setShowRecorderModal(false);
  };

  const handleDownloadBulkTemplate = () => {
    const blob = new Blob([buildBulkSampleCsv()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Bulk_Transaction_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApprove = (t: LedgerTransaction) => {
    approveTransaction(t.id, actorName);
    logAction(actorName, "Approved offline transaction", t.id, undefined, t.countryCode);
    toast.success(`${t.id} approved and posted to the ledger.`);
  };

  const handleReject = (t: LedgerTransaction) => {
    rejectTransaction(t.id, actorName);
    logAction(actorName, "Rejected offline transaction", t.id, undefined, t.countryCode);
    toast.info(`${t.id} rejected.`);
  };

  const exportColumns = [
    { header: "Txn ID", accessor: "id" as const },
    { header: "Date", accessor: (t: LedgerTransaction) => new Date(t.date).toLocaleDateString() },
    { header: "Account Name", accessor: "accountName" as const },
    { header: "Category", accessor: "category" as const },
    { header: "Channel", accessor: "channel" as const },
    { header: "Method", accessor: "method" as const },
    { header: "Reference", accessor: "reference" as const },
    { header: "Type", accessor: (t: LedgerTransaction) => t.type.toUpperCase() },
    { header: "Amount", accessor: (t: LedgerTransaction) => `${t.currencyCode} ${t.amount}` },
    { header: "Status", accessor: "status" as const },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Platform Ledger & Outflows</h1>
            <PageHeaderInfo
              title="Platform Ledger Scope"
              description="The shared ledger feed Master Accounts reconcile against — tenant platform fees, vendor outflows, manual offline transaction entries, bulk CSV ledger uploads, multi-stage approval queues, and PDF receipt downloads."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Menu for PDF / XLSX / CSV */}
          <ExportMenu
            data={filteredTransactions}
            columns={exportColumns}
            filename={`Platform_Ledger_Audit_${new Date().toISOString().split("T")[0]}`}
            targetElementId="platform-ledger-table"
          />

          <Button
            onClick={() => {
              setRecorderTab("single");
              setShowRecorderModal(true);
            }}
            className="bg-primary hover:bg-primary/90 font-bold gap-2 text-xs h-9 shadow-2xs cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Record Offline Transaction
          </Button>
        </div>
      </div>

      {/* Pill Navigation Bar */}
      <SubSectionPillNav items={ledgerPills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 1. All Transactions Audit Tab */}
      {activeTab === "ledger" && (
        <div className="space-y-6">
          {/* Filter and Search Bar with Native Date Range */}
          <Card className="border shadow-2xs">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search account name, ID, reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Date Range & Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <div className="flex items-center gap-1.5 border bg-muted/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-none p-0 text-xs font-semibold focus:outline-none"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent border-none p-0 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Failed">Failed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Refunded">Refunded</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {Object.entries(LEDGER_CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value)}
                    className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="All">All Channels</option>
                    <option value="Online">Online / Automated</option>
                    <option value="Offline / Manual">Offline / Manual</option>
                  </select>

                  <div className="flex items-center gap-1 border bg-muted/30 px-2 py-1.5 rounded-lg text-xs font-semibold">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      placeholder="Min USD"
                      value={minAmountUSD}
                      onChange={(e) => setMinAmountUSD(e.target.value)}
                      className="w-16 bg-transparent border-none p-0 text-xs font-semibold focus:outline-none"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      placeholder="Max USD"
                      value={maxAmountUSD}
                      onChange={(e) => setMaxAmountUSD(e.target.value)}
                      className="w-16 bg-transparent border-none p-0 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Ledger Table */}
      <Card id="platform-ledger-table" className="border shadow-2xs">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Platform Transaction Audit Log</CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredTransactions.length} transaction entries — click any row to view complete audit trail
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md">
              Audit Trail: Live Immutable
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Txn ID & Date</th>
                  <th className="p-3">Account Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Reference Code</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">IAS 21 FX Gain/Loss</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filteredTransactions.map((t) => {
                  const amountUSD = convertToUSD(t.amount, t.currencyCode);
                  const withinThreshold = canApprove(amountUSD);
                  const isSelfSubmission = t.recordedBy === actorName;
                  const nextLevel = NEXT_LEVEL_LABEL[actingOfficer.geographicScopeLevel ?? "country"];
                  const fxGainUSD = t.type === "credit" ? Math.round(amountUSD * 0.02) : -Math.round(amountUSD * 0.01);

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedAuditTransaction(t)}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="p-3 font-mono">
                        <p className="font-bold text-foreground hover:underline">{t.id}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(t.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-foreground">{t.accountName}</p>
                        {t.receiptFileName && (
                          <p className="text-[11px] text-muted-foreground">Receipt: {t.receiptFileName}</p>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground border">
                          {LEDGER_CATEGORY_LABELS[t.category]}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            t.channel === "Offline / Manual"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                          }`}
                        >
                          {t.channel}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-foreground">{t.method}</td>
                      <td className="p-3 font-mono text-muted-foreground text-[11px]">{t.reference}</td>
                      <td className="p-3 font-mono font-bold">
                        <span className={t.type === "credit" ? "text-emerald-600" : "text-rose-600"}>
                          {t.type === "credit" ? "+" : "-"}
                          {currencySymbolFor(t.currencyCode)}
                          {t.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                            fxGainUSD >= 0
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          }`}
                        >
                          {fxGainUSD >= 0 ? `+${formatUSD(fxGainUSD)}` : formatUSD(fxGainUSD)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={statusBadgeClass(LEDGER_STATUS_TONE[t.status])}>{t.status}</span>
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedAuditTransaction(t)}
                            className="h-7 text-[11px] font-bold gap-1"
                          >
                            <Eye className="h-3 w-3" /> Audit
                          </Button>

                          {t.status === "Pending Approval" &&
                            (isSelfSubmission ? (
                              <span
                                title="Maker-checker: whoever records an entry can't also approve it — a different officer has to."
                                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground border"
                              >
                                Awaiting different officer
                              </span>
                            ) : withinThreshold ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(t)}
                                  className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1"
                                >
                                  <ThumbsUp className="h-3 w-3" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(t)}
                                  className="h-7 text-[11px] font-bold text-rose-600 border-rose-200 gap-1"
                                >
                                  <ThumbsDown className="h-3 w-3" /> Reject
                                </Button>
                              </>
                            ) : (
                              <span
                                title={`${formatUSD(amountUSD)} exceeds approval ceiling`}
                                className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-600 border border-rose-500/20"
                              >
                                <ArrowUpCircle className="h-3 w-3" /> Escalate to {nextLevel}
                              </span>
                            ))}
                          {t.status === "Completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReceiptTransaction(t)}
                              className="h-7 text-[11px] font-bold gap-1"
                            >
                              <ReceiptIcon className="h-3 w-3" /> Receipt
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
      )}

      {/* 2. Pending Approvals Queue Tab */}
      {activeTab === "pending" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending Approvals Queue
            </CardTitle>
            <CardDescription className="text-xs">
              Transactions requiring authorization based on officer level, threshold limits, and maker-checker rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.filter((t) => t.status === "Pending Approval" || t.status === "Pending").length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground font-semibold">
                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                No transactions currently awaiting approval.
              </div>
            ) : (
              <div className="space-y-3">
                {transactions
                  .filter((t) => t.status === "Pending Approval" || t.status === "Pending")
                  .map((t) => {
                    const usdVal = convertToUSD(t.amount, t.currencyCode);
                    const isSelf = t.recordedBy === actorName;
                    const withinCeiling = canApprove(usdVal);

                    return (
                      <div key={t.id} className="p-4 border rounded-xl bg-card flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm">{t.accountName}</span>
                            <span className="text-xs font-mono font-bold text-muted-foreground">{t.id}</span>
                            <span className={statusBadgeClass(LEDGER_STATUS_TONE[t.status])}>{t.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Category: <span className="font-bold text-foreground">{LEDGER_CATEGORY_LABELS[t.category]}</span> &bull;
                            Recorded by: <span className="font-bold text-foreground">{t.recordedBy}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-extrabold font-mono text-rose-600">
                              -{currencySymbolFor(t.currencyCode)}{t.amount.toLocaleString()}
                            </p>
                            <p className="text-[11px] font-mono text-muted-foreground">({formatUSD(usdVal)})</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelf ? (
                              <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-md border">
                                Self-submission blocked
                              </span>
                            ) : withinCeiling ? (
                              <>
                                <Button size="sm" onClick={() => handleApprove(t)} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 font-bold">
                                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleReject(t)} className="h-8 text-xs text-rose-600 border-rose-200 font-bold">
                                  <ThumbsDown className="h-3.5 w-3.5 mr-1" /> Reject
                                </Button>
                              </>
                            ) : (
                              <span className="text-[11px] font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                                Exceeds threshold
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 3. Outflow Expense Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Ledger Category Distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Transaction count and monetary volume by ledger accounting category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-semibold">
              {Object.entries(LEDGER_CATEGORY_LABELS).map(([catKey, label]) => {
                const catTxns = transactions.filter((t) => t.category === catKey);
                const catUsd = catTxns.reduce((s, t) => s + convertToUSD(t.amount, t.currencyCode), 0);
                return (
                  <div key={catKey} className="p-3 border rounded-xl bg-card space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span>{label}</span>
                      <span className="font-mono text-primary">{formatUSD(catUsd)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{catTxns.length} total entries recorded</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-emerald-600" />
                Payment Channels & Payment Methods
              </CardTitle>
              <CardDescription className="text-xs">
                Volume processing comparison across automated online gateways vs manual offline vouchers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              {["Online", "Offline / Manual"].map((channel) => {
                const chTxns = transactions.filter((t) => t.channel === channel);
                const chUsd = chTxns.reduce((s, t) => s + convertToUSD(t.amount, t.currencyCode), 0);
                return (
                  <div key={channel} className="p-4 border rounded-xl bg-card space-y-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-sm">{channel} Channel</span>
                      <span className="font-mono text-emerald-600 text-base">{formatUSD(chUsd)}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{chTxns.length} transactions processed via {channel}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4. Manual Voucher & Bulk Import Tab */}
      {activeTab === "offline_voucher" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Record Offline Transaction & Bulk Ledger Import
              </span>
              <Button onClick={handleDownloadBulkTemplate} variant="outline" size="sm" className="text-xs font-bold gap-1">
                <Download className="h-3.5 w-3.5 text-primary" /> Download CSV Template
              </Button>
            </CardTitle>
            <CardDescription className="text-xs">
              Record manual cash vouchers, cheque receipts, or bulk upload bank CSV files directly to the platform ledger.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 border border-dashed rounded-2xl bg-card hover:bg-muted/30 transition-all text-center space-y-3">
              <Upload className="h-10 w-10 mx-auto text-primary" />
              <div>
                <h4 className="text-sm font-extrabold text-foreground">Drag & Drop Bulk CSV Ledger File</h4>
                <p className="text-xs text-muted-foreground">Or click below to record a single offline transaction entry</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  onClick={() => {
                    setRecorderTab("single");
                    setShowRecorderModal(true);
                  }}
                  className="text-xs font-bold h-9 bg-primary"
                >
                  Record Single Voucher
                </Button>
                <Button
                  onClick={() => {
                    setRecorderTab("bulk");
                    setShowRecorderModal(true);
                  }}
                  variant="outline"
                  className="text-xs font-bold h-9"
                >
                  Bulk Upload CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Audit Detail Modal Overlay */}
      {selectedAuditTransaction && (
        <TransactionDetailModal
          transaction={selectedAuditTransaction}
          onClose={() => setSelectedAuditTransaction(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          canApprove={canApprove(convertToUSD(selectedAuditTransaction.amount, selectedAuditTransaction.currencyCode))}
          isSelfSubmission={selectedAuditTransaction.recordedBy === actorName}
        />
      )}

      {/* Receipt Modal */}
      {receiptTransaction && (
        <ReceiptView transaction={receiptTransaction} onClose={() => setReceiptTransaction(null)} />
      )}

      {/* Offline Transaction Recorder Modal */}
      {showRecorderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg min-w-[50vw] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Record Offline Transaction</h2>
              </div>
              <button
                onClick={() => setShowRecorderModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex border-b">
              {(["single", "bulk"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRecorderTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
                    recorderTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "single" ? "Single Entry" : "Bulk Import (CSV)"}
                </button>
              ))}
            </div>

            {recorderTab === "single" ? (
              <form onSubmit={handleRecordOfflineTransaction} className="p-5 space-y-4 text-xs font-semibold">
                <div className="p-2.5 rounded-lg border bg-amber-500/10 border-amber-500/20 text-amber-600 text-[11px] font-bold flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Offline entries post as &ldquo;Pending Approval&rdquo; and need a second admin to approve.</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Transaction Flow Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as "credit" | "debit")}
                      className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                    >
                      <option value="credit">Credit (Incoming Revenue)</option>
                      <option value="debit">Debit (Outgoing Expense)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as LedgerCategory)}
                      className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                    >
                      {Object.entries(LEDGER_CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Payer / Payee Account Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Northline Farmers Cooperative Union"
                    value={formAccountName}
                    onChange={(e) => setFormAccountName(e.target.value)}
                    className="w-full rounded-lg border bg-background p-2 text-foreground focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Country</label>
                    <select
                      value={formCountryCode}
                      onChange={(e) => setFormCountryCode(e.target.value)}
                      className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-1">Currency</label>
                    <select
                      value={formCurrency}
                      onChange={(e) => setFormCurrency(e.target.value)}
                      className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                    >
                      {CURRENCY_OPTIONS.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-1">Amount *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1500000"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="w-full rounded-lg border bg-background p-2 text-foreground focus:outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Payment Method</label>
                    <select
                      value={formMethod}
                      onChange={(e) => setFormMethod(e.target.value)}
                      className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash / POS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-1">Reference Code / Cheque No.</label>
                    <input
                      type="text"
                      placeholder="e.g. CHQ-001928"
                      value={formReference}
                      onChange={(e) => setFormReference(e.target.value)}
                      className="w-full rounded-lg border bg-background p-2 text-foreground font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Receipt File Attachment */}
                <input
                  ref={receiptInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFormReceiptFile(file);
                    e.target.value = "";
                  }}
                />
                <div
                  onClick={() => receiptInputRef.current?.click()}
                  className="p-3 border border-dashed rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors text-center cursor-pointer"
                >
                  {formReceiptFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>
                        Attached: {formReceiptFile.name} ({(formReceiptFile.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                      <p className="text-[11px] font-bold text-foreground">Attach Payment Receipt / Cheque Copy</p>
                      <p className="text-[10px] text-muted-foreground">Click to upload scan (PDF, PNG, JPG up to 10MB)</p>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRecorderModal(false)}
                    className="h-8 text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="h-8 text-xs bg-primary font-bold">
                    Submit for Approval
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-5 space-y-4 text-xs font-semibold">
                <div className="p-2.5 rounded-lg border bg-amber-500/10 border-amber-500/20 text-amber-600 text-[11px] font-bold flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Every row lands as its own &ldquo;Pending Approval&rdquo; entry — same maker-checker rule as single entry.</span>
                </div>

                <p className="text-muted-foreground">
                  For batches of cheques or cash receipts from field agents — download the template,
                  fill in one row per transaction, and upload.{" "}
                  <button type="button" onClick={handleDownloadBulkTemplate} className="font-bold text-primary underline">
                    Download CSV template
                  </button>
                </p>

                <input
                  ref={bulkInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBulkFileSelected(file);
                    e.target.value = "";
                  }}
                />
                <div
                  onClick={() => bulkInputRef.current?.click()}
                  className="p-6 border border-dashed rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-center cursor-pointer flex flex-col items-center gap-2"
                >
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                  <p className="font-bold text-foreground">Upload Bulk Transaction CSV</p>
                  <p className="text-[11px] text-muted-foreground">AccountName, Category, Amount, Currency, CountryCode, Type, Method, Reference</p>
                </div>

                <div className="flex items-center justify-end pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowRecorderModal(false)} className="h-8 text-xs font-bold">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
