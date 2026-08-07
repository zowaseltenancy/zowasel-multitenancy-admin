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
import { Lead } from "@/types/lead";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveLeadDialog({ lead, onClose, onConfirm }: Props) {
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
          <AlertDialogTitle>Remove {lead.businessName}?</AlertDialogTitle>

          <AlertDialogDescription>
            This permanently removes this lead from the pipeline. This is different from marking it
            lost — the record won&rsquo;t be recoverable afterward.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Remove Lead
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
