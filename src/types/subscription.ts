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

  // Real reference into the Modules Plan catalog — the historical billed
  // `amount` above can still legitimately differ per negotiated deal, but
  // `tier` itself must always name a real ModulePlan.id, not a free-floating
  // label. "we retrofit subscriptions to point to an actual plan... the mask
  // cannot slip" — Busayo, Aug 7.
  planId?: string;

  tier?: "Starter" | "Growth" | "Enterprise" | "Carbon" | "Government";

  autoRenew: boolean;

  startedAt: string;

  nextRenewal: string;
}