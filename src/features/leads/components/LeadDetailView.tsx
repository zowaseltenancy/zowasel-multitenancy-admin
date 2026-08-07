"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  Globe2,
  CalendarDays,
  Tag,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePageHeader } from "@/components/layout/PageHeaderContext";
import LeadStatusBadge from "./LeadStatusBadge";
import ConvertLeadDialog from "./ConvertLeadDialog";
import RemoveLeadDialog from "./RemoveLeadDialog";
import { useLeads } from "../hooks/useLeads";
import { useLeadConversion } from "../hooks/useLeadConversion";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";

interface Props {
  leadId: string;
}

function Field({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-medium text-foreground">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function LeadDetailView({ leadId }: Props) {
  const router = useRouter();
  const { leads, markLost, removeLead } = useLeads();
  const { convert } = useLeadConversion();
  const [convertOpen, setConvertOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const removingRef = useRef(false);

  const lead = leads.find((l) => l.id === leadId);

  usePageHeader(lead?.businessName ?? "Lead", lead ? LEAD_INTENDED_TYPE_LABELS[lead.intendedType] : undefined);

  if (!lead) {
    // Removing this lead clears it from state before the redirect lands —
    // render nothing instead of a flash of the 404 page while navigating away.
    // eslint-disable-next-line react-hooks/refs
    if (removingRef.current) {
      return null;
    }
    notFound();
  }

  const canAct = lead.status === "incomplete" || lead.status === "ready_to_convert";
  const regionLabel = [lead.countryName, lead.subRegion, lead.continent].filter(Boolean).join(" / ");

  const handleConfirmConvert = () => {
    convert(lead);
    setConvertOpen(false);
  };

  const handleMarkLost = () => {
    markLost(lead.id);
    toast.info(`${lead.businessName} marked as lost.`);
  };

  const handleConfirmRemove = () => {
    removingRef.current = true;
    removeLead(lead.id);
    toast.success(`${lead.businessName} removed from the pipeline.`);
    setRemoveOpen(false);
    router.push("/admin/leads/pipeline");
  };

  return (
    <div className="space-y-6">
      <ConvertLeadDialog lead={convertOpen ? lead : null} onClose={() => setConvertOpen(false)} onConfirm={handleConfirmConvert} />
      <RemoveLeadDialog lead={removeOpen ? lead : null} onClose={() => setRemoveOpen(false)} onConfirm={handleConfirmRemove} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.businessName}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {LEAD_INTENDED_TYPE_LABELS[lead.intendedType]} lead &bull; sourced via {LEAD_SOURCE_LABELS[lead.source]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canAct && (
            <>
              <Button variant="outline" className="gap-1.5" onClick={handleMarkLost}>
                <XCircle className="h-3.5 w-3.5" />
                Mark Lost
              </Button>
              <Button className="gap-1.5" onClick={() => setConvertOpen(true)}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Convert to Customer
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={() => setRemoveOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
      </div>

      {lead.status === "converted" && lead.convertedOrganizationId && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              This lead has been converted to a full organization.
            </p>
            <Link
              href={`/admin/organizations/${lead.convertedOrganizationId}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              View Organization <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <Field icon={Building2} label="Contact Name" value={lead.contactName} />
          <Field icon={Mail} label="Email" value={lead.email} />
          <Field icon={Phone} label="Phone" value={lead.phone} />
          <Field icon={Tag} label="Intended Entity Type" value={LEAD_INTENDED_TYPE_LABELS[lead.intendedType]} />
          <Field icon={Globe2} label="Region" value={regionLabel} />
          <Field icon={CalendarDays} label="Created" value={new Date(lead.createdAt).toLocaleDateString()} />
        </CardContent>
      </Card>

      {lead.missingFields.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">Missing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700 dark:text-amber-400">
              {lead.missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {lead.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{lead.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
