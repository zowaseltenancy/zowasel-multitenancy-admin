import InvoicesListView from "@/features/billing/components/InvoicesListView";

export default function PaidInvoicesPage() {
  return (
    <InvoicesListView
      title="Paid Invoices"
      description="Invoices that have been fully settled."
      statusFilter="Paid"
    />
  );
}
