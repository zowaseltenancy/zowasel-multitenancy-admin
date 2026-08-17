import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Shield, AlertCircle, RefreshCw } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SubscriptionStatusBadge from "@/features/billing/components/SubscriptionStatusBadge";
import SubscriptionInfo from "@/features/billing/components/SubscriptionInfo";
import ExportMenu from "@/components/shared/ExportMenu";
import { subscriptionService } from "@/features/billing/services/subscription.service";
import { ExportTable } from "@/lib/export";

interface Props {
  params: Promise<{
    subscriptionId: string;
  }>;
}

export default async function SubscriptionDetailsPage({
  params,
}: Props) {
  const { subscriptionId } = await params;

  const subscription = subscriptionService.getSubscriptionById(subscriptionId);

  if (!subscription) {
    notFound();
  }

  const isAutoRenewing = subscription.status === "Active" && subscription.autoRenew;
  const isTrial = subscription.status === "Trial";
  const isPastDue = subscription.status === "Past Due";
  const isCancelled = subscription.status === "Cancelled";
  const isFixedTerm = subscription.status === "Active" && !subscription.autoRenew;

  // Each status reads its own real field — no longer four labels relabeling
  // the same `expiresAt` value.
  const trialEndDate = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const gracePeriodEndDate = subscription.gracePeriodEndsAt ? new Date(subscription.gracePeriodEndsAt) : null;
  const accessEndedDate = subscription.accessEndedAt ? new Date(subscription.accessEndedAt) : null;
  const fixedTermExpiryDate = subscription.expiresAt ? new Date(subscription.expiresAt) : null;
  const targetDate = trialEndDate ?? gracePeriodEndDate ?? accessEndedDate ?? fixedTermExpiryDate ?? new Date(subscription.nextRenewal);

  const now = new Date();
  const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;

  const exportTableData: ExportTable = {
    title: `Subscription Record - ${subscription.organization} (${subscription.product})`,
    headers: ["Property", "Value"],
    rows: [
      ["Organization", subscription.organization],
      ["Product", subscription.product],
      ["Tier", subscription.tier || "Standard"],
      ["Amount", `${subscription.currency} ${subscription.amount.toLocaleString()}`],
      ["Billing Cycle", subscription.billingCycle],
      ["Status", subscription.status],
      ["Auto Renew", subscription.autoRenew ? "Enabled (Continuous)" : "Disabled"],
      ["Started Date", new Date(subscription.startedAt).toLocaleDateString()],
      ["Next Renewal Date", new Date(subscription.nextRenewal).toLocaleDateString()],
      ["Lifecycle Term", isAutoRenewing ? "Continuous (Auto-renews)" : targetDate.toLocaleDateString()],
    ],
  };

  return (
    <div className="space-y-6" id="subscription-detail-capture">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/billing/subscriptions"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subscriptions
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            {subscription.organization}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground font-medium">
            {subscription.product}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportMenu
            table={exportTableData}
            captureElementId="subscription-detail-capture"
          />
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
      </div>

      {/* Expiry Banner Alert only for Trials, Overdue grace periods, or Expired accounts */}
      {isTrial && (
        <div className="p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold bg-amber-500/10 border-amber-500/20 text-amber-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              {isExpired
                ? "This trial period has expired. Account upgrade required to continue access."
                : `Trial period active: expires on ${targetDate.toLocaleDateString()} (${diffDays} days remaining).`}
            </span>
          </div>
          <span className="font-mono uppercase">{isExpired ? "Trial Expired" : "Trial Account"}</span>
        </div>
      )}

      {isPastDue && (
        <div className="p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold bg-rose-500/10 border-rose-500/20 text-rose-600">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Payment overdue since {new Date(subscription.nextRenewal).toLocaleDateString()}. Grace period ends on {targetDate.toLocaleDateString()}.
            </span>
          </div>
          <span className="font-mono uppercase">Action Required</span>
        </div>
      )}

      {isCancelled && (
        <div className="p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold bg-muted/60 border-muted text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>This subscription was cancelled. Platform access ended on {targetDate.toLocaleDateString()}.</span>
          </div>
          <span className="font-mono uppercase">Cancelled</span>
        </div>
      )}

      {/* Information */}
      <Card className="border shadow-2xs">
        <CardHeader>
          <CardTitle>Subscription Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <SubscriptionInfo
            label="Business / Tenant"
            value={subscription.organization}
          />

          <SubscriptionInfo
            label="Product Suite"
            value={subscription.product}
          />

          <SubscriptionInfo
            label="Plan Tier"
            value={subscription.tier || "Standard"}
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
            value={subscription.autoRenew ? "Enabled (Continuous)" : "Disabled"}
          />

          <SubscriptionInfo
            label="Subscription Started"
            value={new Date(subscription.startedAt).toLocaleDateString()}
          />

          <SubscriptionInfo
            label={isAutoRenewing ? "Next Billing / Renewal" : isPastDue ? "Due Date" : "Renewal Date"}
            value={new Date(subscription.nextRenewal).toLocaleDateString()}
          />

          <SubscriptionInfo
            label={isTrial ? "Trial Expiration" : isAutoRenewing ? "Term Type" : isCancelled ? "Access Terminated" : "Expiration Date"}
            value={isAutoRenewing ? "Continuous (Renews automatically)" : targetDate.toLocaleDateString()}
          />

          <SubscriptionInfo
            label="Lifecycle Status"
            value={
              isAutoRenewing
                ? "Active & Ongoing"
                : isTrial
                ? isExpired ? "Trial Expired" : `${diffDays} days remaining`
                : isPastDue
                ? "Payment Overdue"
                : isCancelled
                ? "Inactive"
                : isExpired ? "Expired" : `${diffDays} days remaining`
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
