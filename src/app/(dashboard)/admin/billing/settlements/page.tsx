"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Wallet,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useSettlements } from "@/features/billing/hooks/useSettlements";

export default function SettlementsOverviewPage() {
  const { settlements } = useSettlements();

  const completed = settlements.filter(
    (settlement) => settlement.status === "Completed"
  ).length;

  const processing = settlements.filter(
    (settlement) => settlement.status === "Processing"
  ).length;

  const scheduled = settlements.filter(
    (settlement) => settlement.status === "Scheduled"
  ).length;

  const failed = settlements.filter(
    (settlement) => settlement.status === "Failed"
  ).length;

  const stats = [
    {
      title: "Total Settlements",
      value: settlements.length,
      icon: Wallet,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconClassName:
        "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      title: "Processing",
      value: processing,
      icon: Clock3,
      iconClassName:
        "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "Failed",
      value: failed,
      icon: XCircle,
      iconClassName:
        "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
  ];

  const quickLinks = [
    {
      title: "All Settlements",
      description: "Every payout disbursed or scheduled.",
      href: "/admin/billing/settlements/all",
      icon: Wallet,
    },
    {
      title: "Completed",
      description: `${completed} payout${completed === 1 ? "" : "s"} disbursed.`,
      href: "/admin/billing/settlements/completed",
      icon: CheckCircle2,
    },
    {
      title: "Processing",
      description: `${processing} currently in flight.`,
      href: "/admin/billing/settlements/processing",
      icon: Clock3,
    },
    {
      title: "Scheduled",
      description: `${scheduled} queued for a future date.`,
      href: "/admin/billing/settlements/scheduled",
      icon: CalendarClock,
    },
    {
      title: "Failed",
      description: `${failed} that need retrying.`,
      href: "/admin/billing/settlements/failed",
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Settlements
        </h1>

        <p className="mt-2 text-muted-foreground">
          Payouts disbursed to merchants, agrodealers, buyers and cooperatives selling on the platform.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClassName}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Quick Links
        </h2>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href}>
                <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                  <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {link.title}
                      </h3>

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
