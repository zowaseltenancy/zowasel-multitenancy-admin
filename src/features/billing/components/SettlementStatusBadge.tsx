import { cn } from "@/lib/utils";
import { SettlementStatus } from "@/types/settlement";

interface Props {
  status: SettlementStatus;
}

const styles: Record<SettlementStatus, string> = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  Processing: "bg-blue-100 text-blue-700 border-blue-200",
  Scheduled: "bg-amber-100 text-amber-700 border-amber-200",
  Failed: "bg-red-100 text-red-700 border-red-200",
};

export default function SettlementStatusBadge({
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
