import { cn } from "@/lib/utils";

interface Props {
  isDefault: boolean;
}

export default function CurrencyDefaultBadge({
  isDefault,
}: Props) {
  if (!isDefault) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
      )}
    >
      Default
    </span>
  );
}