import KybReviewListView from "@/features/organization/components/KybReviewListView";

export default function PendingKybPage() {
  return (
    <KybReviewListView
      title="Pending KYB"
      description="Submissions awaiting a decision, oldest first."
      defaultFilter="pending"
    />
  );
}
