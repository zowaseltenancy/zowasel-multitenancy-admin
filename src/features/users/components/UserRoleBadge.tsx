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
  "Zowasel Staff Admin": "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
  "Compliance Officer": "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
  "Cooperative Leader": "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800",
  "Input Merchant": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800",
  "Agrodealer": "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950/50 dark:text-lime-200 dark:border-lime-800",
  "Buyer": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800",
  "Continental Director": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-800",
  "Regional Manager": "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:border-sky-800",
  "Country Director": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800",
  "Chief Financial Officer": "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800",
  "Continental Finance Director": "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-800",
  "Regional Finance Manager": "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:border-sky-800",
  "Country Finance Officer": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800",
  "Chief Executive Officer": "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-200 dark:border-cyan-800",
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
