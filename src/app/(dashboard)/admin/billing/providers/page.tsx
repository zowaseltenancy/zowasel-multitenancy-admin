"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Provider } from "@/types/provider";

import ActivateProviderDialog from "@/features/billing/components/ActivateProviderDialog";

import ProviderGrid from "@/features/billing/components/ProviderGrid";
import { useProviders } from "@/features/billing/hooks/useProviders";

export default function ProvidersPage() {
  const {
  providers,
  activateProvider,
} = useProviders();

const [selectedProvider, setSelectedProvider] =
  useState<Provider | null>(null);

const [dialogOpen, setDialogOpen] =
  useState(false);

const handleActivateClick = (
  provider: Provider
) => {
  setSelectedProvider(provider);

  setDialogOpen(true);
};

const confirmActivation = () => {
  if (!selectedProvider) return;

  activateProvider(selectedProvider.id);

  toast.success(
    `${selectedProvider.name} is now the active ${selectedProvider.category} provider.`
  );

  setDialogOpen(false);

  setSelectedProvider(null);
};

const paymentProviders = providers.filter(
  (provider) =>
    provider.category === "payment"
);

const currencyProviders = providers.filter(
  (provider) =>
    provider.category === "currency"
);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold">
          Provider Management
        </h1>

        <p className="mt-2 max-w-3xl text-muted-foreground">
          Configure payment and currency providers used by the platform.
          Only one provider per category can be active at any given time.
        </p>
      </div>

      <ProviderGrid
          title="Payment Providers"
          description="These providers process financial transactions across the platform."
          providers={paymentProviders}
          onActivate={handleActivateClick}
      />

      <ProviderGrid
        title="Currency Providers"
        description="These providers supply exchange rates and currency conversion services."
        providers={currencyProviders}
        onActivate={handleActivateClick}
      />

      <ActivateProviderDialog
        open={dialogOpen}
        provider={selectedProvider}
        onClose={() => {
          setDialogOpen(false);
          setSelectedProvider(null);
        }}
        onConfirm={confirmActivation}
      />
    </div>
  );
}