"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Receipt,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InvoiceTable from "@/features/billing/components/InvoiceTable";
import { useInvoices } from "@/features/billing/hooks/useInvoices";

export default function InvoicesOverviewPage() {
  const { invoices } = useInvoices();

  const paid = invoices.filter((invoice) => invoice.status === "Paid").length;
  const pending = invoices.filter((invoice) => invoice.status === "Pending").length;
  const overdue = invoices.filter((invoice) => invoice.status === "Overdue").length;

  const stats = [
    {
      title: "Total Invoices",
      value: invoices.length,
      icon: FileText,
      cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
      iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
    },
    {
      title: "Paid",
      value: paid,
      icon: CheckCircle2,
      cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
      iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
      iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    },
    {
      title: "Overdue",
      value: overdue,
      icon: AlertCircle,
      cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
      iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    },
  ];

  // 5 Most recent invoices sorted by issued date (newest to oldest)
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Billing documents issued to tenants for subscriptions and platform services.
          </p>
        </div>

        {/* Primary Action Button */}
        <Link href="/admin/billing/invoices/all">
          <Button className="gap-2 shadow-xs cursor-pointer">
            <Receipt className="h-4 w-4" />
            <span>View All Invoices</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Snapshot Cards with Status Color Background Tints */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className={`border shadow-2xs transition-colors ${stat.cardBg}`}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${stat.iconClassName}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Invoices Generated (Top 5 from most recent to oldest) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Invoices Generated</h2>
            <p className="text-xs text-muted-foreground">The 5 most recent invoices issued on the platform.</p>
          </div>

          <Link href="/admin/billing/invoices/all" className="text-xs font-medium text-primary hover:underline">
            See full invoice history ➔
          </Link>
        </div>

        <InvoiceTable invoices={recentInvoices} />
      </section>
    </div>
  );
}
