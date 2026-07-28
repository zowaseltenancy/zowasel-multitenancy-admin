"use client";

import SubscriptionsListView from "@/features/billing/components/SubscriptionsListView";

export default function TrialSubscriptionsPage() {
  return (
    <SubscriptionsListView
      title="Trial Subscriptions"
      description="View tenant subscriptions currently in trial period."
      statusFilter="Trial"
    />
  );
}
