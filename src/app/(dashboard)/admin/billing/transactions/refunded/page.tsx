import TransactionsListView from "@/features/billing/components/TransactionsListView";

export default function RefundedTransactionsPage() {
  return (
    <TransactionsListView
      title="Refunded Transactions"
      description="Transactions that were reversed back to the payer."
      statusFilter="Refunded"
    />
  );
}
