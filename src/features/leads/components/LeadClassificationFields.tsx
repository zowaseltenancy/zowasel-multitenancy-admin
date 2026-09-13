"use client";

import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Lead } from "@/types/lead";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface Props {
  intendedType: Lead["intendedType"];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function LeadClassificationFields({
  intendedType,
  register,
  errors,
}: Props) {
  const err = (name: string) => (errors[name]?.message as string | undefined);

  if (intendedType === "merchant") {
    return (
      <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Merchant Details
        </h4>
        <FormField label="Store Name" error={err("storeName")}>
          <Input {...register("storeName")} placeholder="Store / Shop Name" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="POS Count" error={err("posCount")}>
            <Input
              type="number"
              min="0"
              {...register("posCount")}
              placeholder="e.g. 2"
              className={err("posCount") ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </FormField>
          <FormField label="Monthly Volume (₦)" error={err("monthlyVolume")}>
            <Input
              type="number"
              min="0"
              step="any"
              {...register("monthlyVolume")}
              placeholder="e.g. 5000000"
              className={err("monthlyVolume") ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Outlet Latitude" error={err("outletLat")}>
            <Input
              type="number"
              step="any"
              {...register("outletLat")}
              placeholder="e.g. 6.5244"
              className={err("outletLat") ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </FormField>
          <FormField label="Outlet Longitude" error={err("outletLng")}>
            <Input
              type="number"
              step="any"
              {...register("outletLng")}
              placeholder="e.g. 3.3792"
              className={err("outletLng") ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </FormField>
        </div>
      </div>
    );
  }

  if (intendedType === "agrodealer") {
    return (
      <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Agrodealer Details
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="License No." error={err("licenseNo")}>
            <Input {...register("licenseNo")} placeholder="e.g. AG-2024-001" />
          </FormField>
          <FormField label="Storage (MT)" error={err("storageMt")}>
            <Input
              type="number"
              min="0"
              step="any"
              {...register("storageMt")}
              placeholder="e.g. 50"
            />
          </FormField>
        </div>
        <FormField label="Input Specialties (comma separated)" error={err("inputSpecialties")}>
          <Input
            {...register("inputSpecialties")}
            placeholder="e.g. Seeds, Fertilizers, Agrochemicals"
          />
        </FormField>
        <FormField label="LGA Coverage (comma separated)" error={err("lgaCoverage")}>
          <Input
            {...register("lgaCoverage")}
            placeholder="e.g. Ikeja, Alimosho, Oshodi"
          />
        </FormField>
      </div>
    );
  }

  if (intendedType === "cooperative" || intendedType === "buyer") {
    return (
      <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Corporate Details
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="CAC Number" error={err("cacNumber")}>
            <Input {...register("cacNumber")} placeholder="e.g. RC-1234567" />
          </FormField>
          <FormField label="Tax ID" error={err("taxId")}>
            <Input {...register("taxId")} placeholder="e.g. 10293847-0001" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Annual Turnover (₦)" error={err("annualTurnover")}>
            <Input
              type="number"
              min="0"
              step="any"
              {...register("annualTurnover")}
              placeholder="e.g. 25000000"
            />
          </FormField>
          <FormField label="Decision Maker Title" error={err("decisionMakerTitle")}>
            <Input
              {...register("decisionMakerTitle")}
              placeholder="e.g. Managing Director"
            />
          </FormField>
        </div>
      </div>
    );
  }

  return null;
}
