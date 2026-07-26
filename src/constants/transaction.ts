import { DisputeNotifyTarget } from "@/types/transaction";

export const DISPUTE_NOTIFY_TARGET_LABELS: Record<
  DisputeNotifyTarget,
  string
> = {
  operations_team: "Zowasel Operations Team",
  finance_team: "Zowasel Finance Team",
  provider_support: "Provider Support (external)",
};

export const DISPUTE_NOTIFY_TARGET_OPTIONS: {
  label: string;

  value: DisputeNotifyTarget;

  description: string;
}[] = [
  {
    label: "Zowasel Operations Team",
    value: "operations_team",
    description: "Default — first line of review for any transaction issue.",
  },
  {
    label: "Zowasel Finance Team",
    value: "finance_team",
    description: "For settlement/reconciliation-impacting disputes.",
  },
  {
    label: "Provider Support (external)",
    value: "provider_support",
    description: "When the issue looks like it originates with the payment provider itself.",
  },
];
