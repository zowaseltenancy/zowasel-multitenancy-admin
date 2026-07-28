"use client";

import SubscriptionsListView from "@/features/billing/components/SubscriptionsListView";

export default function PastDueSubscriptionsPage() {
  return (
    <SubscriptionsListView
      title="Past Due Subscriptions"
      description="View urgent past-due subscriptions requiring payment action."
      statusFilter="Past Due"
    />
  );
}
