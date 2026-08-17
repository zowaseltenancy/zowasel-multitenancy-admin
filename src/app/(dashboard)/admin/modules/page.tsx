import ModulesLandingView from "@/features/modules/components/ModulesLandingView";
import ProductNavTabs from "@/features/modules/components/ProductNavTabs";

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Modules</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Configure product modules, functional capabilities, and subscription tiers.
        </p>
      </div>

      <ProductNavTabs />
      <ModulesLandingView />
    </div>
  );
}
