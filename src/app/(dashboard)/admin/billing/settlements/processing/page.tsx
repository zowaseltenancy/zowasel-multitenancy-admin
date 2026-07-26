import SettlementsListView from "@/features/billing/components/SettlementsListView";

export default function ProcessingSettlementsPage() {
  return (
    <SettlementsListView
      title="Processing Settlements"
      description="Payouts currently in flight with the provider."
      statusFilter="Processing"
    />
  );
}
