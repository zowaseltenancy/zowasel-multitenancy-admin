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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  transactionDisputeSchema,
  TransactionDisputeSchema,
} from "@/schemas/transaction.schema";
import { DISPUTE_NOTIFY_TARGET_OPTIONS } from "@/constants/transaction";
import { DisputeNotifyTarget } from "@/types/transaction";

interface Props {
  open: boolean;

  reference: string;

  onClose: () => void;

  onConfirm: (
    reason: string,
    notifyTarget: DisputeNotifyTarget
  ) => void;
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionDisputeSchema>({
    resolver: zodResolver(transactionDisputeSchema),
    defaultValues: {
      notifyTarget: "operations_team",
    },
  });

  const notifyTarget = watch("notifyTarget");

  const submit = handleSubmit((values) => {
    onConfirm(values.reason, values.notifyTarget);
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
            This flags the transaction for review and notifies whoever you choose below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Notify
            </label>

            <Select
              value={notifyTarget}
              onValueChange={(value) =>
                setValue(
                  "notifyTarget",
                  value as DisputeNotifyTarget
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {DISPUTE_NOTIFY_TARGET_OPTIONS.map(
                  (option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              {
                DISPUTE_NOTIFY_TARGET_OPTIONS.find(
                  (option) =>
                    option.value === notifyTarget
                )?.description
              }
            </p>
          </div>

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
