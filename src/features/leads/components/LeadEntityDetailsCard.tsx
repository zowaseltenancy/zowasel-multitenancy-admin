"use client";

import React from "react";
import {
  Store,
  MapPin,
  CreditCard,
  TrendingUp,
  Navigation,
  FileText,
  Warehouse,
  Sprout,
  Receipt,
  UserCheck,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailField from "@/components/shared/DetailField";
import { Lead } from "@/types/lead";
import { LEAD_INTENDED_TYPE_LABELS } from "@/constants/lead";

interface Props {
  lead: Lead;
}

export default function LeadEntityDetailsCard({ lead }: Props) {
  if (lead.intendedType === "merchant") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/10 text-orange-600 border border-orange-500/20 dark:text-orange-400">
              <Store className="h-4 w-4" />
            </div>
            <span>Merchant Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <DetailField
            icon={Store}
            label="Store Name"
            value={lead.storeName || lead.businessName}
            iconClassName="bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400"
          />
          <DetailField
            icon={CreditCard}
            label="POS Count"
            value={lead.posCount !== undefined ? String(lead.posCount) : null}
            iconClassName="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
          />
          <DetailField
            icon={TrendingUp}
            label="Monthly Volume"
            value={
              lead.monthlyVolume !== undefined
                ? `₦${lead.monthlyVolume.toLocaleString()}`
                : null
            }
            iconClassName="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
          />
          <DetailField
            icon={MapPin}
            label="Outlet Latitude"
            value={lead.outletLat !== undefined ? String(lead.outletLat) : null}
            iconClassName="bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
          />
          <DetailField
            icon={Navigation}
            label="Outlet Longitude"
            value={lead.outletLng !== undefined ? String(lead.outletLng) : null}
            iconClassName="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400"
          />
        </CardContent>
      </Card>
    );
  }

  if (lead.intendedType === "agrodealer") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
              <Sprout className="h-4 w-4" />
            </div>
            <span>Agrodealer Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <DetailField
            icon={FileText}
            label="License No."
            value={lead.licenseNo}
            iconClassName="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
          />
          <DetailField
            icon={Warehouse}
            label="Storage (MT)"
            value={lead.storageMt !== undefined ? `${lead.storageMt} MT` : null}
            iconClassName="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
          />
          <DetailField
            icon={Sprout}
            label="Input Specialties"
            value={lead.inputSpecialties?.join(", ")}
            iconClassName="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
          />
          <DetailField
            icon={MapPin}
            label="LGA Coverage"
            value={lead.lgaCoverage?.join(", ")}
            iconClassName="bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400"
          />
        </CardContent>
      </Card>
    );
  }

  if (lead.intendedType === "cooperative" || lead.intendedType === "buyer") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
            <span>{LEAD_INTENDED_TYPE_LABELS[lead.intendedType]} Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <DetailField
            icon={FileText}
            label="CAC Number"
            value={lead.cacNumber}
            iconClassName="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
          />
          <DetailField
            icon={Receipt}
            label="Tax ID"
            value={lead.taxId}
            iconClassName="bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400"
          />
          <DetailField
            icon={TrendingUp}
            label="Annual Turnover"
            value={
              lead.annualTurnover !== undefined
                ? `₦${lead.annualTurnover.toLocaleString()}`
                : null
            }
            iconClassName="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
          />
          <DetailField
            icon={UserCheck}
            label="Decision Maker Title"
            value={lead.decisionMakerTitle}
            iconClassName="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400"
          />
        </CardContent>
      </Card>
    );
  }

  return null;
}
