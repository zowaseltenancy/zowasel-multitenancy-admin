"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";

export default function KybOverviewPage() {
  const { organizations } = useOrganizations();

  const approved = organizations.filter(
    (organization) =>
      organization.kybStatus === "approved"
  ).length;

  const pending = organizations.filter(
    (organization) =>
      organization.kybStatus === "pending"
  ).length;

  const rejected = organizations.filter(
    (organization) =>
      organization.kybStatus === "rejected"
  ).length;

  const stats = [
    {
      label: "Total Submissions",
      value: organizations.filter(
        (organization) =>
          organization.kybStatus !== "not_submitted"
      ).length,
      icon: FileCheck,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      iconClassName:
        "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      iconClassName:
        "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      iconClassName:
        "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
  ];

  const quickLinks = [
    {
      title: "Pending KYB",
      description: `${pending} submission${pending === 1 ? "" : "s"} waiting on a decision.`,
      href: "/admin/kyb/pending",
      icon: Clock3,
    },
    {
      title: "Approved",
      description: `${approved} business${approved === 1 ? "" : "es"} verified.`,
      href: "/admin/kyb/approved",
      icon: CheckCircle2,
    },
    {
      title: "Rejected",
      description: `${rejected} submission${rejected === 1 ? "" : "s"} awaiting resubmission.`,
      href: "/admin/kyb/rejected",
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          KYB Review
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Review and decide on business verification submissions across the platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClassName}`}
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
          );
        })}
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            Quick Links
          </h2>

          <p className="text-sm text-muted-foreground">
            Jump straight into a review queue.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
              >
                <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
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
