import KybReviewListView from "@/features/organization/components/KybReviewListView";

export default function ApprovedKybPage() {
  return (
    <KybReviewListView
      title="Approved KYB"
      description="Businesses that have passed verification."
      defaultFilter="approved"
    />
  );
}
