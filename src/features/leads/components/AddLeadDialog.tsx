"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";

import { createLeadSchema, CreateLeadSchema } from "@/schemas/lead.schema";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { Lead } from "@/types/lead";

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
  onCreate: (lead: Lead) => void;
}

export default function AddLeadDialog({ open, onOpenChange, onCreate }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadSchema>({
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
    },
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (values: CreateLeadSchema) => {
    const country = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === values.countryCode);

    const lead: Lead = {
      id: `lead_${Date.now()}`,
      businessName: values.businessName,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      intendedType: values.intendedType,
      source: values.source,
      status: "incomplete",
      missingFields: ["Business registration document", "Bank details"],
      notes: values.notes,
      countryCode: country?.countryCode,
      countryName: country?.countryName,
      subRegion: country?.subRegion,
      continent: country?.continent,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreate(lead);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Add Lead
          </DialogTitle>
          <DialogDescription>
            Capture a new prospective tenant lead into the pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Business Name</label>
            <Input {...register("businessName")} placeholder="Zaria Grain Traders" />
            {errors.businessName && (
              <p className="mt-1 text-xs text-destructive">{errors.businessName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Contact Name</label>
              <Input {...register("contactName")} placeholder="Musa Abdullahi" />
              {errors.contactName && (
                <p className="mt-1 text-xs text-destructive">{errors.contactName.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Phone</label>
              <Input {...register("phone")} placeholder="+234 806 112 3344" />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <Input {...register("email")} placeholder="musa@zariagrain.com" />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Intended Type</label>
              <Select
                value={watch("intendedType")}
                onValueChange={(value) =>
                  setValue("intendedType", value as CreateLeadSchema["intendedType"])
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
                onValueChange={(value) => setValue("source", value as CreateLeadSchema["source"])}
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
            {errors.countryCode && (
              <p className="mt-1 text-xs text-destructive">{errors.countryCode.message}</p>
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
              Add Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
