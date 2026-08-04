"use client";

import NotificationsListView from "@/features/notifications/components/NotificationsListView";

export default function KybNotificationsPage() {
  return (
    <NotificationsListView
      title="KYB Status Notifications"
      description="Submissions, approvals, rejections, and re-verification requests across all organizations."
      categoryFilter="kyb"
    />
  );
}
