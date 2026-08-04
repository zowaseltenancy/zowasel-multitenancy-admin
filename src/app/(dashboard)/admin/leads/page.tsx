"use client";

import Link from "next/link";
import { ArrowRight, Clock3, CheckCircle2, TrendingUp, XCircle, UserPlus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { LeadStatus } from "@/types/lead";
import { LEAD_STATUS_LABELS } from "@/constants/lead";

const STATUS_META: Record<LeadStatus, { icon: typeof Clock3; cardBg: string; iconClassName: string }> = {
  incomplete: {
    icon: Clock3,
    cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
    iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  ready_to_convert: {
    icon: TrendingUp,
    cardBg: "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20",
    iconClassName: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  },
  converted: {
    icon: CheckCircle2,
    cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
    iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  lost: {
    icon: XCircle,
    cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
    iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
};

const STATUSES = Object.keys(STATUS_META) as LeadStatus[];

export default function LeadsOverviewPage() {
  const { leads } = useLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prospective customers with incomplete profiles — {leads.length} leads tracked, ready to
          convert into full organizations once their information is complete.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATUSES.map((status) => {
          const meta = STATUS_META[status];
          const Icon = meta.icon;
          const count = leads.filter((lead) => lead.status === status).length;

          return (
            <Link
              key={status}
              href={`/admin/leads/pipeline?status=${status}`}
              className="group block"
            >
              <Card className={`border shadow-2xs transition-all hover:scale-[1.02] ${meta.cardBg}`}>
                <CardContent className="flex flex-col justify-between p-4 min-h-[110px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {LEAD_STATUS_LABELS[status]}
                    </p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.iconClassName}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <p className="text-2xl font-bold">{count}</p>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Link
        href="/admin/leads/pipeline"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        <UserPlus className="h-4 w-4" />
        View Full Lead Pipeline
      </Link>
    </div>
  );
}
