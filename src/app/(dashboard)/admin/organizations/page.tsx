"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileClock,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizationStats } from "@/features/organization/hooks/useOrganizations";

export default function OrganizationsOverviewPage() {
  // GET /admin/businesses/stats rather than counting the fetched list. The
  // list is one page (100 rows), so deriving totals from it under-reports as
  // soon as the platform outgrows a page — and it has no way to count a bucket
  // that happens to fall outside that page.
  const { stats: summary, isLoading, error } = useOrganizationStats();

  const total = summary?.total ?? 0;
  const approved = summary?.kyb.APPROVED ?? 0;
  const pending = summary?.kyb.PENDING ?? 0;
  const rejected = summary?.kyb.REJECTED ?? 0;
  // Businesses that have never started KYB — the largest bucket in practice,
  // and previously invisible on this page.
  const notSubmitted = summary?.kyb.NOT_SUBMITTED ?? 0;

  const stats = [
    {
      label: "Total Org.",
      value: total,
      icon: Building2,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      label: "Awaiting KYB Submission",
      value: notSubmitted,
      icon: FileClock,
      cardBg: "bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20",
      iconClassName: "bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-300",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
      iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
      iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
  ];

  const quickLinks = [
    {
      title: "All Organizations",
      description: "Every business tenant, any KYB status.",
      href: "/admin/organizations/all",
      icon: Building2,
    },
    {
      title: "Pending Approval",
      description: `${pending} organization${pending === 1 ? "" : "s"} awaiting KYB review.`,
      href: "/admin/organizations/pending",
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organizations</h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage every business tenant on the platform — KYB status, active modules, subscription plan and team size.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="size-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">Unable to load organization stats</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Snapshot Cards with Status Color Background Tints */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className={`border shadow-2xs transition-colors rounded-2xl overflow-hidden ${stat.cardBg}`}>
              <CardContent className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 min-w-0">
                <div className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 aspect-square items-center justify-center rounded-full border ${stat.iconClassName}`}>
                  <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0" />
                </div>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                    {stat.label}
                  </p>

                  {isLoading ? (
                    <Skeleton className="mt-1 h-7 w-14" />
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-0.5 truncate tabular-nums">
                      {stat.value.toLocaleString()}
                    </h3>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Quick Links</h2>

          <p className="text-sm text-muted-foreground">
            Jump into a specific view of your organizations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href}>
                <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg bg-card">
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold">{link.title}</h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
