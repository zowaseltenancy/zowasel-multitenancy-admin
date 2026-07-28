"use client";

import Link from "next/link";
import {
  Package,
  Users,
  ChevronRight,
  Sprout,
  Store,
  BarChart3,
  Globe,
  Truck,
  Leaf,
  LucideIcon,
  Badge,
} from "lucide-react";
import { Module } from "@/types/module";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

interface ModuleCardProps {
  module: Module;
  tenantCount: number;
}

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  croppilot: Sprout,
  marketplace: Store,
  analytics: BarChart3,
  export_management: Globe,
  supply_chain: Truck,
  carbon_sustainability: Leaf,
};

export const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  croppilot: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  marketplace: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  analytics: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  export_management: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  supply_chain: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" },
  carbon_sustainability: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
};

export default function ModuleCard({ module, tenantCount }: ModuleCardProps) {
  const IconComponent = CATEGORY_ICONS[module.category] || Package;
  const style = CATEGORY_STYLES[module.category] || {
    bg: "bg-primary/10",
    text: "text-primary",
  };

  const isEnabled = module.enabled !== false;

  return (
    <Card
      className={`group transition-all duration-200 hover:-translate-y-1 hover:shadow-md border ${
        !isEnabled ? "opacity-60 bg-muted/20" : "bg-card"
      }`}
    >
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className={`p-2.5 rounded-xl ${style.bg} ${style.text}`}>
              <IconComponent className="h-5 w-5" />
            </div>

            <Badge
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isEnabled
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isEnabled ? "bg-emerald-500" : "bg-red-500"}`} />
              {isEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="mt-3">
            <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
              {module.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {module.description}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-border/60">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{module.submodule_count || 0} sub-modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{tenantCount} tenants</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              {module.isPaid ? (
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ${module.pricePerMonth} <span className="text-xs font-normal text-muted-foreground">/ mo</span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  Free
                </span>
              )}
            </div>

            <Link
              href={`/admin/modules/${module.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
            >
              Manage
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
