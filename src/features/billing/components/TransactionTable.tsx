"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Eye, CreditCard, Calendar, Building, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Transaction } from "@/types/transaction";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import TransactionStatusBadge from "./TransactionStatusBadge";
import ExportMenu from "@/components/shared/ExportMenu";
import { ExportTable } from "@/lib/export";

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: Props) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  if (transactions.length === 0) {
    return (
      <Card className="flex min-h-[160px] items-center justify-center p-6 text-sm text-muted-foreground bg-card">
        No transactions match this filter.
      </Card>
    );
  }

  const exportTableData: ExportTable | null = selectedTransaction
    ? {
        title: `Transaction Receipt - ${selectedTransaction.reference}`,
        headers: ["Field", "Value"],
        rows: [
          ["Reference", selectedTransaction.reference],
          ["Organization", selectedTransaction.organization],
          ["Entity Type", ORGANIZATION_TYPE_LABELS[selectedTransaction.entityType]],
          ["Amount", `${selectedTransaction.currency} ${selectedTransaction.amount.toLocaleString()}`],
          ["Provider", selectedTransaction.provider],
          ["Payment Method", selectedTransaction.paymentMethod],
          ["Status", selectedTransaction.status],
          ["Transaction Date", new Date(selectedTransaction.createdAt).toLocaleString()],
          ["Disputed", selectedTransaction.disputed ? "Yes" : "No"],
          ["Dispute Reason", selectedTransaction.disputeReason || "None"],
        ],
      }
    : null;

  return (
    <>
      <Card className="overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
              <tr className="text-left">
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Organization</th>
                <th className="px-6 py-4 font-medium">Entity</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Provider</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-muted/40 cursor-pointer"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      {transaction.disputed && (
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      )}

                      {transaction.reference}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold text-foreground">
                    {transaction.organization}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {ORGANIZATION_TYPE_LABELS[transaction.entityType]}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-bold font-mono">
                    {transaction.currency} {transaction.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-xs font-medium">
                    {transaction.provider}
                  </td>

                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {transaction.paymentMethod}
                  </td>

                  <td className="px-6 py-4">
                    <TransactionStatusBadge status={transaction.status} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(transaction);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Drill-down</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RVE-056: In-page Inline Transaction Drill-down Modal with Live Export */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        {selectedTransaction && (
          <DialogContent className="sm:max-w-xl" id="transaction-modal-capture">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <div>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <span>Transaction Details</span>
                    <Badge variant="outline" className="font-mono text-xs bg-muted">
                      {selectedTransaction.reference}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    In-page drill-down audit trail for transaction ID {selectedTransaction.id}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Summary Card */}
              <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Transaction Amount</p>
                  <p className="text-3xl font-extrabold text-foreground mt-1 font-mono">
                    {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
                  </p>
                </div>
                <TransactionStatusBadge status={selectedTransaction.status} />
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1 p-3 rounded-lg border border-border/60 bg-card">
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-primary" /> Organization
                  </span>
                  <p className="font-semibold text-foreground">{selectedTransaction.organization}</p>
                  <p className="text-xs text-muted-foreground">{ORGANIZATION_TYPE_LABELS[selectedTransaction.entityType]}</p>
                </div>

                <div className="space-y-1 p-3 rounded-lg border border-border/60 bg-card">
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-primary" /> Payment Method & Provider
                  </span>
                  <p className="font-semibold text-foreground">{selectedTransaction.provider}</p>
                  <p className="text-xs text-muted-foreground">{selectedTransaction.paymentMethod}</p>
                </div>

                <div className="space-y-1 p-3 rounded-lg border border-border/60 bg-card">
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Timestamp
                  </span>
                  <p className="font-semibold text-foreground">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                </div>

                <div className="space-y-1 p-3 rounded-lg border border-border/60 bg-card">
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Dispute Status
                  </span>
                  <p className={`font-semibold ${selectedTransaction.disputed ? "text-destructive" : "text-emerald-600"}`}>
                    {selectedTransaction.disputed ? "⚠️ Disputed Transaction" : "✓ Clear (No Dispute)"}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                {exportTableData && (
                  <ExportMenu table={exportTableData} captureElementId="transaction-modal-capture" />
                )}
                <Link href={`/admin/billing/transactions/${selectedTransaction.id}`}>
                  <Button variant="outline" size="sm" className="text-xs gap-1 cursor-pointer">
                    <span>Full Audit View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
