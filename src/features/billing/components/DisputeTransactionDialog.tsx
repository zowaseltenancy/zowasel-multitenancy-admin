"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  transactionDisputeSchema,
  TransactionDisputeSchema,
} from "@/schemas/transaction.schema";

interface Props {
  open: boolean;

  reference: string;

  onClose: () => void;

  onConfirm: (reason: string) => void;
}

export default function DisputeTransactionDialog({
  open,
  reference,
  onClose,
  onConfirm,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionDisputeSchema>({
    resolver: zodResolver(transactionDisputeSchema),
  });

  const submit = handleSubmit((values) => {
    onConfirm(values.reason);
    reset();
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          reset();
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Escalate {reference}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This starts the escalation workflow at the Zowasel Operations Team (Stage 1 of 3: Ops → Finance → Provider).
            It only moves further if Ops can&apos;t resolve it.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              What&apos;s the issue?
            </label>

            <textarea
              {...register("reason")}
              rows={4}
              placeholder="Describe the dispute — duplicate charge, wrong amount, customer complaint..."
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
            />

            {errors.reason && (
              <p className="text-sm text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          <AlertDialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
            >
              Escalate Transaction
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
