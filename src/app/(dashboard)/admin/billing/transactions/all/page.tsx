import TransactionsListView from "@/features/billing/components/TransactionsListView";

export default function AllTransactionsPage() {
  return (
    <TransactionsListView
      title="All Transactions"
      description="Every transaction across the platform — filter by status, timeframe or entity."
      statusFilter="all"
    />
  );
}
