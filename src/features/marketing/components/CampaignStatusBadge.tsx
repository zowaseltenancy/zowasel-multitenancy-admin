import { CampaignStatus } from "@/types/marketing";
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_STATUS_TONE } from "@/constants/marketing";
import { statusBadgeClass, statusDotClass } from "@/lib/statusTone";

interface Props {
  status: CampaignStatus;
}

export default function CampaignStatusBadge({ status }: Props) {
  const tone = CAMPAIGN_STATUS_TONE[status];

  return (
    <span className={statusBadgeClass(tone)}>
      <span className={statusDotClass(tone)} />
      {CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}
