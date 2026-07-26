import SettlementsListView from "@/features/billing/components/SettlementsListView";

export default function AllSettlementsPage() {
  return (
    <SettlementsListView
      title="All Settlements"
      description="Every payout disbursed or scheduled for the platform's sellers."
      statusFilter="all"
    />
  );
}
