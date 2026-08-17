"use client";

import { Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEDGER_CATEGORY_LABELS } from "@/constants/finance";
import { currencySymbolFor } from "../utils/currency";
import { LedgerTransaction } from "@/types/finance";

interface Props {
  transaction: LedgerTransaction;
  onClose: () => void;
}

// Generates a receipt in-app (print-to-PDF via the browser) rather than
// pulling in a PDF dependency at midnight — Mercury/QuickBooks both do
// exactly this for on-demand receipts.
export default function ReceiptView({ transaction, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:bg-white print:p-0">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print-area, #receipt-print-area * { visibility: visible; }
          #receipt-print-area { position: fixed; inset: 0; margin: 0; box-shadow: none; border: none; }
        }
      `}</style>

      <div
        id="receipt-print-area"
        className="bg-card border rounded-xl shadow-2xl w-full max-w-md min-w-[50vw] overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:rounded-none print:shadow-none print:min-w-0"
      >
        <div className="flex items-center justify-between p-5 border-b bg-muted/30 print:hidden">
          <h2 className="text-base font-bold text-foreground">Transaction Receipt</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm">
          <div className="flex flex-col items-center gap-2 border-b pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- print-context asset, next/image adds no value here */}
            <img src="/zowasel-logo-grey.png" alt="Zowasel" className="h-8 w-auto" />
            <p className="text-lg font-extrabold text-foreground">Zowasel Technologies</p>
            <p className="text-xs text-muted-foreground">Official Transaction Receipt</p>
          </div>

          <div className="space-y-2">
            {[
              ["Receipt Ref", transaction.id],
              ["Date", new Date(transaction.date).toLocaleString()],
              ["Payer / Payee", transaction.accountName],
              ["Category", LEDGER_CATEGORY_LABELS[transaction.category]],
              ["Payment Method", transaction.method],
              ["Reference Code", transaction.reference],
              ["Status", transaction.status],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-semibold">{label}</span>
                <span className="font-bold text-foreground text-right">{value}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">
              {transaction.type === "credit" ? "Amount Received" : "Amount Paid"}
            </span>
            <span className={`text-2xl font-extrabold ${transaction.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}>
              {currencySymbolFor(transaction.currencyCode)}
              {transaction.amount.toLocaleString()}
            </span>
          </div>

          <p className="text-[10px] text-muted-foreground text-center pt-2">
            Generated {new Date().toLocaleString()} — Zowasel Finance Hub
          </p>
        </div>

        <div className="p-4 border-t bg-muted/30 flex justify-end print:hidden">
          <Button onClick={() => window.print()} className="h-9 text-xs font-bold gap-2">
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
