import InvoicesListView from "@/features/billing/components/InvoicesListView";

export default function PendingInvoicesPage() {
  return (
    <InvoicesListView
      title="Pending Invoices"
      description="Invoices awaiting payment, not yet due."
      statusFilter="Pending"
    />
  );
}
