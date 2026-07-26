import { LayoutGrid } from "lucide-react";

import ComingSoonPanel from "@/components/shared/ComingSoonPanel";

export default function InstalledModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Installed Modules
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Modules currently active across tenants.
        </p>
      </div>

      <ComingSoonPanel
        icon={LayoutGrid}
        title="Module management is being rebuilt"
        description="The full CropPilot module catalog, per-tenant activation, and pricing controls are coming to this section soon."
      />
    </div>
  );
}
