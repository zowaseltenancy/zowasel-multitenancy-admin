"use client";

import Link from "next/link";
import { Sprout, Store, CreditCard, ArrowRight, Package, Layers, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useModules } from "../hooks/useModules";
import { useModulePlans } from "../hooks/useModulePlans";
import { ModuleProduct } from "@/types/module";

const PRODUCTS: { key: ModuleProduct; label: string; icon: typeof Sprout; description: string }[] = [
  {
    key: "croppilot",
    label: "CropPilot",
    icon: Sprout,
    description: "Farm registry, compliance monitoring, and carbon & sustainability tracking.",
  },
  {
    key: "marketplace",
    label: "Marketplace",
    icon: Store,
    description: "Commodity listings, trading, and market analytics.",
  },
  {
    key: "acess",
    label: "ACESS",
    icon: CreditCard,
    description: "Credit and portfolio modules — none built yet.",
  },
];

// The overview page's job now: total modules, the per-product breakdown,
// and how many modules/plans exist — real counts, not fabricated ones.
// "Shared modules between products" isn't rendered here — it's not a
// confirmed requirement (per Busayo, Aug 7), and the current data model
// can't express it (one product per module) without a schema change.
export default function ModulesLandingView() {
  const { modules: allModules } = useModules();
  const { allPlans } = useModulePlans();

  const totalModules = allModules.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Modules</p>
              <Package className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{totalModules}</p>
            <p className="mt-1 text-xs text-muted-foreground font-semibold">Core + sub-modules, across all products</p>
          </CardContent>
        </Card>
        <Card className="border shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plans Configured</p>
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{allPlans.length}</p>
            <p className="mt-1 text-xs text-muted-foreground font-semibold">
              {allPlans.filter((p) => p.isActive).length} active
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Not In Any Plan</p>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">
              {
                allModules.filter(
                  (m) => !allPlans.some((p) => p.includedModuleIds.includes(m.id))
                ).length
              }
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-semibold">Only reachable à la carte</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PRODUCTS.map((p) => {
          const productModules = allModules.filter((m) => m.product === p.key);
          const coreCount = productModules.filter((m) => m.parentId === null).length;
          const subCount = productModules.length - coreCount;
          const productPlans = allPlans.filter((plan) => plan.product === p.key);
          const Icon = p.icon;

          return (
            <Link key={p.key} href={`/admin/modules/products/${p.key}`} className="group">
              <Card className="border hover:border-primary transition-all shadow-2xs cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-primary/10 p-3 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{p.label}</h3>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground border-t pt-3">
                    <span>{coreCount} core</span>
                    <span>{subCount} sub</span>
                    <span>{productPlans.length} plans</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
