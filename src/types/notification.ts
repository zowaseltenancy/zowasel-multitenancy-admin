export type NotificationCategory = "kyb" | "module" | "security" | "billing";

export type NotificationSeverity = "info" | "warning" | "critical";

export interface PlatformNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  severity: NotificationSeverity;
  organizationId?: string;
  organizationName?: string;
  actorName?: string;
  isRead: boolean;
  createdAt: string;
}
