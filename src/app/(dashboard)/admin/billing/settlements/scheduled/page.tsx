import SettlementsListView from "@/features/billing/components/SettlementsListView";

export default function ScheduledSettlementsPage() {
  return (
    <SettlementsListView
      title="Scheduled Settlements"
      description="Payouts queued for a future disbursement date."
      statusFilter="Scheduled"
    />
  );
}
