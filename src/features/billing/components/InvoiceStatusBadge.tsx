import { InvoiceStatus } from "@/types/invoice";
import { statusBadgeClass, statusDotClass, StatusTone } from "@/lib/statusTone";

interface Props {
  status: InvoiceStatus;
}

const TONES: Record<InvoiceStatus, StatusTone> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "danger",
  Void: "neutral",
};

export default function InvoiceStatusBadge({
  status,
}: Props) {
  const tone = TONES[status];

  return (
    <span className={statusBadgeClass(tone)}>
      <span className={statusDotClass(tone)} />
      {status}
    </span>
  );
}
