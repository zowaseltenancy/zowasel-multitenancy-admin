import { NotificationCategory, NotificationSeverity } from "@/types/notification";
import { StatusTone } from "@/lib/statusTone";

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  kyb: "KYB Status",
  module: "Module Activity",
  security: "Password & Security",
  billing: "Billing",
};

export const NOTIFICATION_SEVERITY_TONE: Record<NotificationSeverity, StatusTone> = {
  info: "info",
  warning: "warning",
  critical: "danger",
};
