"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LEAD_INTENDED_TYPE_LABELS } from "@/constants/lead";
import { Lead } from "@/types/lead";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConvertLeadDialog({ lead, onClose, onConfirm }: Props) {
  if (!lead) return null;

  return (
    <AlertDialog
      open={!!lead}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Convert {lead.businessName}?</AlertDialogTitle>

          <AlertDialogDescription>
            This creates a full {LEAD_INTENDED_TYPE_LABELS[lead.intendedType]} organization
            record from {lead.contactName}&rsquo;s details and marks this lead as converted.
            KYB review still applies before they get full platform access.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Convert to Customer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
