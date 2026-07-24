import { cn } from "@/lib/utils";
import { KybStatus } from "@/types/kyb";

interface Props {
  status: KybStatus;
}

const styles: Record<KybStatus, string> = {
  approved:
    "bg-green-100 text-green-700 border-green-200",

  pending:
    "bg-amber-100 text-amber-700 border-amber-200",

  rejected:
    "bg-red-100 text-red-700 border-red-200",

  not_submitted:
    "bg-slate-100 text-slate-700 border-slate-200",
};

const labels: Record<KybStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  not_submitted: "Not Submitted",
};

export default function KybStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
