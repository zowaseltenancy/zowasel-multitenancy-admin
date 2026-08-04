import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadStatusBadge from "./LeadStatusBadge";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";
import { Lead } from "@/types/lead";

interface Props {
  leads: Lead[];
  onConvert: (lead: Lead) => void;
  onMarkLost: (lead: Lead) => void;
}

export default function LeadTable({ leads, onConvert, onMarkLost }: Props) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Business</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Intended Type</th>
              <th className="p-4">Source</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">
                  <div className="font-semibold text-foreground">{lead.businessName}</div>
                  <div className="text-xs text-muted-foreground">{lead.countryName ?? "—"}</div>
                </td>
                <td className="p-4">
                  <div className="text-foreground">{lead.contactName}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {LEAD_INTENDED_TYPE_LABELS[lead.intendedType]}
                </td>
                <td className="p-4 text-muted-foreground">{LEAD_SOURCE_LABELS[lead.source]}</td>
                <td className="p-4">
                  <LeadStatusBadge status={lead.status} />
                  {lead.missingFields.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Missing: {lead.missingFields.join(", ")}
                    </p>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {(lead.status === "incomplete" || lead.status === "ready_to_convert") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => onConvert(lead)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Convert
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5 text-muted-foreground"
                          onClick={() => onMarkLost(lead)}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Mark Lost
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
