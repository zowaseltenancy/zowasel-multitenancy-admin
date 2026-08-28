"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";

import {
  createLeadSchema,
  CreateLeadFormValues,
  CreateLeadSchema,
} from "@/schemas/lead.schema";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Receives the validated form values; the caller POSTs them. */
  onCreate: (values: CreateLeadSchema) => void;
  isSubmitting?: boolean;
}

// POST /admin/leads validates `typeMetadata` strictly, per classification — so
// the fields below are not decoration: without them the request 422s. Which
// group shows depends on the selected intended type.
//
// `notes` and `countryCode` are collected but have no home on the API's lead
// payload; they stay for the operator's benefit and are dropped on submit.
export default function AddLeadDialog({ open, onOpenChange, onCreate, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateLeadFormValues, unknown, CreateLeadSchema>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      intendedType: "merchant",
      source: "referral",
      countryCode: "",
      notes: "",
    } as CreateLeadFormValues,
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const intendedType = watch("intendedType");
  // cooperative and buyer both post as CORPORATE.
  const isCorporate = intendedType === "cooperative" || intendedType === "buyer";

  // The union means a field's error is only present on the matching variant, so
  // reading them off the record needs a widened view.
  const fieldError = (name: string): string | undefined =>
    (errors as Record<string, { message?: string } | undefined>)[name]?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Add Lead
          </DialogTitle>
          <DialogDescription>
            Capture a new prospective tenant lead into the pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((values) => onCreate(values))} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Business Name</label>
            <Input {...register("businessName")} placeholder="Zaria Grain Traders" />
            {fieldError("businessName") && (
              <p className="mt-1 text-xs text-destructive">{fieldError("businessName")}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Contact Name</label>
              <Input {...register("contactName")} placeholder="Musa Abdullahi" />
              {fieldError("contactName") && (
                <p className="mt-1 text-xs text-destructive">{fieldError("contactName")}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Phone</label>
              <Input {...register("phone")} placeholder="+234 806 112 3344" />
              {fieldError("phone") && (
                <p className="mt-1 text-xs text-destructive">{fieldError("phone")}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <Input {...register("email")} placeholder="musa@zariagrain.com" />
            {fieldError("email") && (
              <p className="mt-1 text-xs text-destructive">{fieldError("email")}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Intended Type</label>
              <Select
                value={intendedType}
                onValueChange={(value) =>
                  setValue("intendedType", value as CreateLeadFormValues["intendedType"], {
                    shouldValidate: false,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_INTENDED_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Source</label>
              <Select
                value={watch("source")}
                onValueChange={(value) =>
                  setValue("source", value as CreateLeadFormValues["source"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_SOURCE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Classification details, required by the API ── */}
          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs font-semibold text-foreground">
              {LEAD_INTENDED_TYPE_LABELS[intendedType]} details
            </p>

            {intendedType === "merchant" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Store Name</label>
                  <Input {...register("storeName")} placeholder="Mama Ngozi Stores" />
                  {fieldError("storeName") && (
                    <p className="mt-1 text-xs text-destructive">{fieldError("storeName")}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Outlet Latitude</label>
                    <Input type="number" step="any" {...register("outletLat")} placeholder="6.5244" />
                    {fieldError("outletLat") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("outletLat")}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Outlet Longitude</label>
                    <Input type="number" step="any" {...register("outletLng")} placeholder="3.3792" />
                    {fieldError("outletLng") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("outletLng")}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">POS Count</label>
                    <Input type="number" {...register("posCount")} placeholder="3" />
                    {fieldError("posCount") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("posCount")}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Monthly Volume</label>
                    <Input type="number" step="any" {...register("monthlyVolume")} placeholder="850000" />
                    {fieldError("monthlyVolume") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("monthlyVolume")}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {intendedType === "agrodealer" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">License No.</label>
                    <Input {...register("licenseNo")} placeholder="AGD-2026-00123" />
                    {fieldError("licenseNo") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("licenseNo")}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Storage (MT)</label>
                    <Input type="number" step="any" {...register("storageMt")} placeholder="500" />
                    {fieldError("storageMt") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("storageMt")}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Input Specialties <span className="font-normal">(comma separated)</span>
                  </label>
                  <Input {...register("inputSpecialties")} placeholder="Fertilizer, Seeds" />
                  {fieldError("inputSpecialties") && (
                    <p className="mt-1 text-xs text-destructive">{fieldError("inputSpecialties")}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    LGA Coverage <span className="font-normal">(comma separated)</span>
                  </label>
                  <Input {...register("lgaCoverage")} placeholder="Kano Municipal, Fagge" />
                  {fieldError("lgaCoverage") && (
                    <p className="mt-1 text-xs text-destructive">{fieldError("lgaCoverage")}</p>
                  )}
                </div>
              </>
            )}

            {isCorporate && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CAC Number</label>
                    <Input {...register("cacNumber")} placeholder="RC1234567" />
                    {fieldError("cacNumber") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("cacNumber")}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Tax ID</label>
                    <Input {...register("taxId")} placeholder="TIN-0001112223" />
                    {fieldError("taxId") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("taxId")}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Annual Turnover</label>
                    <Input type="number" step="any" {...register("annualTurnover")} placeholder="250000000" />
                    {fieldError("annualTurnover") && (
                      <p className="mt-1 text-xs text-destructive">{fieldError("annualTurnover")}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Decision Maker Title <span className="font-normal">(optional)</span>
                    </label>
                    <Input {...register("decisionMakerTitle")} placeholder="Managing Director" />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  The contact name above is recorded as the decision maker.
                </p>
              </>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Country</label>
            <Select
              value={watch("countryCode")}
              onValueChange={(value) => setValue("countryCode", value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {GLOBAL_COUNTRY_CURRENCIES.map((c) => (
                  <SelectItem key={c.countryCode} value={c.countryCode}>
                    {c.countryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("countryCode") && (
              <p className="mt-1 text-xs text-destructive">{fieldError("countryCode")}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Notes (optional)</label>
            <Textarea {...register("notes")} placeholder="How this lead came in, current status..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Adding…
                </>
              ) : (
                "Add Lead"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
