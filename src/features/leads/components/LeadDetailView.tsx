"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, StickyNote } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageHeader } from "@/components/layout/PageHeaderContext";
import ConvertLeadDialog from "./ConvertLeadDialog";
import RemoveLeadDialog from "./RemoveLeadDialog";
import EditLeadDialog from "./EditLeadDialog";
import LeadDetailHeader from "./LeadDetailHeader";
import LeadConvertedBanner from "./LeadConvertedBanner";
import LeadInformationCard from "./LeadInformationCard";
import LeadEntityDetailsCard from "./LeadEntityDetailsCard";
import LeadNotFoundState from "./LeadNotFoundState";
import { useLead, useLeads } from "../hooks/useLeads";
import { ConvertLeadValues, useLeadConversion } from "../hooks/useLeadConversion";
import { LEAD_INTENDED_TYPE_LABELS } from "@/constants/lead";
import { Lead } from "@/types/lead";

interface Props {
  leadId: string;
}

export default function LeadDetailView({ leadId }: Props) {
  const router = useRouter();
  const { markLost, removeLead, updateLead } = useLeads();
  const { convert } = useLeadConversion();
  const [convertOpen, setConvertOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const removingRef = useRef(false);

  const leadQuery = useLead(leadId);
  const lead = leadQuery.data;

  usePageHeader(
    lead?.businessName ?? "Lead",
    lead ? LEAD_INTENDED_TYPE_LABELS[lead.intendedType] : undefined
  );

  if (leadQuery.isLoading) {
    return (
      <Card className="flex min-h-[240px] items-center justify-center p-6 text-sm text-muted-foreground">
        Loading lead…
      </Card>
    );
  }

  if (!lead) {
    if (removingRef.current) return null;
    return <LeadNotFoundState leadId={leadId} error={leadQuery.error} />;
  }

  const canAct = lead.status === "incomplete" || lead.status === "ready_to_convert";

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

  const handleSaveLead = (id: string, updates: Partial<Lead>) => {
    updateLead(id, updates);
  };

  return (
    <div className="space-y-6">
      <ConvertLeadDialog
        lead={convertOpen ? lead : null}
        onClose={() => setConvertOpen(false)}
        onConfirm={handleConfirmConvert}
      />
      <RemoveLeadDialog
        lead={removeOpen ? lead : null}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleConfirmRemove}
      />
      <EditLeadDialog
        lead={lead}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSaveLead}
      />

      <LeadDetailHeader
        lead={lead}
        canAct={canAct}
        onMarkLost={handleMarkLost}
        onRemove={() => setRemoveOpen(true)}
      />

      {lead.status === "converted" && (
        <LeadConvertedBanner convertedOrganizationId={lead.convertedOrganizationId} />
      )}

      {/* Main Contact & Registration Information Card */}
      <LeadInformationCard lead={lead} onEdit={() => setEditOpen(true)} />

      {/* Classification-Specific Details (Merchant, Agrodealer, Corporate) */}
      <LeadEntityDetailsCard lead={lead} />

      {/* Missing Information Banner */}
      {lead.missingFields.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 border border-amber-500/30 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
              </div>
              <span>Missing Information</span>
            </CardTitle>
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

      {/* Notes Card */}
      {lead.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-500/10 text-slate-600 border border-slate-500/20 dark:text-slate-400">
                <StickyNote className="h-4 w-4" />
              </div>
              <span>Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{lead.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
