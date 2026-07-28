import Link from "next/link";
import { ArrowRight, Calendar, Shield } from "lucide-react";
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

  return (
    <Link href={`/admin/billing/subscriptions/${subscription.id}`}>
      <Card
        className={cn(
          "group h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border",
          getCardStatusStyles(subscription.status)
        )}
      >
        <CardContent className="flex h-full flex-col gap-5 p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{subscription.organization}</h3>
                {subscription.tier && (
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-2.5 w-2.5 mr-1" /> {subscription.tier}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{subscription.product}</p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 shrink-0" />
          </div>

          {/* Amount */}
          <div>
            <p className="text-2xl font-bold">
              {subscription.currency} {subscription.amount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              per {subscription.billingCycle.toLowerCase()}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto space-y-3 border-t border-border/60 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Next Renewal
              </span>

              <span className="font-medium">
                {new Date(subscription.nextRenewal).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <SubscriptionStatusBadge status={subscription.status} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
