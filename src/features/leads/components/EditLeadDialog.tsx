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
import LeadClassificationFields, { FormField } from "./LeadClassificationFields";

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
          <FormField label="Business Name" error={errors.businessName?.message}>
            <Input
              {...register("businessName")}
              placeholder="Business Name"
              className={errors.businessName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Contact Name" error={errors.contactName?.message}>
              <Input
                {...register("contactName")}
                placeholder="Contact Name"
                className={errors.contactName ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            </FormField>

            <FormField label="Phone" error={errors.phone?.message}>
              <Input
                {...register("phone")}
                placeholder="e.g. +2348012345678"
                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email" error={errors.email?.message}>
              <Input
                type="email"
                {...register("email")}
                placeholder="email@example.com"
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            </FormField>

            <FormField label="Source">
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
            </FormField>
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

          {/* Classification details (Merchant, Agrodealer, Corporate) */}
          <LeadClassificationFields
            intendedType={lead.intendedType}
            register={register}
            errors={errors}
          />

          <FormField label="Notes">
            <Textarea
              {...register("notes")}
              rows={3}
              placeholder="Internal operator notes..."
            />
          </FormField>

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
