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
}

export default function OrganizationStatsCards({
  organizations,
  activeFilter,
  onFilterChange,
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isActive = stat.filter === activeFilter;

        return (
          <button
            key={stat.label}
            type="button"
            onClick={() => onFilterChange(stat.filter)}
            className="text-left cursor-pointer"
          >
            <Card
              className={cn(
                "transition-all hover:-translate-y-0.5 hover:shadow-md border shadow-2xs",
                stat.cardBg,
                isActive && "ring-2 ring-primary border-primary"
              )}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border",
                    stat.iconClassName
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>

                  <h3 className="text-2xl font-bold mt-1">
                    {stat.value}
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
