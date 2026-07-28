"use client";

import SubscriptionsListView from "@/features/billing/components/SubscriptionsListView";

export default function ActiveSubscriptionsPage() {
  return (
    <SubscriptionsListView
      title="Active Subscriptions"
      description="View active tenant subscriptions across all operating regions."
      statusFilter="Active"
    />
  );
}
