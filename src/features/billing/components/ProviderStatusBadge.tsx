import { cn } from "@/lib/utils";
import { ProviderHealth } from "@/types/provider";

interface Props {
  status: ProviderHealth;
}

const styles = {
  healthy:
    "bg-green-100 text-green-700 border-green-200",

  degraded:
    "bg-amber-100 text-amber-700 border-amber-200",

  offline:
    "bg-red-100 text-red-700 border-red-200",
};

export default function ProviderStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}