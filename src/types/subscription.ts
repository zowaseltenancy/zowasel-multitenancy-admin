export type SubscriptionStatus =
  | "Active"
  | "Trial"
  | "Past Due"
  | "Cancelled";

export type BillingCycle =
  | "Monthly"
  | "Quarterly"
  | "Yearly";

export interface Subscription {
  id: string;

  organization: string;

  product: string;

  amount: number;

  currency: string;

  billingCycle: BillingCycle;

  status: SubscriptionStatus;

  autoRenew: boolean;

  startedAt: string;

  nextRenewal: string;
}