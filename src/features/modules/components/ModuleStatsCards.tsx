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
      <Card className="bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Core Modules
            </p>
            <h3 className="text-2xl font-bold mt-1">{totalCore}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active platform features
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Globally Enabled
            </p>
            <h3 className="text-2xl font-bold mt-1">{enabledCount}</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              Available to tenants
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Globally Disabled
            </p>
            <h3 className="text-2xl font-bold mt-1">{disabledCount}</h3>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              Hidden from tenants
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <XCircle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tenant Usage
            </p>
            <h3 className="text-2xl font-bold mt-1">{totalTenantUsage}</h3>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              Active subscriptions
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
