"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  DollarSign,
  Receipt,
  Wallet,
  FileText,
  ShieldCheck,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export default function BillingTabs() {
  const pathname = usePathname();

  const TABS = [
    {
      label: "Overview",
      href: "/admin/billing",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Payment Providers",
      href: "/admin/billing/providers",
      icon: CreditCard,
    },
    {
      label: "Currencies & Rates",
      href: "/admin/billing/currency",
      icon: DollarSign,
    },
    {
      label: "Transactions",
      href: "/admin/billing/transactions",
      icon: Receipt,
    },
    {
      label: "Subscriptions",
      href: "/admin/billing/subscriptions",
      icon: Wallet,
    },
    {
      label: "Invoices",
      href: "/admin/billing/invoices",
      icon: FileText,
    },
    {
      label: "Settlements",
      href: "/admin/billing/settlements",
      icon: ShieldCheck,
    },
    {
      label: "Billing Settings",
      href: "/admin/billing/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);

        return (
          <Link key={tab.href} href={tab.href}>
            <button
              type="button"
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          </Link>
        );
      })}
    </div>
  );
}
