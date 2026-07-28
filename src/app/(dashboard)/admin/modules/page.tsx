import ModulesOverviewView from "@/features/modules/components/ModulesOverviewView";

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Module Management</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Configure CropPilot core modules, global pricing tiers, sub-modules, and per-tenant feature activations.
        </p>
      </div>

      <ModulesOverviewView />
    </div>
  );
}
