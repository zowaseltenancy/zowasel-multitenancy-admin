import { Sprout } from "lucide-react";

import ComingSoonPanel from "@/components/shared/ComingSoonPanel";

export default function FarmerUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Farmers
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Farmer accounts across CropPilot tenants.
        </p>
      </div>

      <ComingSoonPanel
        icon={Sprout}
        title="Farmer visibility is coming soon"
        description="Farmer records belong to CropPilot, not this admin panel — this view will surface them read-only once the central user API is available."
      />
    </div>
  );
}
