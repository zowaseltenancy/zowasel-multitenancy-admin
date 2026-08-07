"use client";

import { Sprout, Store, CreditCard } from "lucide-react";
import ProductNavTabs from "./ProductNavTabs";
import ModulesOverviewView from "./ModulesOverviewView";
import PlansSection from "./PlansSection";
import { ModuleProduct } from "@/types/module";

const PRODUCT_META: Record<ModuleProduct, { label: string; icon: typeof Sprout; description: string }> = {
  croppilot: {
    label: "CropPilot",
    icon: Sprout,
    description: "Farm registry, compliance monitoring, and carbon & sustainability tracking.",
  },
  marketplace: {
    label: "Marketplace",
    icon: Store,
    description: "Commodity listings, trading, and market analytics.",
  },
  acess: {
    label: "ACESS",
    icon: CreditCard,
    description: "Credit and portfolio modules — real entry point, no fabricated catalog yet.",
  },
};

interface Props {
  product: ModuleProduct;
}

export default function ProductDetailView({ product }: Props) {
  const meta = PRODUCT_META[product];
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-primary/10 p-3 text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{meta.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
        </div>
      </div>

      <ProductNavTabs />

      {/* Search, refresh, and Create Core Module all stay visible even at
          zero modules — a real, usable entry point, not a "coming soon"
          wall. ModulesOverviewView's own empty state already says so. */}
      <ModulesOverviewView product={product} />

      <PlansSection product={product} />
    </div>
  );
}
