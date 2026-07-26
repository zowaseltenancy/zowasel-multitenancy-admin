"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useInvoices } from "@/features/billing/hooks/useInvoices";

export default function InvoicesOverviewPage() {
  const { invoices } = useInvoices();

  const paid = invoices.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const pending = invoices.filter(
    (invoice) => invoice.status === "Pending"
  ).length;

  const overdue = invoices.filter(
    (invoice) => invoice.status === "Overdue"
  ).length;

  const voided = invoices.filter(
    (invoice) => invoice.status === "Void"
  ).length;

  const stats = [
    {
      title: "Total Invoices",
      value: invoices.length,
      icon: FileText,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Paid",
      value: paid,
      icon: CheckCircle2,
      iconClassName:
        "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      iconClassName:
        "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      title: "Overdue",
      value: overdue,
      icon: AlertCircle,
      iconClassName:
        "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
  ];

  const quickLinks = [
    {
      title: "All Invoices",
      description: "Every billing document issued.",
      href: "/admin/billing/invoices/all",
      icon: FileText,
    },
    {
      title: "Paid",
      description: `${paid} settled invoice${paid === 1 ? "" : "s"}.`,
      href: "/admin/billing/invoices/paid",
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      description: `${pending} awaiting payment.`,
      href: "/admin/billing/invoices/pending",
      icon: Clock3,
    },
    {
      title: "Overdue",
      description: `${overdue} past their due date.`,
      href: "/admin/billing/invoices/overdue",
      icon: AlertCircle,
    },
    {
      title: "Void",
      description: `${voided} cancelled invoice${voided === 1 ? "" : "s"}.`,
      href: "/admin/billing/invoices/void",
      icon: Ban,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Invoices
        </h1>

        <p className="mt-2 text-muted-foreground">
          Billing documents issued to tenants for subscriptions and platform fees.
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
