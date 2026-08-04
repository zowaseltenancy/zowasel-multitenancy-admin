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
    description: "Stage 1 — first line of review for any transaction issue.",
  },
  {
    label: "Zowasel Finance Team",
    value: "finance_team",
    description: "Stage 2 — settlement/reconciliation-impacting disputes.",
  },
  {
    label: "Provider Support (external)",
    value: "provider_support",
    description: "Stage 3 — when the issue looks like it originates with the payment provider itself.",
  },
];

// Escalation is a real sequential workflow, not a free pick: every dispute
// starts with Ops, then moves to Finance, then to the external Provider —
// never straight to Provider on first submission.
const ESCALATION_SEQUENCE: DisputeNotifyTarget[] = [
  "operations_team",
  "finance_team",
  "provider_support",
];

export function getNextEscalationStage(
  current: DisputeNotifyTarget
): DisputeNotifyTarget | null {
  const index = ESCALATION_SEQUENCE.indexOf(current);
  return index >= 0 && index < ESCALATION_SEQUENCE.length - 1
    ? ESCALATION_SEQUENCE[index + 1]
    : null;
}
