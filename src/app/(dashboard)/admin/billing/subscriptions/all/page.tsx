"use client";

import SubscriptionsListView from "@/features/billing/components/SubscriptionsListView";

export default function AllSubscriptionsPage() {
  return (
    <SubscriptionsListView
      title="All Subscriptions"
      description="View and filter all tenant product subscriptions across operating regions."
      statusFilter="all"
    />
  );
}
