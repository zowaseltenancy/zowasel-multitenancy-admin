"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRightLeft,
  RefreshCcw,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import TransactionInfo from "@/features/billing/components/TransactionInfo";
import TransactionStatusBadge from "@/features/billing/components/TransactionStatusBadge";
import DisputeTransactionDialog from "@/features/billing/components/DisputeTransactionDialog";
import ExportMenu from "@/components/shared/ExportMenu";
import { useTransactions } from "@/features/billing/hooks/useTransactions";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { DISPUTE_NOTIFY_TARGET_LABELS, getNextEscalationStage } from "@/constants/transaction";
import { ExportTable } from "@/lib/export";

interface Props {
  params: Promise<{
    transactionId: string;
  }>;
}

export default function TransactionDetailsPage({
  params,
}: Props) {
  const { transactionId } = use(params);

  const { transactions, raiseDispute, escalateToNextStage } = useTransactions();

  const [disputeOpen, setDisputeOpen] = useState(false);

  const transaction = transactions.find(
    (item) => item.id === transactionId
  );

  if (!transaction) {
    notFound();
  }

  const nextStage = transaction.disputeNotifyTarget
    ? getNextEscalationStage(transaction.disputeNotifyTarget)
    : null;

  const exportTableData: ExportTable = {
    title: `Transaction Record - ${transaction.reference}`,
    headers: ["Field", "Value"],
    rows: [
      ["Reference", transaction.reference],
      ["Organization", transaction.organization],
      ["Entity Type", ORGANIZATION_TYPE_LABELS[transaction.entityType]],
      ["Amount", `${transaction.currency} ${transaction.amount.toLocaleString()}`],
      ["Provider", transaction.provider],
      ["Payment Method", transaction.paymentMethod],
      ["Status", transaction.status],
      ["Transaction Date", new Date(transaction.createdAt).toLocaleString()],
      ["Disputed", transaction.disputed ? "Yes" : "No"],
      ["Dispute Reason", transaction.disputeReason || "None"],
    ],
  };

  return (
    <div className="space-y-8" id="transaction-detail-capture">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/billing/transactions/all"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            Transaction Details
          </h1>

          <p className="mt-2 text-muted-foreground">
            Review payment information, gateway metadata, and export individual records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Individual Record Export Menu */}
          <ExportMenu
            table={exportTableData}
            captureElementId="transaction-detail-capture"
          />

          <Button variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>

          {!transaction.disputed && (
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setDisputeOpen(true)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Escalate
            </Button>
          )}

          {transaction.disputed && nextStage && (
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => {
                escalateToNextStage(transaction.id);
                toast.success(
                  `${transaction.reference} escalated to ${DISPUTE_NOTIFY_TARGET_LABELS[nextStage]}.`
                );
              }}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Escalate Further
            </Button>
          )}
        </div>
      </div>

      {/* Dispute banner */}
      {transaction.disputed && (
        <Card className="border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />

            <div>
              <p className="font-medium text-destructive">
                This transaction has been escalated
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {transaction.disputeReason}
              </p>

              {transaction.disputeNotifyTarget && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Currently with:{" "}
                  <span className="font-semibold text-foreground">
                    {DISPUTE_NOTIFY_TARGET_LABELS[transaction.disputeNotifyTarget]}
                  </span>
                  {!nextStage && " (final stage)"}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Summary */}
      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Reference
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {transaction.reference}
            </h2>
          </div>

          <TransactionStatusBadge
            status={transaction.status}
          />
        </div>
      </Card>

      {/* Information */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TransactionInfo
          label="Organization"
          value={transaction.organization}
        />

        <TransactionInfo
          label="Entity Type"
          value={
            ORGANIZATION_TYPE_LABELS[
              transaction.entityType
            ]
          }
        />

        <TransactionInfo
          label="Amount"
          value={`${transaction.currency} ${transaction.amount.toLocaleString()}`}
        />

        <TransactionInfo
          label="Provider"
          value={transaction.provider}
        />

        <TransactionInfo
          label="Payment Method"
          value={transaction.paymentMethod}
        />

        <TransactionInfo
          label="Transaction Date"
          value={new Date(
            transaction.createdAt
          ).toLocaleString()}
        />
      </div>

      {/* Next Steps */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />

          <div>
            <h3 className="font-semibold">
              Transaction Timeline & Audit Trail
            </h3>

            <p className="text-sm text-muted-foreground">
              Timeline events, settlement progress, provider responses, webhook logs and audit history are recorded for this transaction.
            </p>
          </div>
        </div>
      </Card>

      <DisputeTransactionDialog
        open={disputeOpen}
        reference={transaction.reference}
        onClose={() => setDisputeOpen(false)}
        onConfirm={(reason) => {
          raiseDispute(transaction.id, reason);

          toast.success(
            `${transaction.reference} has been escalated to the operations team.`
          );

          setDisputeOpen(false);
        }}
      />
    </div>
  );
}
