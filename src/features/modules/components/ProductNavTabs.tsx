"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sprout, Store, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

// Exact-match active state on purpose — FinanceHubNav's `pathname.startsWith`
// broke because "/finance-hub/account" is a literal string-prefix of
// "/finance-hub/accounts-monitor". Not repeating that here.
const navItems = [
  { href: "/admin/modules", label: "Overview", icon: LayoutGrid },
  { href: "/admin/modules/products/croppilot", label: "CropPilot", icon: Sprout },
  { href: "/admin/modules/products/marketplace", label: "Marketplace", icon: Store },
  { href: "/admin/modules/products/acess", label: "ACESS", icon: CreditCard },
];

export default function ProductNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto no-scrollbar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

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
