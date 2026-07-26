import { Users } from "lucide-react";

import ComingSoonPanel from "@/components/shared/ComingSoonPanel";

export default function BuyerUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Buyers
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Marketplace buyer accounts.
        </p>
      </div>

      <ComingSoonPanel
        icon={Users}
        title="Buyer visibility is coming soon"
        description="Buyer accounts belong to Marketplace — this view will surface them read-only once the central user API is available."
      />
    </div>
  );
}
