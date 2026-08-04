import { ProviderHealth } from "@/types/provider";
import { statusBadgeClass, statusDotClass, StatusTone } from "@/lib/statusTone";

interface Props {
  status: ProviderHealth;
}

const TONES: Record<ProviderHealth, StatusTone> = {
  healthy: "success",
  degraded: "warning",
  offline: "danger",
};

export default function ProviderStatusBadge({
  status,
}: Props) {
  const tone = TONES[status];

  return (
    <span className={statusBadgeClass(tone) + " capitalize"}>
      <span className={statusDotClass(tone)} />
      {status}
    </span>
  );
}
