"use client";

import NotificationsListView from "@/features/notifications/components/NotificationsListView";

export default function ModuleNotificationsPage() {
  return (
    <NotificationsListView
      title="Module Activity Notifications"
      description="Module activations, upgrades, and deactivations across all tenants."
      categoryFilter="module"
    />
  );
}
