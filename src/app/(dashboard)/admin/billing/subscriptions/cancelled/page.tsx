"use client";

import SubscriptionsListView from "@/features/billing/components/SubscriptionsListView";

export default function CancelledSubscriptionsPage() {
  return (
    <SubscriptionsListView
      title="Cancelled Subscriptions"
      description="View cancelled tenant subscriptions."
      statusFilter="Cancelled"
    />
  );
}
