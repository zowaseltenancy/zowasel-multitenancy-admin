import InvoicesListView from "@/features/billing/components/InvoicesListView";

export default function AllInvoicesPage() {
  return (
    <InvoicesListView
      title="All Invoices"
      description="Every billing document issued to tenants."
      statusFilter="all"
    />
  );
}
