import { LeadStatus } from "@/types/lead";
import { LEAD_STATUS_LABELS, LEAD_STATUS_TONE } from "@/constants/lead";
import { statusBadgeClass, statusDotClass } from "@/lib/statusTone";

interface Props {
  status: LeadStatus;
}

export default function LeadStatusBadge({ status }: Props) {
  const tone = LEAD_STATUS_TONE[status];

  return (
    <span className={statusBadgeClass(tone)}>
      <span className={statusDotClass(tone)} />
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
