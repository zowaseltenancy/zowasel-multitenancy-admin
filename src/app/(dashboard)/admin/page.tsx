"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CreditCard,
  FileCheck,
  LayoutGrid,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";

export default function AdminDashboard() {
  const { organizations } = useOrganizations();

  const pendingKyb = organizations.filter(
    (organization) => organization.kybStatus === "pending"
  ).length;

  const activeSubscriptions = organizations.reduce(
    (total, organization) =>
      total +
      organization.subscriptions.filter(
        (subscription) => subscription.billingState === "paid"
      ).length,
    0
  );

  const totalTeamMembers = organizations.reduce(
    (total, organization) => total + organization.teamMembers.length,
    0
  );

  const stats = [
    {
      label: "Total Organizations",
      value: organizations.length,
      icon: Building2,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      label: "Pending KYB",
      value: pendingKyb,
      icon: Clock3,
      cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
      iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    },
    {
      label: "Paid Subscriptions",
      value: activeSubscriptions,
      icon: CheckCircle2,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      label: "Total Team Members",
      value: totalTeamMembers,
      icon: Users,
      cardBg: "bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20",
      iconClassName: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
    },
  ];

  const quickLinks = [
    {
      title: "Organizations",
      description: "Businesses, KYB status, modules and team.",
      href: "/admin/organizations",
      icon: Building2,
    },
    {
      title: "KYB Review",
      description: "Approve or reject pending submissions.",
      href: "/admin/kyb",
      icon: FileCheck,
    },
    {
      title: "Modules",
      description: "Manage the CropPilot module catalog.",
      href: "/admin/modules",
      icon: LayoutGrid,
    },
    {
      title: "Users",
      description: "Internal admin accounts and access.",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Roles",
      description: "Permission scopes for admin staff.",
      href: "/admin/roles",
      icon: ShieldCheck,
    },
    {
      title: "Billing",
      description: "Providers, currency, transactions.",
      href: "/admin/billing",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Welcome back 👋</h2>

        <p className="mt-2 text-muted-foreground">
          Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Snapshot Cards with Status Color Background Tints & Cyan Total Card */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className={`border shadow-2xs transition-colors ${stat.cardBg}`}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${stat.iconClassName}`}>
                  <Icon className="h-6 w-6" />
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
            Jump directly into a section of the admin panel.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
