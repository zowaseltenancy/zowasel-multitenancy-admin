"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";

import { Lead } from "@/types/lead";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";
import {
  updateLeadSchema,
  UpdateLeadFormValues,
  UpdateLeadSchema,
} from "@/schemas/lead.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (leadId: string, updates: Partial<Lead>) => void;
}

export default function EditLeadDialog({ lead, open, onOpenChange, onSave }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateLeadFormValues, unknown, UpdateLeadSchema>({
    resolver: zodResolver(updateLeadSchema),
  });

  const selectedSource = watch("source");

  useEffect(() => {
    if (lead && open) {
      reset({
        businessName: lead.businessName || "",
        contactName: lead.contactName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        source: lead.source || "referral",
        notes: lead.notes || "",
        // Merchant
        storeName: lead.storeName || "",
        posCount: lead.posCount !== undefined ? (lead.posCount as any) : "",
        monthlyVolume: lead.monthlyVolume !== undefined ? (lead.monthlyVolume as any) : "",
        outletLat: lead.outletLat !== undefined ? (lead.outletLat as any) : "",
        outletLng: lead.outletLng !== undefined ? (lead.outletLng as any) : "",
        // Agrodealer
        licenseNo: lead.licenseNo || "",
        storageMt: lead.storageMt !== undefined ? (lead.storageMt as any) : "",
        inputSpecialties: lead.inputSpecialties?.join(", ") || "",
        lgaCoverage: lead.lgaCoverage?.join(", ") || "",
        // Corporate
        cacNumber: lead.cacNumber || "",
        taxId: lead.taxId || "",
        annualTurnover: lead.annualTurnover !== undefined ? (lead.annualTurnover as any) : "",
        decisionMakerTitle: lead.decisionMakerTitle || "",
      });
    }
  }, [lead, open, reset]);

  if (!lead) return null;

  const onSubmit = (data: UpdateLeadSchema) => {
    const updates: Partial<Lead> = {
      businessName: data.businessName.trim(),
      contactName: data.contactName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      source: data.source,
      notes: data.notes?.trim() || undefined,
    };

    if (lead.intendedType === "merchant") {
      updates.storeName = data.storeName?.trim() || undefined;
      updates.posCount =
        typeof data.posCount === "number" && !isNaN(data.posCount)
          ? data.posCount
          : undefined;
      updates.monthlyVolume =
        typeof data.monthlyVolume === "number" && !isNaN(data.monthlyVolume)
          ? data.monthlyVolume
          : undefined;
      updates.outletLat =
        typeof data.outletLat === "number" && !isNaN(data.outletLat)
          ? data.outletLat
          : undefined;
      updates.outletLng =
        typeof data.outletLng === "number" && !isNaN(data.outletLng)
          ? data.outletLng
          : undefined;
    } else if (lead.intendedType === "agrodealer") {
      updates.licenseNo = data.licenseNo?.trim() || undefined;
      updates.storageMt =
        typeof data.storageMt === "number" && !isNaN(data.storageMt)
          ? data.storageMt
          : undefined;
      updates.inputSpecialties = data.inputSpecialties
        ? data.inputSpecialties
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;
      updates.lgaCoverage = data.lgaCoverage
        ? data.lgaCoverage
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;
    } else if (lead.intendedType === "cooperative" || lead.intendedType === "buyer") {
      updates.cacNumber = data.cacNumber?.trim() || undefined;
      updates.taxId = data.taxId?.trim() || undefined;
      updates.annualTurnover =
        typeof data.annualTurnover === "number" && !isNaN(data.annualTurnover)
          ? data.annualTurnover
          : undefined;
      updates.decisionMakerTitle = data.decisionMakerTitle?.trim() || undefined;
    }

    onSave(lead.id, updates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400">
              <Pencil className="h-3.5 w-3.5" />
            </div>
            <span>Edit Lead Information</span>
          </DialogTitle>
          <DialogDescription>
            Update contact, operational, and classification parameters for this lead.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Business Name</label>
            <Input
              {...register("businessName")}
              placeholder="Business Name"
              className={errors.businessName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.businessName && (
              <p className="mt-1 text-xs text-destructive">{errors.businessName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Contact Name</label>
              <Input
                {...register("contactName")}
                placeholder="Contact Name"
                className={errors.contactName ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.contactName && (
                <p className="mt-1 text-xs text-destructive">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Phone</label>
              <Input
                {...register("phone")}
                placeholder="e.g. +2348012345678"
                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Email</label>
              <Input
                type="email"
                {...register("email")}
                placeholder="email@example.com"
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Source</label>
              <Select
                value={selectedSource || lead.source}
                onValueChange={(val: Lead["source"]) => setValue("source", val, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(LEAD_SOURCE_LABELS) as Lead["source"][]).map((src) => (
                    <SelectItem key={src} value={src}>
                      {LEAD_SOURCE_LABELS[src]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Intended Entity Type</label>
            <Input
              value={LEAD_INTENDED_TYPE_LABELS[lead.intendedType]}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Entity type is locked to preserve classification integrity.
            </p>
          </div>

          {/* Merchant Fields */}
          {lead.intendedType === "merchant" && (
            <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Merchant Details
              </h4>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Store Name</label>
                <Input
                  {...register("storeName")}
                  placeholder="Store / Shop Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">POS Count</label>
                  <Input
                    type="number"
                    min="0"
                    {...register("posCount")}
                    placeholder="e.g. 2"
                    className={errors.posCount ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.posCount && (
                    <p className="mt-1 text-xs text-destructive">{errors.posCount.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Monthly Volume (₦)</label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    {...register("monthlyVolume")}
                    placeholder="e.g. 5000000"
                    className={errors.monthlyVolume ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.monthlyVolume && (
                    <p className="mt-1 text-xs text-destructive">{errors.monthlyVolume.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Outlet Latitude</label>
                  <Input
                    type="number"
                    step="any"
                    {...register("outletLat")}
                    placeholder="e.g. 6.5244"
                    className={errors.outletLat ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.outletLat && (
                    <p className="mt-1 text-xs text-destructive">{errors.outletLat.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Outlet Longitude</label>
                  <Input
                    type="number"
                    step="any"
                    {...register("outletLng")}
                    placeholder="e.g. 3.3792"
                    className={errors.outletLng ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.outletLng && (
                    <p className="mt-1 text-xs text-destructive">{errors.outletLng.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Agrodealer Fields */}
          {lead.intendedType === "agrodealer" && (
            <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Agrodealer Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">License No.</label>
                  <Input
                    {...register("licenseNo")}
                    placeholder="e.g. AG-2024-001"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Storage (MT)</label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    {...register("storageMt")}
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Input Specialties (comma separated)</label>
                <Input
                  {...register("inputSpecialties")}
                  placeholder="e.g. Seeds, Fertilizers, Agrochemicals"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">LGA Coverage (comma separated)</label>
                <Input
                  {...register("lgaCoverage")}
                  placeholder="e.g. Ikeja, Alimosho, Oshodi"
                />
              </div>
            </div>
          )}

          {/* Cooperative / Buyer Fields */}
          {(lead.intendedType === "cooperative" || lead.intendedType === "buyer") && (
            <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Corporate Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">CAC Number</label>
                  <Input
                    {...register("cacNumber")}
                    placeholder="e.g. RC-1234567"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tax ID</label>
                  <Input
                    {...register("taxId")}
                    placeholder="e.g. 10293847-0001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Annual Turnover (₦)</label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    {...register("annualTurnover")}
                    placeholder="e.g. 25000000"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Decision Maker Title</label>
                  <Input
                    {...register("decisionMakerTitle")}
                    placeholder="e.g. Managing Director"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Notes</label>
            <Textarea
              {...register("notes")}
              rows={3}
              placeholder="Internal operator notes..."
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
