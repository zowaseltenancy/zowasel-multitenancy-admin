import { cn } from "@/lib/utils";
import { PlatformUserRole } from "@/types/user";

interface Props {
  role: PlatformUserRole;
}

const roleStyles: Record<PlatformUserRole, string> = {
  "Tenant Admin": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  "Programme Manager": "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
  "Field Supervisor": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  "Field Agent": "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  "Data Analyst": "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800",
  "Farmer (self-service)": "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
};

export default function UserRoleBadge({ role }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        roleStyles[role] || "bg-gray-100 text-gray-700 border-gray-200"
      )}
    >
      {role}
    </span>
  );
}
