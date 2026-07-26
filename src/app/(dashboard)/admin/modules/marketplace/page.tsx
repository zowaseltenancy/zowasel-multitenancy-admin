import { Store } from "lucide-react";

import ComingSoonPanel from "@/components/shared/ComingSoonPanel";

export default function ModuleMarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Module Marketplace
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse the full CropPilot module catalog and configure pricing.
        </p>
      </div>

      <ComingSoonPanel
        icon={Store}
        title="Catalog browsing is coming soon"
        description="This will list every CropPilot module across all categories, with free/paid state and per-tenant pricing overrides."
      />
    </div>
  );
}
