import { SettlementStatus } from "@/types/settlement";
import { statusBadgeClass, statusDotClass, StatusTone } from "@/lib/statusTone";

interface Props {
  status: SettlementStatus;
}

const TONES: Record<SettlementStatus, StatusTone> = {
  Completed: "success",
  Processing: "info",
  Scheduled: "warning",
  Failed: "danger",
};

export default function SettlementStatusBadge({
  status,
}: Props) {
  const tone = TONES[status];

  return (
    <span className={statusBadgeClass(tone)}>
      <span className={statusDotClass(tone)} />
      {status}
    </span>
  );
}
