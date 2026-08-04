import { statusBadgeClass, statusDotClass } from "@/lib/statusTone";

interface Props {
  enabled: boolean;
}

export default function CurrencyStatusBadge({
  enabled,
}: Props) {
  const tone = enabled ? "success" : "neutral";

  return (
    <span className={statusBadgeClass(tone) + " capitalize"}>
      <span className={statusDotClass(tone)} />
      {enabled ? "enabled" : "disabled"}
    </span>
  );
}
