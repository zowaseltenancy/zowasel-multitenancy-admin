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
  kybRejectionSchema,
  KybRejectionSchema,
} from "@/schemas/kyb.schema";

interface Props {
  open: boolean;

  organizationName: string;

  onClose: () => void;

  onConfirm: (reason: string) => void;
}

export default function KybRejectDialog({
  open,
  organizationName,
  onClose,
  onConfirm,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KybRejectionSchema>({
    resolver: zodResolver(kybRejectionSchema),
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
            Reject KYB for {organizationName}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will mark every submitted document as rejected and notify the business owner.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={submit}
          className="space-y-2"
        >
          <label className="text-sm font-medium">
            Rejection reason
          </label>

          <textarea
            {...register("reason")}
            rows={4}
            placeholder="Explain what needs to be corrected before resubmission..."
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
          />

          {errors.reason && (
            <p className="text-sm text-destructive">
              {errors.reason.message}
            </p>
          )}

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
              Reject KYB
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
