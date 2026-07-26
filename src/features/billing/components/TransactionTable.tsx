import Link from "next/link";

import { AlertTriangle, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import TransactionStatusBadge from "./TransactionStatusBadge";

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: Props) {
  if (transactions.length === 0) {
    return (
      <Card className="flex min-h-[160px] items-center justify-center p-6 text-sm text-muted-foreground">
        No transactions match this filter.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-muted/50">
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
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b transition-colors hover:bg-muted/40"
              >
                <td className="px-6 py-4 font-medium">
                  <div className="flex items-center gap-2">
                    {transaction.disputed && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}

                    {transaction.reference}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {transaction.organization}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {
                    ORGANIZATION_TYPE_LABELS[
                      transaction.entityType
                    ]
                  }
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.currency}{" "}
                  {transaction.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {transaction.provider}
                </td>

                <td className="px-6 py-4">
                  {transaction.paymentMethod}
                </td>

                <td className="px-6 py-4">
                  <TransactionStatusBadge
                    status={transaction.status}
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(
                    transaction.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/billing/transactions/${transaction.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
                  >
                    View

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
