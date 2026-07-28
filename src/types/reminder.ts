export type ReminderStatus = "Upcoming" | "Sent" | "Overdue" | "Auto-Renew";

export interface SubscriptionReminder {
  id: string;
  organizationId: string;
  organizationName: string;
  productName: string;
  amount: number;
  currency: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: ReminderStatus;
  contactEmail: string;
  contactPhone: string;
  lastNotifiedAt?: string;
}

export interface ReminderSettings {
  defaultDaysBeforeExpiry: number[];
  autoSendEmail: boolean;
  autoSendSms: boolean;
  adminNotificationEmail: string;
}
