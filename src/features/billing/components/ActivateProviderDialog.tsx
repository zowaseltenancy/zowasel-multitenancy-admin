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

import { Provider } from "@/types/provider";

interface ActivateProviderDialogProps {
  open: boolean;

  provider: Provider | null;

  onClose: () => void;

  onConfirm: () => void;
}

export default function ActivateProviderDialog({
  open,
  provider,
  onClose,
  onConfirm,
}: ActivateProviderDialogProps) {
  if (!provider) return null;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Activate {provider.name}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            {`This will make ${provider.name} the active ${provider.category} provider for the platform.`}
          </AlertDialogDescription>

          <AlertDialogDescription>
            All new{" "}
            {provider.category === "payment"
              ? "payment requests"
              : "currency conversions"}{" "}
            will immediately begin using this provider.
          </AlertDialogDescription>

          <AlertDialogDescription className="font-medium text-destructive">
            This change affects every organization on the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
          >
            Activate Provider
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}