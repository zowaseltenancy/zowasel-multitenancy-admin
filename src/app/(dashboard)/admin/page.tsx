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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";

export default function AdminDashboard() {
  const { organizations } = useOrganizations();

  const pendingKyb = organizations.filter(
    (organization) =>
      organization.kybStatus === "pending"
  ).length;

  const activeSubscriptions = organizations.reduce(
    (total, organization) =>
      total +
      organization.subscriptions.filter(
        (subscription) =>
          subscription.billingState === "paid"
      ).length,
    0
  );

  const stats = [
    {
      label: "Organizations",
      value: organizations.length,
    },
    {
      label: "Pending KYB",
      value: pendingKyb,
    },
    {
      label: "Paid Subscriptions",
      value: activeSubscriptions,
    },
    {
      label: "Team Members",
      value: organizations.reduce(
        (total, organization) =>
          total + organization.teamMembers.length,
        0
      ),
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
        <h2 className="text-3xl font-bold">
          Welcome back 👋
        </h2>

        <p className="mt-2 text-muted-foreground">
          Here&apos;s an overview of your platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                {stat.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            Quick Links
          </h2>

          <p className="text-sm text-muted-foreground">
            Jump directly into a section of the admin panel.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
