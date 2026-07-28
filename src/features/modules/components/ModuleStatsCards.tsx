"use client";

import { Layers, CheckCircle2, XCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ModuleStatsCardsProps {
  totalCore: number;
  enabledCount: number;
  disabledCount: number;
  totalTenantUsage: number;
}

export default function ModuleStatsCards({
  totalCore,
  enabledCount,
  disabledCount,
  totalTenantUsage,
}: ModuleStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Core Modules Card - Cyan Tint */}
      <Card className="bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Core Modules
            </p>
            <h3 className="text-2xl font-bold mt-1">{totalCore}</h3>
            <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">
              Active platform features
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:text-cyan-400">
            <Layers className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Globally Enabled - Emerald Tint */}
      <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Globally Enabled
            </p>
            <h3 className="text-2xl font-bold mt-1">{enabledCount}</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Available to tenants
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Globally Disabled - Amber Tint */}
      <Card className="bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Globally Disabled
            </p>
            <h3 className="text-2xl font-bold mt-1">{disabledCount}</h3>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              Hidden from tenants
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400">
            <XCircle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Tenant Usage - Purple Tint */}
      <Card className="bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tenant Usage
            </p>
            <h3 className="text-2xl font-bold mt-1">{totalTenantUsage}</h3>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
              Active subscriptions
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-600 border border-purple-500/30 dark:text-purple-400">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
