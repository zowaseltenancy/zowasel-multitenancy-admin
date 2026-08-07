"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, History, LayoutDashboard, Receipt, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

// Finance Hub is exactly what RVE-065 asked for — Zowasel's own account,
// analytics, ledger, and accounts monitoring. Credit moved to ACESS and
// CropPilot MRV/CRM 360 moved to Analysis — neither belongs here, per the
// Aug 3 sprint tasks and Busayo's Aug 6 call. Overview and Analytics are
// split per Busayo's Aug 6 restructure: Overview is the glanceable roll-up,
// Analytics carries the interactive drill-down charts.
const navItems = [
  {
    href: "/admin/finance-hub",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/finance-hub/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/finance-hub/account",
    label: "Master Account & Statements",
    icon: Wallet,
  },
  {
    href: "/admin/finance-hub/transactions",
    label: "Platform Ledger & Outflows",
    icon: Receipt,
  },
  {
    href: "/admin/finance-hub/accounts-monitor",
    label: "Accounts Monitoring",
    icon: ShieldCheck,
  },
  {
    href: "/admin/finance-hub/activity",
    label: "Activity Log",
    icon: History,
  },
];

export default function FinanceHubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto no-scrollbar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin/finance-hub"
            ? pathname === "/admin/finance-hub"
            : pathname.startsWith(item.href);

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
