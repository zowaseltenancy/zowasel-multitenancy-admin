"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SubSectionPillItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
}

interface SubSectionPillNavProps {
  items: SubSectionPillItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export default function SubSectionPillNav({
  items,
  activeTab,
  onTabChange,
  className,
}: SubSectionPillNavProps) {
  return (
    <div className={cn("flex items-center gap-2 border-b pb-3 overflow-x-auto no-scrollbar", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-2xs",
              isActive
                ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                : "border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold font-mono",
                  isActive
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-muted text-foreground border"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
