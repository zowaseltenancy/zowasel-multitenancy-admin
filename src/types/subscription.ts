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

  productId?: "croppilot" | "marketplace" | "acess" | "platform";

  autoRenew: boolean;

  startedAt: string;

  nextRenewal: string;

  // Real, independent lifecycle fields — each status branch reads its own,
  // instead of every label (Trial Ends / Due Since / Access Ended / Expires
  // On) being the same `expiresAt` value relabeled by whatever `status`
  // happens to be set. A record only ever populates the field(s) that match
  // its actual status.
  expiresAt?: string; // fixed-term, non-auto-renewing plans only
  trialEndsAt?: string; // status: "Trial"
  gracePeriodEndsAt?: string; // status: "Past Due" — grace window before suspension
  accessEndedAt?: string; // status: "Cancelled"
}