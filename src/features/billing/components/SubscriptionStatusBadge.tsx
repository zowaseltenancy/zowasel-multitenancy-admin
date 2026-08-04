import { SubscriptionStatus } from "@/types/subscription";
import { statusBadgeClass, statusDotClass, StatusTone } from "@/lib/statusTone";

interface Props {
  status: SubscriptionStatus;
}

const TONES: Record<SubscriptionStatus, StatusTone> = {
  Active: "success",
  Trial: "warning",
  "Past Due": "danger",
  Cancelled: "neutral",
};

export default function SubscriptionStatusBadge({
  status,
}: Props) {
  const tone = TONES[status];
  const urgent = status === "Past Due";

  return (
    <span className={statusBadgeClass(tone, urgent)}>
      <span className={statusDotClass(tone)} />
      {status}
    </span>
  );
}
