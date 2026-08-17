"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setFlashToast } from "@/lib/flashToast";
import { useProviders } from "@/features/billing/context/ProvidersContext";
import ActivateProviderDialog from "@/features/billing/components/ActivateProviderDialog";
import DeleteProviderDialog from "@/features/billing/components/DeleteProviderDialog";
import ProviderEnvironmentBadge from "@/features/billing/components/ProviderEnvironmentBadge";
import { ProviderForm } from "@/features/billing/components/ProviderForm";
import { ProviderHealthBadge } from "@/features/billing/components/ProviderHealthBadge";
import { ProviderCredentials } from "@/features/billing/components/ProviderCredentials";
import ProviderStatusBadge from "@/features/billing/components/ProviderStatusBadge";

import { cn } from "@/lib/utils";

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
    updateProvider,
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
              className={cn(
                "cursor-pointer font-semibold",
                provider.isActive
                  ? "border-rose-500/40 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 dark:border-rose-500/40 dark:hover:bg-rose-500/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => setToggleDialogOpen(true)}
            >
              {provider.isActive
                ? "Deactivate"
                : "Activate Provider"}
            </Button>

            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ProviderForm
        provider={provider}
        onUpdate={(updates) => updateProvider(provider.id, updates)}
      />

      <ProviderCredentials
        provider={provider}
        onUpdate={(updates) => updateProvider(provider.id, updates)}
      />

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
