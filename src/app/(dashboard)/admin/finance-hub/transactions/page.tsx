"use client";

import { useState } from "react";
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  DollarSign,
  Layers,
  X,
  Download,
  Image as ImageIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";

export interface TransactionRecord {
  id: string;
  date: string;
  accountName: string;
  accountId: string;
  category: "Subscription" | "Platform Fee" | "Operational Outflow" | "Dispute Fee" | "Escrow Settlement";
  channel: "Online" | "Offline / Manual";
  amount: number;
  type: "credit" | "debit";
  method: "Paystack" | "Flutterwave" | "Bank Transfer" | "Cash" | "Cheque";
  status: "Completed" | "Pending" | "Disputed";
  reference: string;
}

const initialTransactions: TransactionRecord[] = [
  {
    id: "TXN-90812",
    date: "2026-08-03 14:22",
    accountName: "Grand Grains Milling Ltd",
    accountId: "ACC-BUY-8819",
    category: "Platform Fee",
    channel: "Online",
    amount: 725000,
    type: "credit",
    method: "Paystack",
    status: "Completed",
    reference: "PSTK-991204812",
  },
  {
    id: "EXP-44091",
    date: "2026-08-03 11:05",
    accountName: "Termii Technologies",
    accountId: "ACC-VENDOR-01",
    category: "Operational Outflow",
    channel: "Online",
    amount: 450000,
    type: "debit",
    method: "Bank Transfer",
    status: "Completed",
    reference: "TRM-SMS-202608",
  },
  {
    id: "TXN-90800",
    date: "2026-08-02 16:45",
    accountName: "Kano Agro Merchants Cooperative",
    accountId: "ACC-COOP-1120",
    category: "Subscription",
    channel: "Offline / Manual",
    amount: 1500000,
    type: "credit",
    method: "Cheque",
    status: "Completed",
    reference: "CHQ-ZENITH-008129",
  },
  {
    id: "EXP-44092",
    date: "2026-08-02 10:15",
    accountName: "Meta WhatsApp Business API",
    accountId: "ACC-VENDOR-02",
    category: "Operational Outflow",
    channel: "Online",
    amount: 820000,
    type: "debit",
    method: "Flutterwave",
    status: "Completed",
    reference: "FLW-META-3391",
  },
  {
    id: "TXN-90795",
    date: "2026-08-01 09:30",
    accountName: "Olam Agri Nigeria",
    accountId: "ACC-BUY-1002",
    category: "Dispute Fee",
    channel: "Offline / Manual",
    amount: 350000,
    type: "credit",
    method: "Bank Transfer",
    status: "Completed",
    reference: "OFF-REF-99210",
  },
];

export default function PlatformTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [channelFilter, setChannelFilter] = useState<string>("All");
  const [showRecorderModal, setShowRecorderModal] = useState(false);

  // New offline transaction form state
  const [formAccountName, setFormAccountName] = useState("");
  const [formAccountId, setFormAccountId] = useState("");
  const [formCategory, setFormCategory] = useState<TransactionRecord["category"]>("Platform Fee");
  const [formAmount, setFormAmount] = useState("");
  const [formType, setFormType] = useState<"credit" | "debit">("credit");
  const [formMethod, setFormMethod] = useState<TransactionRecord["method"]>("Bank Transfer");
  const [formReference, setFormReference] = useState("");
  const [formReceiptFileName, setFormReceiptFileName] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchesChannel = channelFilter === "All" || t.channel === channelFilter;

    return matchesSearch && matchesCategory && matchesChannel;
  });

  const handleSimulateReceiptUpload = () => {
    setFormReceiptFileName("Receipt_Offline_Payment_Scan.pdf");
  };

  const handleRecordOfflineTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccountName || !formAmount) return;

    const newRecord: TransactionRecord = {
      id: `OFF-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      accountName: formAccountName,
      accountId: formAccountId || `ACC-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      category: formCategory,
      channel: "Offline / Manual",
      amount: parseFloat(formAmount),
      type: formType,
      method: formMethod,
      status: "Completed",
      reference: formReference || `MANUAL-${Date.now().toString().slice(-6)}`,
    };

    setTransactions([newRecord, ...transactions]);
    setShowRecorderModal(false);

    // Reset form
    setFormAccountName("");
    setFormAccountId("");
    setFormAmount("");
    setFormReference("");
    setFormReceiptFileName(null);
  };

  const handleExportLedgerCSV = () => {
    const headers = ["Txn ID", "Date", "Account Name", "Account ID", "Category", "Channel", "Method", "Reference", "Type", "Amount (NGN)", "Status"];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      `"${t.accountName}"`,
      t.accountId,
      t.category,
      t.channel,
      t.method,
      t.reference,
      t.type.toUpperCase(),
      t.amount,
      t.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Platform_Ledger_Audit_${new Date().toISOString().split("T")[0]}.csv`);
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
            <h1 className="text-3xl font-bold tracking-tight">Platform Ledger & Outflows</h1>
            <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-bold text-sky-600 border border-sky-500/20">
              Internal Monetary Movement Audit
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Granular audit log of all system subscriptions, platform fee collections, operational API outflows, and manual offline records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportLedgerCSV}
            variant="outline"
            className="h-9 text-xs font-bold gap-2 text-primary border-primary/30"
          >
            <Download className="h-4 w-4" /> Export Ledger CSV
          </Button>

          <Button
            onClick={() => setShowRecorderModal(true)}
            className="bg-primary hover:bg-primary/90 font-bold gap-2 text-xs h-9 shadow-2xs cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Record Offline Transaction
          </Button>
        </div>
      </div>

      {/* Finance Hub Nav */}
      <FinanceHubNav />

      {/* Filter and Search Bar */}
      <Card className="border shadow-2xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search account name, ID, reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                <Filter className="h-3.5 w-3.5" /> Filter:
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Platform Fee">Platform Fee</option>
                <option value="Subscription">Subscription</option>
                <option value="Operational Outflow">Operational Outflow</option>
                <option value="Dispute Fee">Dispute Fee</option>
                <option value="Escrow Settlement">Escrow Settlement</option>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card className="border shadow-2xs">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Platform Transaction Audit Log</CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredTransactions.length} transaction entries
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
                  <th className="p-3">Account Name & ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Reference Code</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono">
                      <p className="font-bold text-foreground">{t.id}</p>
                      <p className="text-[11px] text-muted-foreground">{t.date}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{t.accountName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{t.accountId}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground border">
                        {t.category}
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
                        {t.type === "credit" ? "+" : "-"}₦{t.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Offline Transaction Recorder Modal */}
      {showRecorderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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

            <form onSubmit={handleRecordOfflineTransaction} className="p-5 space-y-4 text-xs font-semibold">
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
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                  >
                    <option value="Platform Fee">Platform Fee</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Operational Outflow">Operational Outflow</option>
                    <option value="Dispute Fee">Dispute Fee</option>
                    <option value="Escrow Settlement">Escrow Settlement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Payer / Payee Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kano Agro Farmers Cooperative"
                  value={formAccountName}
                  onChange={(e) => setFormAccountName(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1">Account ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ACC-COOP-1120"
                    value={formAccountId}
                    onChange={(e) => setFormAccountId(e.target.value)}
                    className="w-full rounded-lg border bg-background p-2 text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Amount (NGN ₦) *</label>
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
                    onChange={(e) => setFormMethod(e.target.value as any)}
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
              <div
                onClick={handleSimulateReceiptUpload}
                className="p-3 border border-dashed rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors text-center cursor-pointer"
              >
                {formReceiptFileName ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Attached: {formReceiptFileName}</span>
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
                  Save to Platform Ledger
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
