"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import type { NavigationChild } from "@/config/navigation";

interface SidebarItemProps {
  item: NavigationChild;
}

function SidebarItemInner({ item }: SidebarItemProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullCurrentUrl = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");

  // Root sub-items (like /admin/finance-hub) should match strictly to prevent staying active on sub-routes
  const isSectionRoot =
    item.href === "/admin/finance-hub" ||
    item.href === "/admin/organizations" ||
    item.href === "/admin/billing" ||
    item.href === "/admin/kyb" ||
    item.href === "/admin/users" ||
    item.href === "/admin/staff" ||
    item.href === "/admin/notifications" ||
    item.href === "/admin/marketing" ||
    item.href === "/admin/roles";

  const active =
    item.href.includes("?")
      ? fullCurrentUrl === item.href
      : pathname === item.href ||
        (!isSectionRoot && item.href !== "/admin" && pathname.startsWith(item.href + "/"));

  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-white shadow-xs font-semibold"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}

function SidebarItemFallback({ item }: SidebarItemProps) {
  const pathname = usePathname();

  const isSectionRoot =
    item.href === "/admin/finance-hub" ||
    item.href === "/admin/organizations" ||
    item.href === "/admin/billing" ||
    item.href === "/admin/kyb" ||
    item.href === "/admin/users" ||
    item.href === "/admin/staff" ||
    item.href === "/admin/notifications" ||
    item.href === "/admin/marketing" ||
    item.href === "/admin/roles";

  const active =
    pathname === item.href ||
    (!isSectionRoot && item.href !== "/admin" && pathname.startsWith(item.href + "/"));

  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-white shadow-xs font-semibold"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}

export default function SidebarItem({ item }: SidebarItemProps) {
  return (
    <Suspense fallback={<SidebarItemFallback item={item} />}>
      <SidebarItemInner item={item} />
    </Suspense>
  );
}