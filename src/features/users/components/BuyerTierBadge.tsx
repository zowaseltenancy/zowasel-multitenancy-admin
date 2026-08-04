import { statusBadgeClass } from "@/lib/statusTone";
import { BUYER_TIER_LABELS, BUYER_TIER_TONE } from "@/constants/user";
import { BuyerTier } from "@/types/user";

interface Props {
  tier: BuyerTier;
}

export default function BuyerTierBadge({ tier }: Props) {
  return (
    <span className={statusBadgeClass(BUYER_TIER_TONE[tier])} title={BUYER_TIER_LABELS[tier]}>
      {BUYER_TIER_LABELS[tier]}
    </span>
  );
}
