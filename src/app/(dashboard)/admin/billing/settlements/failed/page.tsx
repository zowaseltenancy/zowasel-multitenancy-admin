import SettlementsListView from "@/features/billing/components/SettlementsListView";

export default function FailedSettlementsPage() {
  return (
    <SettlementsListView
      title="Failed Settlements"
      description="Payouts that failed and need to be retried."
      statusFilter="Failed"
    />
  );
}
