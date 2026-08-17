"use client";

import { X, CheckCircle2, Clock, XCircle, FileText, Download, ShieldCheck, Tag, CreditCard, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LedgerTransaction } from "@/types/finance";
import { LEDGER_CATEGORY_LABELS, LEDGER_STATUS_TONE } from "@/constants/finance";
import { statusBadgeClass } from "@/lib/statusTone";
import { currencySymbolFor, formatUSD, convertToUSD } from "@/features/finance-hub/utils/currency";

interface TransactionDetailModalProps {
  transaction: LedgerTransaction;
  onClose: () => void;
  onApprove?: (t: LedgerTransaction) => void;
  onReject?: (t: LedgerTransaction) => void;
  canApprove?: boolean;
  isSelfSubmission?: boolean;
}

export default function TransactionDetailModal({
  transaction,
  onClose,
  onApprove,
  onReject,
  canApprove = true,
  isSelfSubmission = false,
}: TransactionDetailModalProps) {
  const usdVal = convertToUSD(transaction.amount, transaction.currencyCode);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-xl min-w-[50vw] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- print-context asset, next/image adds no value here */}
            <img src="/zowasel-logo-grey.png" alt="Zowasel" className="h-6 w-auto" />
            <div className="flex items-center gap-2 border-l pl-3">
              <Tag className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-base font-extrabold text-foreground">Transaction Audit Detail</h2>
                <p className="text-xs font-mono text-muted-foreground">{transaction.id}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs font-semibold max-h-[80vh] overflow-y-auto">
          {/* Main Amount & Status Banner */}
          <div className="p-4 border rounded-xl bg-muted/20 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Transaction Amount</p>
              <p className={`text-2xl font-black font-mono mt-1 ${transaction.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}>
                {transaction.type === "credit" ? "+" : "-"}
                {currencySymbolFor(transaction.currencyCode)}
                {transaction.amount.toLocaleString()}
                <span className="text-xs font-mono text-muted-foreground ml-2">({formatUSD(usdVal)})</span>
              </p>
            </div>

            <span className={statusBadgeClass(LEDGER_STATUS_TONE[transaction.status])}>
              {transaction.status}
            </span>
          </div>

          {/* Key Properties Grid */}
          <div className="grid grid-cols-2 gap-4 border rounded-xl p-4 bg-card">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Account Name
              </p>
              <p className="font-bold text-foreground mt-1 text-sm">{transaction.accountName}</p>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Entry Date & Time
              </p>
              <p className="font-mono text-foreground mt-1">{new Date(transaction.date).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase">Category</p>
              <p className="font-bold text-foreground mt-1">{LEDGER_CATEGORY_LABELS[transaction.category]}</p>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase">Payment Channel</p>
              <p className="font-bold text-foreground mt-1">{transaction.channel}</p>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" /> Payment Method
              </p>
              <p className="font-medium text-foreground mt-1">{transaction.method}</p>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase">Reference Code</p>
              <p className="font-mono text-foreground mt-1">{transaction.reference}</p>
            </div>
          </div>

          {/* Statutory WHT Tax Breakdown */}
          <div className="border rounded-xl p-4 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-muted-foreground uppercase tracking-wider">Statutory Tax & WHT Breakdown</span>
              <span className="text-amber-600 font-mono">10% Statutory WHT</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="p-2 border rounded-lg bg-card">
                <p className="text-[10px] text-muted-foreground font-sans">Gross Amount</p>
                <p className="font-bold text-foreground">{formatUSD(usdVal)}</p>
              </div>
              <div className="p-2 border rounded-lg bg-card">
                <p className="text-[10px] text-rose-600 font-sans font-bold">WHT Deducted (10%)</p>
                <p className="font-bold text-rose-600">-{formatUSD(usdVal * 0.1)}</p>
              </div>
              <div className="p-2 border rounded-lg bg-card">
                <p className="text-[10px] text-emerald-600 font-sans font-bold">Net Disbursed</p>
                <p className="font-bold text-emerald-600">{formatUSD(usdVal * 0.9)}</p>
              </div>
            </div>
          </div>

          {/* IAS 21 Realized FX Gain / Loss Accounting */}
          <div className="border rounded-xl p-4 bg-sky-500/5 border-sky-500/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-sky-600 uppercase tracking-wider">IAS 21 Realized FX Accounting</span>
              <span className="text-emerald-600 font-mono font-extrabold">+₦450,000 Realized Gain</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="p-2 border rounded-lg bg-card">
                <p className="text-[10px] text-muted-foreground font-sans">Booking Spot Rate</p>
                <p className="font-bold text-foreground">1,520 NGN/$</p>
              </div>
              <div className="p-2 border rounded-lg bg-card">
                <p className="text-[10px] text-muted-foreground font-sans">Settlement Spot Rate</p>
                <p className="font-bold text-foreground">1,550 NGN/$</p>
              </div>
              <div className="p-2 border rounded-lg bg-card">
                <p className="text-[10px] text-emerald-600 font-sans font-bold">Realized FX Variance</p>
                <p className="font-bold text-emerald-600">+2.0% Gain</p>
              </div>
            </div>
          </div>

          {/* Audit Trail & Authorizer Breakdown */}
          <div className="border rounded-xl p-4 bg-muted/20 space-y-3">
            <h4 className="text-xs font-bold flex items-center gap-1.5 text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              4-Level Audit & Verification Lineage
            </h4>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Recorded / Initiated By:</span>
                <span className="font-bold text-foreground">{transaction.recordedBy || "Automated Gateway Engine"}</span>
              </div>

              {transaction.approvedBy && (
                <div className="flex items-center justify-between border-b pb-1.5 text-emerald-600">
                  <span>Approved / Authorized By:</span>
                  <span className="font-bold">{transaction.approvedBy}</span>
                </div>
              )}

              {transaction.receiptFileName && (
                <div className="flex items-center justify-between pt-1 text-sky-600">
                  <span>Attached Proof / Receipt Scan:</span>
                  <span className="font-mono font-bold flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> {transaction.receiptFileName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs font-bold">
            Close
          </Button>

          {transaction.status === "Pending Approval" && onApprove && onReject && (
            <div className="flex items-center gap-2">
              {isSelfSubmission ? (
                <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-md border">
                  Cannot self-approve (Maker-checker rule)
                </span>
              ) : canApprove ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      onReject(transaction);
                      onClose();
                    }}
                    variant="outline"
                    className="h-8 text-xs font-bold text-rose-600 border-rose-200"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      onApprove(transaction);
                      onClose();
                    }}
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Approve & Clear
                  </Button>
                </>
              ) : (
                <span className="text-xs font-bold text-rose-600 bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/20">
                  Exceeds approval ceiling
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
