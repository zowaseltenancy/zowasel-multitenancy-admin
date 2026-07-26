import InvoicesListView from "@/features/billing/components/InvoicesListView";

export default function VoidInvoicesPage() {
  return (
    <InvoicesListView
      title="Void Invoices"
      description="Invoices that were cancelled and are no longer collectible."
      statusFilter="Void"
    />
  );
}
