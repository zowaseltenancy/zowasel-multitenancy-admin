"use client";

import {
  CheckCircle2,
  Clock3,
  Layers,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import SubscriptionGrid from "@/features/billing/components/SubscriptionGrid";
import { useSubscriptions } from "@/features/billing/hooks/useSubscriptions";

export default function SubscriptionsPage() {
  const { subscriptions } = useSubscriptions();

  const active = subscriptions.filter(
    (subscription) => subscription.status === "Active"
  ).length;

  const trial = subscriptions.filter(
    (subscription) => subscription.status === "Trial"
  ).length;

  const pastDue = subscriptions.filter(
    (subscription) => subscription.status === "Past Due"
  ).length;

  const stats = [
    {
      title: "Total Subscriptions",
      value: subscriptions.length,
      icon: Layers,
    },
    {
      title: "Active",
      value: active,
      icon: CheckCircle2,
    },
    {
      title: "Trial",
      value: trial,
      icon: Clock3,
    },
    {
      title: "Past Due",
      value: pastDue,
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold">
          Subscriptions
        </h1>

        <p className="mt-2 text-muted-foreground">
          Every business tenant&apos;s active product subscriptions across the platform.
        </p>
      </div>

      {/* Snapshot */}

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

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Subscriptions */}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            All Subscriptions
          </h2>

          <p className="text-sm text-muted-foreground">
            Click a subscription to view the full billing relationship.
          </p>
        </div>

        <SubscriptionGrid
          subscriptions={subscriptions}
        />
      </section>
    </div>
  );
}
