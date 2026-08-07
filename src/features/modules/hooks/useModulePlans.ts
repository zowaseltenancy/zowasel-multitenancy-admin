"use client";

import { useState } from "react";
import { ModulePlan, ModuleProduct } from "@/types/module";
import { mockModulePlans } from "../data/mockModulePlans";

interface CreatePlanInput {
  product: ModuleProduct | "platform";
  name: string;
  description: string;
  pricePerMonth: number;
  includedModuleIds: string[];
}

// Plans that were already defined (seeded from real Billing/Organization
// data) live here so they can be edited, not just displayed — plus a
// Create Plan path for genuinely new ones. À la carte per-module pricing
// stays fully separate; a plan is a bundle layered on top, not a replacement.
export function useModulePlans(product?: ModuleProduct | "platform") {
  const [plans, setPlans] = useState<ModulePlan[]>(mockModulePlans);

  const scopedPlans = product ? plans.filter((p) => p.product === product) : plans;

  const createPlan = (data: CreatePlanInput) => {
    const newPlan: ModulePlan = {
      id: `plan_${Date.now()}`,
      ...data,
      isActive: true,
      createdBy: "admin",
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => [...prev, newPlan]);
    return newPlan;
  };

  const updatePlan = (planId: string, data: Partial<CreatePlanInput>) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  const togglePlanActive = (planId: string, isActive: boolean) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isActive, updatedAt: new Date().toISOString() } : p))
    );
  };

  return { plans: scopedPlans, allPlans: plans, createPlan, updatePlan, togglePlanActive };
}
