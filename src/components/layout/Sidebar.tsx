"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { navigation } from "@/config/navigation";

import SidebarGroup from "./SidebarGroup";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  collapsed,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out will-change-[width]",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo */}

      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Image
              src="/logo.png"
              alt="Zowasel"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>

          {!collapsed && (
            <div>
              <p className="font-semibold">
                Zowasel
              </p>

              <p className="text-xs text-sidebar-foreground/70">
                Platform Admin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {navigation.map((item) => (
            <SidebarGroup
              key={item.href}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}

      <div className="border-t border-sidebar-border p-4 text-center text-xs text-sidebar-foreground/60">
        {!collapsed
          ? "Platform Admin v0.1"
          : "v0.1"}
      </div>
    </aside>
  );
}