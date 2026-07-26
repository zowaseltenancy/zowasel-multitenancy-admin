import SettlementsListView from "@/features/billing/components/SettlementsListView";

export default function CompletedSettlementsPage() {
  return (
    <SettlementsListView
      title="Completed Settlements"
      description="Payouts that have been successfully disbursed."
      statusFilter="Completed"
    />
  );
}
