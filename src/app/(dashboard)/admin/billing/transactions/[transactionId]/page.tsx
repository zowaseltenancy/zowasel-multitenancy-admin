import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRightLeft,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import TransactionInfo from "@/features/billing/components/TransactionInfo";
import TransactionStatusBadge from "@/features/billing/components/TransactionStatusBadge";
import { mockTransactions } from "@/features/billing/data/mockTransactions";

interface Props {
  params: Promise<{
    transactionId: string;
  }>;
}

export default async function TransactionDetailsPage({
  params,
}: Props) {
  const { transactionId } = await params;

  const transaction = mockTransactions.find(
    (transaction) =>
      transaction.id === transactionId
  );

  if (!transaction) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/billing/transactions"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Transactions
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            Transaction Details
          </h1>

          <p className="mt-2 text-muted-foreground">
            Review payment information and transaction
            metadata.
          </p>
        </div>

        <Button variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />

          Refresh Status
        </Button>
      </div>

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

        <TransactionInfo
          label="Reference"
          value={transaction.reference}
        />
      </div>

      {/* Next Steps */}

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />

          <div>
            <h3 className="font-semibold">
              Transaction Timeline
            </h3>

            <p className="text-sm text-muted-foreground">
              Timeline events, settlement progress,
              provider responses, webhook logs and audit
              history will appear here in a future
              iteration.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}