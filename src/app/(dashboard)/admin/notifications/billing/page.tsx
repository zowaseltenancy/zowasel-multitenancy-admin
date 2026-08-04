"use client";

import NotificationsListView from "@/features/notifications/components/NotificationsListView";

export default function BillingNotificationsPage() {
  return (
    <NotificationsListView
      title="Billing Notifications"
      description="Invoice payments, overdue alerts, subscription renewals, and settlement failures."
      categoryFilter="billing"
    />
  );
}
