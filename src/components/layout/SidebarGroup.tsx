"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/config/navigation";

import SidebarItem from "./SidebarItem";

interface SidebarGroupProps {
  item: NavigationItem;
  collapsed: boolean;
}

export default function SidebarGroup({
  item,
  collapsed,
}: SidebarGroupProps) {
  const pathname = usePathname();

  /**
   * Dashboard is special because every admin page starts with "/admin".
   */
  const isCurrentPage =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href;

  /**
   * Section is active when we're anywhere inside it.
   */
  const isInSection =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href ||
        pathname.startsWith(item.href + "/");

  const hasChildren = !!item.children?.length;

  const [expanded, setExpanded] = useState(false);

  const isExpanded = useMemo(() => {
    if (collapsed) return false;

    return isInSection || expanded;
  }, [collapsed, expanded, isInSection]);

  const Icon = item.icon;

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex h-12 items-center rounded-xl transition-colors",

          isCurrentPage &&
            "bg-primary text-primary-foreground shadow-sm",

          !isCurrentPage &&
            isInSection &&
            "bg-primary/10 text-primary",

          !isCurrentPage &&
            !isInSection &&
            "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        <Link
          href={item.href}
          className={cn(
            "flex flex-1 items-center",
            collapsed
              ? "justify-center"
              : "gap-3 px-4"
          )}
        >
          {Icon && (
            <Icon className="h-5 w-5 shrink-0" />
          )}

          {!collapsed && (
            <span className="font-medium">
              {item.label}
            </span>
          )}
        </Link>

        {!collapsed && hasChildren && (
          <button
            type="button"
            onClick={() =>
              setExpanded((prev) => !prev)
            }
            className="mr-2 rounded-md p-1 transition-colors hover:bg-black/5"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {!collapsed &&
        hasChildren &&
        isExpanded && (
          <div className="ml-7 space-y-1 border-l border-sidebar-border pl-4">
            {item.children!.map((child) => (
              <SidebarItem
                key={child.href}
                item={child}
              />
            ))}
          </div>
        )}
    </div>
  );
}