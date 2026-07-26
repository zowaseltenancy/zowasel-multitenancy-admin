import { DisputeNotifyTarget } from "@/types/transaction";

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

  reminderDaysBeforeDue: number;

  defaultEscalationTarget: DisputeNotifyTarget;

  webhookUrl: string;
}
