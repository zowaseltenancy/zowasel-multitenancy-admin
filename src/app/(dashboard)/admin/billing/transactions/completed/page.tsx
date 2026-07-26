import TransactionsListView from "@/features/billing/components/TransactionsListView";

export default function CompletedTransactionsPage() {
  return (
    <TransactionsListView
      title="Completed Transactions"
      description="Transactions that settled successfully."
      statusFilter="Completed"
    />
  );
}
