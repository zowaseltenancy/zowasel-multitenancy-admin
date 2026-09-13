"use client";

import React from "react";
import {
  Building2,
  Mail,
  Phone,
  Tag,
  Compass,
  Globe2,
  CalendarDays,
  User,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DetailField from "@/components/shared/DetailField";
import { Lead } from "@/types/lead";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";

interface Props {
  lead: Lead;
  onEdit: () => void;
}

export default function LeadInformationCard({ lead, onEdit }: Props) {
  const regionLabel = [lead.countryName, lead.subRegion, lead.continent]
    .filter(Boolean)
    .join(" / ");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400">
            <Building2 className="h-4 w-4" />
          </div>
          <span>Lead Information</span>
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-900/50"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <DetailField
          icon={User}
          label="Contact Name"
          value={lead.contactName}
          iconClassName="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
        />
        <DetailField
          icon={Mail}
          label="Email"
          value={lead.email}
          iconClassName="bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400"
        />
        <DetailField
          icon={Phone}
          label="Phone"
          value={lead.phone}
          iconClassName="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
        />
        <DetailField
          icon={Tag}
          label="Intended Entity Type"
          value={LEAD_INTENDED_TYPE_LABELS[lead.intendedType]}
          iconClassName="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
        />
        <DetailField
          icon={Compass}
          label="Source"
          value={LEAD_SOURCE_LABELS[lead.source]}
          iconClassName="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400"
        />
        <DetailField
          icon={Globe2}
          label="Region"
          value={regionLabel}
          iconClassName="bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400"
        />
        <DetailField
          icon={CalendarDays}
          label="Created"
          value={new Date(lead.createdAt).toLocaleDateString()}
          iconClassName="bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"
        />
      </CardContent>
    </Card>
  );
}
