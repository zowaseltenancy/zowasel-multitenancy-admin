import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  Receipt,
  Settings,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function BillingOverviewPage() {
  const snapshot = {
    revenue: "₦24.5M",
    revenueGrowth: "+12.5%",

    provider: "Paystack",
    providerHealth: "Healthy",

    transactionsToday: "324",
    transactionsGrowth: "+18 today",

    subscriptions: "24",
    renewals: "2 renewals",
  };

  const quickActions = [
    {
      title: "Providers",
      description: "Manage payment gateways.",
      href: "/admin/billing/providers",
      icon: CreditCard,
    },
    {
      title: "Currency",
      description: "Currencies & exchange rates.",
      href: "/admin/billing/currency",
      icon: DollarSign,
    },
    {
      title: "Transactions",
      description: "Monitor billing activity.",
      href: "/admin/billing/transactions",
      icon: Receipt,
    },
    {
      title: "Subscriptions",
      description: "Tenant plans & renewals.",
      href: "/admin/billing/subscriptions",
      icon: Wallet,
    },
    {
      title: "Invoices",
      description: "Billing documents & due dates.",
      href: "/admin/billing/invoices",
      icon: FileText,
    },
    {
      title: "Settlements",
      description: "Payouts to platform sellers.",
      href: "/admin/billing/settlements",
      icon: ShieldCheck,
    },
    {
      title: "Settings",
      description: "Billing configuration.",
      href: "/admin/billing/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Billing
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Monitor payment infrastructure,
            subscriptions, transactions and
            platform billing operations.
          </p>
        </div>

        <Card className="min-w-[240px]">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Billing Health
              </p>

              <p className="font-semibold text-green-600 dark:text-green-400">
                Healthy
              </p>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Snapshot */}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Operational Snapshot
            </h2>

            <p className="text-sm text-muted-foreground">
              Current platform billing status.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">
                Revenue
              </p>

              <h3 className="text-3xl font-bold">
                {snapshot.revenue}
              </h3>

              <p className="text-sm font-medium text-green-600">
                {snapshot.revenueGrowth}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">
                Active Provider
              </p>

              <h3 className="text-3xl font-bold">
                {snapshot.provider}
              </h3>

              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />

                <span>
                  {snapshot.providerHealth}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">
                Transactions Today
              </p>

              <h3 className="text-3xl font-bold">
                {snapshot.transactionsToday}
              </h3>

              <p className="text-sm font-medium text-green-600">
                {snapshot.transactionsGrowth}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">
                Active Subscriptions
              </p>

              <h3 className="text-3xl font-bold">
                {snapshot.subscriptions}
              </h3>

              <p className="text-sm font-medium text-primary">
                {snapshot.renewals}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            Quick Actions
          </h2>

          <p className="text-sm text-muted-foreground">
            Jump directly into a billing
            management area.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
              >
                <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {action.description}
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

            {/* Attention */}

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            Attention
          </h2>

          <p className="text-sm text-muted-foreground">
            Items that may require operational review.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <div>
                <p className="font-medium">
                  Provider Healthy
                </p>

                <p className="text-sm text-muted-foreground">
                  Paystack is operating normally.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Receipt className="h-5 w-5 text-amber-500" />

              <div>
                <p className="font-medium">
                  Overdue Settlement
                </p>

                <p className="text-sm text-muted-foreground">
                  1 settlement is awaiting review.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <DollarSign className="h-5 w-5 text-blue-600" />

              <div>
                <p className="font-medium">
                  Exchange Rates
                </p>

                <p className="text-sm text-muted-foreground">
                  Last synchronized 12 minutes ago.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <p className="text-sm text-muted-foreground">
            Latest billing events across the
            platform.
          </p>
        </div>

        <Card>
          <CardContent className="flex min-h-[140px] flex-col items-center justify-center text-center p-6">
            <Receipt className="mb-3 h-10 w-10 text-muted-foreground/40" />

            <h3 className="font-medium">
              No recent billing events
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Payments, provider changes,
              subscription renewals, currency
              updates and billing configuration
              changes will appear here.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}