import { cn } from "@/lib/utils";

interface Props {
  enabled: boolean;
}

const styles = {
  enabled:
    "bg-green-100 text-green-700 border-green-200",

  disabled:
    "bg-slate-100 text-slate-700 border-slate-200",
};

export default function CurrencyStatusBadge({
  enabled,
}: Props) {
  const status = enabled
    ? "enabled"
    : "disabled";

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