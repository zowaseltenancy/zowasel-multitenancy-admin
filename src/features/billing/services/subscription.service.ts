import { mockSubscriptions } from "../data/mockSubscriptions";
import { Subscription } from "@/types/subscription";

export const subscriptionService = {
  getSubscriptions(): Subscription[] {
    return mockSubscriptions;
  },

  getSubscriptionById(
    id: string
  ): Subscription | undefined {
    return mockSubscriptions.find(
      (subscription) => subscription.id === id
    );
  },
};
