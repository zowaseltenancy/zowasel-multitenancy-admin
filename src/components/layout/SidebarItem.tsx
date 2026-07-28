"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavigationChild } from "@/config/navigation";

interface SidebarItemProps {
  item: NavigationChild;
}

export default function SidebarItem({ item }: SidebarItemProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullCurrentUrl = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");

  const active =
    item.href.includes("?")
      ? fullCurrentUrl === item.href
      : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

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