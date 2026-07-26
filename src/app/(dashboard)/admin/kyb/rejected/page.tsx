import KybReviewListView from "@/features/organization/components/KybReviewListView";

export default function RejectedKybPage() {
  return (
    <KybReviewListView
      title="Rejected KYB"
      description="Submissions that were declined and are awaiting resubmission."
      defaultFilter="rejected"
    />
  );
}
