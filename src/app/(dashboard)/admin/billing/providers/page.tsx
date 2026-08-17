"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, CreditCard, ArrowUpRight, Coins, Layers } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Provider } from "@/types/provider";
import ActivateProviderDialog from "@/features/billing/components/ActivateProviderDialog";
import AddProviderDialog from "@/features/billing/components/AddProviderDialog";
import ProviderGrid from "@/features/billing/components/ProviderGrid";
import { useProviders } from "@/features/billing/context/ProvidersContext";
import { useFlashToast } from "@/hooks/useFlashToast";

export default function ProvidersPage() {
  useFlashToast();

  const { providers, toggleProvider, addProvider } = useProviders();
  const [activeTab, setActiveTab] = useState<"all" | "pay_in" | "pay_out" | "currency">("all");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleToggleClick = (provider: Provider) => {
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

  const payInProviders = providers.filter((p) => p.category === "pay_in");
  const payOutProviders = providers.filter((p) => p.category === "pay_out");
  const currencyProviders = providers.filter((p) => p.category === "currency");

  const TABS = [
    { key: "all", label: "All Providers", icon: Layers, count: providers.length },
    { key: "pay_in", label: "Pay-in Providers", icon: CreditCard, count: payInProviders.length },
    { key: "pay_out", label: "Pay-out Providers", icon: ArrowUpRight, count: payOutProviders.length },
    { key: "currency", label: "Currency Providers", icon: Coins, count: currencyProviders.length },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Management</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Configure pay-in, pay-out, and currency providers used by the platform. Multiple active providers dynamically route traffic across enabled gateways.
          </p>
        </div>

        <Button onClick={() => setAddDialogOpen(true)} className="gap-2 self-start sm:self-auto cursor-pointer">
          <Plus className="h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {/* Snapshot Cards with Cyan Total Card & Status Tints */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Providers - Cyan Tint */}
        <Card className="bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Providers
              </p>
              <h3 className="text-2xl font-bold mt-1">{providers.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:text-cyan-400">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pay-in - Blue Tint */}
        <Card className="bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pay-in Gateways
              </p>
              <h3 className="text-2xl font-bold mt-1">{payInProviders.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 border border-blue-500/30 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pay-out - Emerald Tint */}
        <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pay-out Channels
              </p>
              <h3 className="text-2xl font-bold mt-1">{payOutProviders.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Currency - Amber Tint */}
        <Card className="bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Currency & FX
              </p>
              <h3 className="text-2xl font-bold mt-1">{currencyProviders.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-background text-muted-foreground border"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      {activeTab === "all" && (
        <div className="space-y-8">
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
        </div>
      )}

      {activeTab === "pay_in" && (
        <ProviderGrid
          title="Pay-in Gateways"
          description="Collect payments from customers — cards, bank transfers, USSD and mobile money."
          providers={payInProviders}
          onToggle={handleToggleClick}
        />
      )}

      {activeTab === "pay_out" && (
        <ProviderGrid
          title="Pay-out Channels"
          description="Disburse payouts and settlements to businesses and partners."
          providers={payOutProviders}
          onToggle={handleToggleClick}
        />
      )}

      {activeTab === "currency" && (
        <ProviderGrid
          title="FX & Currency Providers"
          description="These providers supply exchange rates and currency conversion services."
          providers={currencyProviders}
          onToggle={handleToggleClick}
        />
      )}

      {/* Dialog Modals */}
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
