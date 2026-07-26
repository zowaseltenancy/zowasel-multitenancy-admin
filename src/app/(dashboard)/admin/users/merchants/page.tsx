import { Store } from "lucide-react";

import ComingSoonPanel from "@/components/shared/ComingSoonPanel";

export default function MerchantUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Merchants
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Marketplace merchant accounts.
        </p>
      </div>

      <ComingSoonPanel
        icon={Store}
        title="Merchant visibility is coming soon"
        description="Merchant accounts belong to Marketplace — this view will surface them read-only once the central user API is available."
      />
    </div>
  );
}
