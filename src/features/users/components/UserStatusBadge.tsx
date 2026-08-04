import { UserAccountStatus } from "@/types/user";
import { statusBadgeClass, statusDotClass, StatusTone } from "@/lib/statusTone";

interface Props {
  status: UserAccountStatus;
}

const TONES: Record<UserAccountStatus, StatusTone> = {
  active: "success",
  pending: "warning",
  suspended: "danger",
  inactive: "neutral",
};

export default function UserStatusBadge({ status }: Props) {
  const tone = TONES[status];

  return (
    <span className={statusBadgeClass(tone) + " capitalize"}>
      <span className={statusDotClass(tone)} />
      {status}
    </span>
  );
}
