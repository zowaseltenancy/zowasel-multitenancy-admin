import { TransactionStatus } from "@/types/transaction";
import { statusBadgeClass, statusDotClass, StatusTone } from "@/lib/statusTone";

interface Props {
  status: TransactionStatus;
}

const TONES: Record<TransactionStatus, StatusTone> = {
  Completed: "success",
  Pending: "warning",
  Failed: "danger",
  Refunded: "neutral",
};

export default function TransactionStatusBadge({
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
