import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";

import { Subscription } from "@/types/subscription";

interface Props {
  subscription: Subscription;
}

export default function SubscriptionCard({
  subscription,
}: Props) {
  return (
    <Link
      href={`/admin/billing/subscriptions/${subscription.id}`}
    >
      <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
        <CardContent className="flex h-full flex-col gap-5 p-6">
          {/* Header */}

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {subscription.organization}
              </h3>

              <p className="text-sm text-muted-foreground">
                {subscription.product}
              </p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>

          {/* Amount */}

          <div>
            <p className="text-2xl font-bold">
              {subscription.currency}{" "}
              {subscription.amount.toLocaleString()}
            </p>

            <p className="text-sm text-muted-foreground">
              per {subscription.billingCycle.toLowerCase()}
            </p>
          </div>

          {/* Footer */}

          <div className="mt-auto space-y-3 border-t pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Next Renewal
              </span>

              <span className="font-medium">
                {new Date(
                  subscription.nextRenewal
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <SubscriptionStatusBadge
              status={subscription.status}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
