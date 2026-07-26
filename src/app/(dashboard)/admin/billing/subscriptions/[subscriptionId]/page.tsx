import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SubscriptionStatusBadge from "@/features/billing/components/SubscriptionStatusBadge";
import SubscriptionInfo from "@/features/billing/components/SubscriptionInfo";
import { subscriptionService } from "@/features/billing/services/subscription.service";

interface Props {
  params: Promise<{
    subscriptionId: string;
  }>;
}

export default async function SubscriptionDetailsPage({
  params,
}: Props) {
  const { subscriptionId } = await params;

  const subscription =
    subscriptionService.getSubscriptionById(
      subscriptionId
    );

  if (!subscription) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/billing/subscriptions"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subscriptions
          </Link>

          <h1 className="text-3xl font-semibold">
            {subscription.organization}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {subscription.product} subscription
          </p>
        </div>

        <SubscriptionStatusBadge
          status={subscription.status}
        />
      </div>

      {/* Information */}

      <Card>
        <CardHeader>
          <CardTitle>
            Subscription Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <SubscriptionInfo
            label="Business"
            value={subscription.organization}
          />

          <SubscriptionInfo
            label="Product"
            value={subscription.product}
          />

          <SubscriptionInfo
            label="Amount"
            value={`${subscription.currency} ${subscription.amount.toLocaleString()}`}
          />

          <SubscriptionInfo
            label="Billing Cycle"
            value={subscription.billingCycle}
          />

          <SubscriptionInfo
            label="Auto Renew"
            value={
              subscription.autoRenew ? "Enabled" : "Disabled"
            }
          />

          <SubscriptionInfo
            label="Started"
            value={new Date(
              subscription.startedAt
            ).toLocaleDateString()}
          />

          <SubscriptionInfo
            label="Next Renewal"
            value={new Date(
              subscription.nextRenewal
            ).toLocaleDateString()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
