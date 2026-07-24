import { cn } from "@/lib/utils";
import { SubscriptionStatus } from "@/types/subscription";

interface Props {
  status: SubscriptionStatus;
}

const styles = {
  Active:
    "bg-green-100 text-green-700 border-green-200",

  Trial:
    "bg-blue-100 text-blue-700 border-blue-200",

  "Past Due":
    "bg-amber-100 text-amber-700 border-amber-200",

  Cancelled:
    "bg-red-100 text-red-700 border-red-200",
};

export default function SubscriptionStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}