"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Provider } from "@/types/provider";

import ActivateProviderDialog from "@/features/billing/components/ActivateProviderDialog";
import AddProviderDialog from "@/features/billing/components/AddProviderDialog";

import ProviderGrid from "@/features/billing/components/ProviderGrid";
import { useProviders } from "@/features/billing/hooks/useProviders";
import { useFlashToast } from "@/hooks/useFlashToast";

export default function ProvidersPage() {
  useFlashToast();

  const {
    providers,
    toggleProvider,
    addProvider,
  } = useProviders();

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [addDialogOpen, setAddDialogOpen] =
    useState(false);

  const handleToggleClick = (
    provider: Provider
  ) => {
    setSelectedProvider(provider);

    setDialogOpen(true);
  };

  const confirmToggle = () => {
    if (!selectedProvider) return;

    const willActivate = !selectedProvider.isActive;

    toggleProvider(selectedProvider.id);

    toast.success(
      willActivate
        ? `${selectedProvider.name} is now active.`
        : `${selectedProvider.name} has been deactivated.`
    );

    setDialogOpen(false);

    setSelectedProvider(null);
  };

  const payInProviders = providers.filter(
    (provider) => provider.category === "pay_in"
  );

  const payOutProviders = providers.filter(
    (provider) => provider.category === "pay_out"
  );

  const currencyProviders = providers.filter(
    (provider) => provider.category === "currency"
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Provider Management
          </h1>

          <p className="mt-2 max-w-3xl text-muted-foreground">
            Configure pay-in, pay-out and currency providers used by the platform.
            Multiple providers can be active at once within a category — new traffic is routed across whichever ones are switched on.
          </p>
        </div>

        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      <ProviderGrid
        title="Pay-in Providers"
        description="Collect payments from customers — cards, bank transfers, USSD and mobile money."
        providers={payInProviders}
        onToggle={handleToggleClick}
      />

      <ProviderGrid
        title="Pay-out Providers"
        description="Disburse payouts and settlements to businesses and partners."
        providers={payOutProviders}
        onToggle={handleToggleClick}
      />

      <ProviderGrid
        title="Currency Providers"
        description="These providers supply exchange rates and currency conversion services."
        providers={currencyProviders}
        onToggle={handleToggleClick}
      />

      <ActivateProviderDialog
        open={dialogOpen}
        provider={selectedProvider}
        onClose={() => {
          setDialogOpen(false);
          setSelectedProvider(null);
        }}
        onConfirm={confirmToggle}
      />

      <AddProviderDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreate={(values) => {
          const created = addProvider(values);

          toast.success(
            `${created.name} has been added as a ${created.category.replace("_", "-")} provider.`
          );

          setAddDialogOpen(false);
        }}
      />
    </div>
  );
}
