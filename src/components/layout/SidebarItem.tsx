"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavigationChild } from "@/config/navigation";

interface SidebarItemProps {
  item: NavigationChild;
}

export default function SidebarItem({
  item,
}: SidebarItemProps) {
  const pathname = usePathname();

  const active =
    pathname === item.href ||
    pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-10 items-center rounded-lg px-4 text-sm transition-colors",
        active
          ? "bg-primary text-white"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}