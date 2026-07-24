import {
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import TransactionTable from "@/features/billing/components/TransactionTable";
import { mockTransactions } from "@/features/billing/data/mockTransactions";

export default function TransactionsPage() {
  const completed = mockTransactions.filter(
    (transaction) => transaction.status === "Completed"
  ).length;

  const pending = mockTransactions.filter(
    (transaction) => transaction.status === "Pending"
  ).length;

  const failed = mockTransactions.filter(
    (transaction) => transaction.status === "Failed"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Transactions
        </h1>

        <p className="mt-2 text-muted-foreground">
          Monitor and review payment activity across all
          organizations on the platform.
        </p>
      </div>

      {/* Snapshot */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Transactions
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {mockTransactions.length}
              </h2>
            </div>

            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Completed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {completed}
              </h2>
            </div>

            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending
              </p>

              <h2 className="mt-2 text-3xl font-bold text-amber-600">
                {pending}
              </h2>
            </div>

            <Clock3 className="h-8 w-8 text-amber-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Failed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {failed}
              </h2>
            </div>

            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Transactions */}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />

          <h2 className="text-xl font-semibold">
            Recent Transactions
          </h2>
        </div>

        <TransactionTable
          transactions={mockTransactions}
        />
      </div>
    </div>
  );
}