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

const CATEGORY_LABELS: Record<string, string> = {
  pay_in: "pay-in",
  pay_out: "pay-out",
  currency: "currency",
};

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

  const categoryLabel =
    CATEGORY_LABELS[provider.category] ??
    provider.category;

  const willActivate = !provider.isActive;

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
            {willActivate
              ? `Activate ${provider.name}?`
              : `Deactivate ${provider.name}?`}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {willActivate
              ? `New ${categoryLabel} traffic will start routing through ${provider.name}, alongside any other currently active ${categoryLabel} providers.`
              : `${provider.name} will stop receiving new ${categoryLabel} traffic. Other active ${categoryLabel} providers are unaffected.`}
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
            {willActivate ? "Activate" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
