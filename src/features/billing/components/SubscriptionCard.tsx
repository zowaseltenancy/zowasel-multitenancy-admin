import Link from "next/link";
import { ArrowRight, Calendar, Shield, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SubscriptionStatusBadge from "./SubscriptionStatusBadge";
import { Subscription } from "@/types/subscription";
import { cn } from "@/lib/utils";

interface Props {
  subscription: Subscription;
}

export default function SubscriptionCard({ subscription }: Props) {
  const getCardStatusStyles = (status: Subscription["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/5";
      case "Trial":
        return "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/5";
      case "Past Due":
        return "bg-red-500/5 dark:bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:shadow-red-500/10";
      case "Cancelled":
      default:
        return "bg-card border-border hover:border-muted-foreground/30";
    }
  };

  const isAutoRenewing = subscription.status === "Active" && subscription.autoRenew;
  const isTrial = subscription.status === "Trial";
  const isPastDue = subscription.status === "Past Due";
  const isCancelled = subscription.status === "Cancelled";
  const isFixedTermActive = subscription.status === "Active" && !subscription.autoRenew;

  // Each status reads its own real field now — no longer four labels
  // relabeling the same `expiresAt` value.
  const trialEndDate = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const gracePeriodEndDate = subscription.gracePeriodEndsAt ? new Date(subscription.gracePeriodEndsAt) : null;
  const accessEndedDate = subscription.accessEndedAt ? new Date(subscription.accessEndedAt) : null;
  const fixedTermExpiryDate = subscription.expiresAt ? new Date(subscription.expiresAt) : null;

  const now = new Date();
  const relevantDate = trialEndDate ?? gracePeriodEndDate ?? fixedTermExpiryDate;
  const diffDays = relevantDate ? Math.ceil((relevantDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isExpired = relevantDate ? diffDays <= 0 : false;

  return (
    <Link href={`/admin/billing/subscriptions/${subscription.id}`}>
      <Card
        className={cn(
          "group h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border cursor-pointer",
          getCardStatusStyles(subscription.status)
        )}
      >
        <CardContent className="flex h-full flex-col gap-5 p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-bold text-foreground">{subscription.organization}</h3>
                {subscription.tier && (
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-2.5 w-2.5 mr-1" /> {subscription.tier}
                  </Badge>
                )}
              </div>
              <p className="text-xs font-semibold text-muted-foreground line-clamp-1">{subscription.product}</p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 shrink-0" />
          </div>

          {/* Amount */}
          <div>
            <p className="text-2xl font-extrabold font-mono">
              {subscription.currency} {subscription.amount.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">
              per {subscription.billingCycle.toLowerCase()}
            </p>
          </div>

          {/* Footer with Proper Billing Lifecycle Dates */}
          <div className="mt-auto space-y-2.5 border-t border-border/60 pt-4 text-xs font-semibold">
            {/* Auto-renewing Active Subscription */}
            {isAutoRenewing && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Next Renewal
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {new Date(subscription.nextRenewal).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                    Renewal Mode
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    Continuous ({subscription.billingCycle})
                  </span>
                </div>
              </>
            )}

            {/* Trial Subscription */}
            {isTrial && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Trial Ends
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {trialEndDate ? trialEndDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    Time Remaining
                  </span>
                  <span className="text-[11px] font-bold text-amber-600">
                    {isExpired ? "Trial Expired" : `${diffDays} days left`}
                  </span>
                </div>
              </>
            )}

            {/* Past Due Subscription */}
            {isPastDue && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Due Since
                  </span>
                  <span className="font-mono font-bold text-rose-600">
                    {new Date(subscription.nextRenewal).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                    Grace Period Ends
                  </span>
                  <span className="font-mono font-bold text-rose-600">
                    {gracePeriodEndDate ? gracePeriodEndDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                </div>
              </>
            )}

            {/* Cancelled Subscription */}
            {isCancelled && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Access Ended
                  </span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {accessEndedDate ? accessEndedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Inactive / Cancelled
                  </span>
                </div>
              </>
            )}

            {/* Fixed-term non-auto-renewing active plan */}
            {isFixedTermActive && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Expires On
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {fixedTermExpiryDate ? fixedTermExpiryDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Renewal</span>
                  <span className="text-[11px] font-bold text-amber-600">
                    Manual Renewal Required
                  </span>
                </div>
              </>
            )}

            {/* Status Badge & Indicator */}
            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <SubscriptionStatusBadge status={subscription.status} />

              {isAutoRenewing ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <RefreshCw className="h-2.5 w-2.5" /> Auto-Renews
                </span>
              ) : isTrial ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Clock className="h-2.5 w-2.5" /> Trial ({diffDays}d)
                </span>
              ) : isPastDue ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                  <AlertCircle className="h-2.5 w-2.5" /> Payment Overdue
                </span>
              ) : (
                <span className="text-[10px] font-bold text-muted-foreground">
                  Cancelled
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
