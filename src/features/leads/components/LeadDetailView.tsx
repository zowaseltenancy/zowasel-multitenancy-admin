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
import { getApiErrorMessage } from "@/lib/axios";
import { useLead, useLeads } from "../hooks/useLeads";
import { ConvertLeadValues, useLeadConversion } from "../hooks/useLeadConversion";
import { convertibilityOf } from "../utils/convertibility";
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
  const { markLost, removeLead } = useLeads();
  const { convert, isConverting } = useLeadConversion();
  const [convertOpen, setConvertOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const removingRef = useRef(false);

  // GET /admin/leads/{id} rather than searching the list — the list only holds
  // one page, so a lead outside it used to look like it did not exist.
  const leadQuery = useLead(leadId);
  const lead = leadQuery.data;

  usePageHeader(lead?.businessName ?? "Lead", lead ? LEAD_INTENDED_TYPE_LABELS[lead.intendedType] : undefined);

  if (leadQuery.isLoading) {
    return (
      <Card className="flex min-h-[240px] items-center justify-center p-6 text-sm text-muted-foreground">
        Loading lead…
      </Card>
    );
  }

  if (!lead) {
    // Removing this lead clears it before the redirect lands — render nothing
    // instead of a flash of the 404 page while navigating away.
    // eslint-disable-next-line react-hooks/refs
    if (removingRef.current) {
      return null;
    }
    // Only a real 404 from the API means the lead is gone; any other failure is
    // worth surfacing rather than disguising as "not found".
    const status = (leadQuery.error as { response?: { status?: number } } | null)?.response?.status;
    if (leadQuery.isError && status !== 404) {
      return (
        <Card className="flex min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm font-medium text-foreground">Unable to load this lead</p>
          <p className="max-w-md text-xs text-muted-foreground">
            {getApiErrorMessage(leadQuery.error, 'Please try again.')}
          </p>
        </Card>
      );
    }
    notFound();
  }

  const canAct = lead.status === "incomplete" || lead.status === "ready_to_convert";
  const convertibility = convertibilityOf(lead);
  const regionLabel = [lead.countryName, lead.subRegion, lead.continent].filter(Boolean).join(" / ");

  // The dialog collects overrides, so they arrive here and pass straight
  // through. It closes on the server's answer, not on the click.
  const handleConfirmConvert = (values?: ConvertLeadValues) => {
    convert(lead, values, { onSuccess: () => setConvertOpen(false) });
  };

  const handleMarkLost = () => {
    markLost(lead.id);
    toast.info(`${lead.businessName} marked as lost.`);
  };

  // Navigate only once the delete has actually landed. Redirecting on the click
  // meant a refusal — the server rejects deleting a converted lead — left the
  // user on the pipeline with an error toast and the lead still there.
  const handleConfirmRemove = () => {
    removeLead(lead.id, {
      onSuccess: () => {
        removingRef.current = true;
        setRemoveOpen(false);
        router.push("/admin/leads/pipeline");
      },
    });
  };

  return (
    <div className="space-y-6">
      <ConvertLeadDialog
        lead={convertOpen ? lead : null}
        onClose={() => setConvertOpen(false)}
        onConfirm={handleConfirmConvert}
        isSubmitting={isConverting}
      />
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
              {/* Same verdict the table and the server apply — see
                  convertibilityOf. Offering this for a deal that is not won
                  only produced a 409 the operator could not act on. */}
              <Button
                className="gap-1.5"
                disabled={!convertibility.canConvert}
                title={convertibility.reason ?? "Convert this lead into a business"}
                onClick={() => setConvertOpen(true)}
              >
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
