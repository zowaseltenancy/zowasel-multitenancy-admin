import { cn } from "@/lib/utils";
import { SubscriptionStatus } from "@/types/subscription";

interface Props {
  status: SubscriptionStatus;
}

const styles = {
  Active:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold",

  Trial:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold",

  "Past Due":
    "bg-red-500/10 text-red-600 border-red-500/30 font-bold animate-pulse shadow-xs",

  Cancelled:
    "bg-muted text-muted-foreground border-border font-medium",
};

export default function SubscriptionStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors",
        styles[status]
      )}
    >
      {status === "Past Due" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-600" />}
      {status === "Trial" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-600" />}
      {status === "Active" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />}
      {status}
    </span>
  );
}