import TransactionsListView from "@/features/billing/components/TransactionsListView";

export default function DisputedTransactionsPage() {
  return (
    <TransactionsListView
      title="Disputed Transactions"
      description="Transactions escalated for review."
      statusFilter="disputed"
    />
  );
}
