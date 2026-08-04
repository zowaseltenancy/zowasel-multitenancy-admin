import { KybStatus } from "@/types/kyb";
import { statusBadgeClass, statusDotClass, StatusTone } from "@/lib/statusTone";

interface Props {
  status: KybStatus;
}

const TONES: Record<KybStatus, StatusTone> = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
  not_submitted: "neutral",
};

const labels: Record<KybStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  not_submitted: "Not Submitted",
};

export default function KybStatusBadge({
  status,
}: Props) {
  const tone = TONES[status];

  return (
    <span className={statusBadgeClass(tone)}>
      <span className={statusDotClass(tone)} />
      {labels[status]}
    </span>
  );
}
