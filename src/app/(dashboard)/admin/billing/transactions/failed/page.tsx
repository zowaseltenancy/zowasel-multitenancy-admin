import TransactionsListView from "@/features/billing/components/TransactionsListView";

export default function FailedTransactionsPage() {
  return (
    <TransactionsListView
      title="Failed Transactions"
      description="Transactions that didn't go through."
      statusFilter="Failed"
    />
  );
}
