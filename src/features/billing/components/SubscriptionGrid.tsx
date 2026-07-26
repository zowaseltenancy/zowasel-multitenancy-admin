import { Subscription } from "@/types/subscription";

import SubscriptionCard from "./SubscriptionCard";

interface Props {
  subscriptions: Subscription[];
}

export default function SubscriptionGrid({
  subscriptions,
}: Props) {
  if (subscriptions.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No subscriptions match this filter.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
        />
      ))}
    </div>
  );
}
