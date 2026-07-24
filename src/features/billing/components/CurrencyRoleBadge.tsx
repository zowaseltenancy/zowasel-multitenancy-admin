import { cn } from "@/lib/utils";
import { CurrencyRole } from "@/types/currency";

interface Props {
  role: CurrencyRole;
}

const styles = {
  Operational:
    "bg-blue-100 text-blue-700 border-blue-200",

  Settlement:
    "bg-purple-100 text-purple-700 border-purple-200",
};

export default function CurrencyRoleBadge({
  role,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        styles[role]
      )}
    >
      {role}
    </span>
  );
}