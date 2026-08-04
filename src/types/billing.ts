export type PaymentTerms =
  | "net_15"
  | "net_30"
  | "net_60";

export interface BillingSettings {
  defaultCurrency: string;

  invoicePrefix: string;

  paymentTerms: PaymentTerms;

  taxRatePercentage: number;

  taxRegistrationNumber: string;

  reminderRatePerHour: number;

  // Day offsets before the due date on which a reminder email fires, e.g.
  // [14, 7, 3] triggers reminders 14, 7, and 3 days before expiry.
  reminderScheduleDays: number[];

  webhookUrl: string;
}
