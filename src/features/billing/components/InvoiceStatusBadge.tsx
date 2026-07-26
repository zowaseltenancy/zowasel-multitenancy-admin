import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/types/invoice";

interface Props {
  status: InvoiceStatus;
}

const styles: Record<InvoiceStatus, string> = {
  Paid: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Overdue: "bg-red-100 text-red-700 border-red-200",
  Void: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function InvoiceStatusBadge({
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
