"use client";

import {
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Organization } from "@/types/organization";
import { KybStatus } from "@/types/kyb";

interface Props {
  organizations: Organization[];
  activeFilter: KybStatus | "all";
  onFilterChange: (value: KybStatus | "all") => void;
  className?: string;
}

export default function OrganizationStatsCards({
  organizations,
  activeFilter,
  onFilterChange,
  className,
}: Props) {
  const stats: {
    label: string;
    value: number;
    filter: KybStatus | "all";
    icon: typeof Building2;
    cardBg: string;
    iconClassName: string;
  }[] = [
    {
      label: "Total",
      value: organizations.length,
      filter: "all",
      icon: Building2,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      label: "Approved",
      value: organizations.filter(
        (organization) => organization.kybStatus === "approved"
      ).length,
      filter: "approved",
      icon: CheckCircle2,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      label: "Pending",
      value: organizations.filter(
        (organization) => organization.kybStatus === "pending"
      ).length,
      filter: "pending",
      icon: Clock3,
      cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
      iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    },
    {
      label: "Rejected",
      value: organizations.filter(
        (organization) => organization.kybStatus === "rejected"
      ).length,
      filter: "rejected",
      icon: XCircle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
      iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full", className)}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isActive = stat.filter === activeFilter;

        return (
          <button
            key={stat.label}
            type="button"
            onClick={() => onFilterChange(stat.filter)}
            className="text-left cursor-pointer w-full min-w-0 focus:outline-none group"
          >
            <Card
              className={cn(
                "w-full h-full min-w-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs border shadow-2xs rounded-xl overflow-hidden",
                stat.cardBg,
                isActive && "ring-2 ring-primary border-primary shadow-xs"
              )}
            >
              <CardContent className="flex items-center gap-2.5 p-2.5 sm:p-3 min-w-0 w-full">
                <div
                  className={cn(
                    "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 aspect-square items-center justify-center rounded-full border transition-transform duration-200 group-hover:scale-105",
                    stat.iconClassName
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                </div>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                    {stat.label}
                  </p>

                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate tabular-nums leading-tight">
                    {stat.value.toLocaleString()}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
