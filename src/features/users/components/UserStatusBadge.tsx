import { cn } from "@/lib/utils";
import { UserAccountStatus } from "@/types/user";

interface Props {
  status: UserAccountStatus;
}

const statusStyles: Record<UserAccountStatus, string> = {
  active: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800",
  inactive: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  suspended: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
};

export default function UserStatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
