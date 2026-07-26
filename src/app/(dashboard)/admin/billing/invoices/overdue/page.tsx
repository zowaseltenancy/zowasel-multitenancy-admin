import InvoicesListView from "@/features/billing/components/InvoicesListView";

export default function OverdueInvoicesPage() {
  return (
    <InvoicesListView
      title="Overdue Invoices"
      description="Invoices past their due date — needs follow-up."
      statusFilter="Overdue"
    />
  );
}
