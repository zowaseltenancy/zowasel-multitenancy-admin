"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  Receipt,
  Sprout,
  Users,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/finance-hub",
    label: "Analytics & Overview",
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
    href: "/admin/finance-hub/credit",
    label: "Credit & Portfolio Risk",
    icon: CreditCard,
  },
  {
    href: "/admin/finance-hub/sustainability",
    label: "CropPilot MRV & Carbon",
    icon: Sprout,
  },
  {
    href: "/admin/finance-hub/crm",
    label: "CRM 360 & Pipeline",
    icon: Users,
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
