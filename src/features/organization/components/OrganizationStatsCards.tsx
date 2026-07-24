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

    iconClassName: string;
  }[] = [
    {
      label: "Total Organizations",
      value: organizations.length,
      filter: "all",
      icon: Building2,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      label: "KYB Approved",
      value: organizations.filter(
        (organization) =>
          organization.kybStatus === "approved"
      ).length,
      filter: "approved",
      icon: CheckCircle2,
      iconClassName:
        "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      label: "KYB Pending",
      value: organizations.filter(
        (organization) =>
          organization.kybStatus === "pending"
      ).length,
      filter: "pending",
      icon: Clock3,
      iconClassName:
        "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      label: "KYB Rejected",
      value: organizations.filter(
        (organization) =>
          organization.kybStatus === "rejected"
      ).length,
      filter: "rejected",
      icon: XCircle,
      iconClassName:
        "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        const isActive =
          stat.filter === activeFilter;

        return (
          <button
            key={stat.label}
            type="button"
            onClick={() =>
              onFilterChange(stat.filter)
            }
            className="text-left"
          >
            <Card
              className={cn(
                "transition-all hover:-translate-y-0.5 hover:shadow-md",
                isActive && "ring-2 ring-primary"
              )}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    stat.iconClassName
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>

                  <h3 className="text-2xl font-bold">
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
