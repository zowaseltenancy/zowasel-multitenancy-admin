import TransactionsListView from "@/features/billing/components/TransactionsListView";

export default function PendingTransactionsPage() {
  return (
    <TransactionsListView
      title="Pending Transactions"
      description="Transactions still awaiting confirmation."
      statusFilter="Pending"
    />
  );
}
