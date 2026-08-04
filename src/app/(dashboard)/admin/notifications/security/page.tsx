"use client";

import NotificationsListView from "@/features/notifications/components/NotificationsListView";

export default function SecurityNotificationsPage() {
  return (
    <NotificationsListView
      title="Password & Security Notifications"
      description="Password changes, failed login attempts, and new device sign-ins across staff and tenant accounts."
      categoryFilter="security"
    />
  );
}
