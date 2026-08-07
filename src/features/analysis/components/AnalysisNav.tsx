"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/analysis/crm",
    label: "CRM 360 & Pipeline",
    icon: Users,
  },
  {
    href: "/admin/analysis/sustainability",
    label: "CropPilot MRV & Carbon",
    icon: Sprout,
  },
];

export default function AnalysisNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto no-scrollbar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
              isActive
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "border bg-card text-foreground hover:bg-muted"
            )}
          >
            <Icon className={cn("h-4 w-4", !isActive && "text-muted-foreground")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
