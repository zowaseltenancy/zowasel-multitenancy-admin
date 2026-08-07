"use client";

import { useState } from "react";
import { Layers, Plus, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useModulePlans } from "../hooks/useModulePlans";
import { useModules } from "../hooks/useModules";
import PlanDialog from "./PlanDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModulePlan, ModuleProduct } from "@/types/module";
import { CreatePlanFormValues } from "@/schemas/module.schema";

interface Props {
  product: ModuleProduct;
}

// Plans already defined (seeded from real Billing/Organization data) are
// listed here so they can be edited, not just displayed — plus a Create
// Plan action for genuinely new ones. À la carte per-module pricing stays
// fully separate; a plan is a bundle layered on top, not a replacement.
export default function PlansSection({ product }: Props) {
  const { plans, createPlan, updatePlan, togglePlanActive } = useModulePlans(product);
  const { modules } = useModules(product);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ModulePlan | null>(null);

  const moduleName = (id: string) => modules.find((m) => m.id === id)?.name ?? id;

  const handleSubmit = (values: CreatePlanFormValues) => {
    if (editingPlan) {
      updatePlan(editingPlan.id, values);
      toast.success(`Plan "${values.name}" updated.`);
    } else {
      createPlan(values);
      toast.success(`Plan "${values.name}" created.`);
    }
    setEditingPlan(null);
  };

  return (
    <Card className="border shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Plans
          </CardTitle>
          <CardDescription className="text-xs">
            Bundles of this product&rsquo;s modules at a fixed price — separate from buying a module à la carte.
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setEditingPlan(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" /> Create Plan
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {plans.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-6 text-center">
            No plans defined for this product yet.
          </p>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{plan.name}</span>
                  {plan.isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground border">
                      <XCircle className="h-3 w-3" /> Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-foreground">
                    ${plan.pricePerMonth}/mo
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] gap-1"
                    onClick={() => {
                      setEditingPlan(plan);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px]"
                    onClick={() => togglePlanActive(plan.id, !plan.isActive)}
                  >
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {plan.includedModuleIds.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground italic">No modules included</span>
                ) : (
                  plan.includedModuleIds.map((id) => (
                    <span key={id} className="rounded-full border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {moduleName(id)}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>

      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={product}
        availableModules={modules}
        onSubmitPlan={handleSubmit}
        initialValues={
          editingPlan
            ? {
                product: editingPlan.product,
                name: editingPlan.name,
                description: editingPlan.description,
                pricePerMonth: editingPlan.pricePerMonth,
                includedModuleIds: editingPlan.includedModuleIds,
              }
            : undefined
        }
        title={editingPlan ? `Edit Plan — ${editingPlan.name}` : "Create Plan"}
      />
    </Card>
  );
}
