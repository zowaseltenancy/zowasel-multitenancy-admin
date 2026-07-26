"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setFlashToast } from "@/lib/flashToast";
import { useProviders } from "@/features/billing/hooks/useProviders";
import ActivateProviderDialog from "@/features/billing/components/ActivateProviderDialog";
import DeleteProviderDialog from "@/features/billing/components/DeleteProviderDialog";
import ProviderEnvironmentBadge from "@/features/billing/components/ProviderEnvironmentBadge";
import { ProviderForm } from "@/features/billing/components/ProviderForm";
import { ProviderHealthBadge } from "@/features/billing/components/ProviderHealthBadge";
import { ProviderCredentials } from "@/features/billing/components/ProviderCredentials";
import ProviderStatusBadge from "@/features/billing/components/ProviderStatusBadge";

interface Props {
  params: Promise<{
    providerId: string;
  }>;
}

export default function ProviderDetailsPage({
  params,
}: Props) {
  const { providerId } = use(params);

  const {
    providers,
    toggleProvider,
    deleteProvider,
  } = useProviders();

  const [toggleDialogOpen, setToggleDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const provider = providers.find(
    (item) => item.slug === providerId
  );

  if (!provider) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-6">
          <Link
            href="/admin/billing/providers"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Providers
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              {provider.name}
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              {provider.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <ProviderStatusBadge
                status={provider.health}
              />

              <ProviderEnvironmentBadge
                environment={provider.environment}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={
                provider.isActive ? "outline" : "default"
              }
              onClick={() => setToggleDialogOpen(true)}
            >
              {provider.isActive
                ? "Deactivate"
                : "Activate Provider"}
            </Button>

            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ProviderForm provider={provider} />

      <ProviderCredentials provider={provider} />

      <ProviderHealthBadge provider={provider} />

      <ActivateProviderDialog
        open={toggleDialogOpen}
        provider={provider}
        onClose={() => setToggleDialogOpen(false)}
        onConfirm={() => {
          const willActivate = !provider.isActive;

          toggleProvider(provider.id);

          toast.success(
            willActivate
              ? `${provider.name} is now active.`
              : `${provider.name} has been deactivated.`
          );

          setToggleDialogOpen(false);
        }}
      />

      <DeleteProviderDialog
        open={deleteDialogOpen}
        providerName={provider.name}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteProvider(provider.id);

          setFlashToast(
            `${provider.name} has been removed.`
          );

          setDeleteDialogOpen(false);

          // A plain router.push() here reliably failed to navigate: the
          // AlertDialog's own unmount/focus-return interacts badly with
          // the App Router's transition when fired from this callback.
          // A hard navigation sidesteps it entirely and is a perfectly
          // acceptable trade-off for a delete-then-redirect action.
          window.location.href = "/admin/billing/providers";
        }}
      />
    </div>
  );
}
