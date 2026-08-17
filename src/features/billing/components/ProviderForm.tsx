"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Check, X } from "lucide-react";
import { Provider, ProviderCategory, ProviderEnvironment } from "@/types/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProviderFormProps {
  provider: Provider;
  onUpdate?: (updates: Partial<Provider>) => void;
}

export function ProviderForm({ provider, onUpdate }: ProviderFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(provider.name);
  const [description, setDescription] = useState(provider.description);
  const [category, setCategory] = useState<ProviderCategory>(provider.category);
  const [environment, setEnvironment] = useState<ProviderEnvironment>(provider.environment);
  const [currencies, setCurrencies] = useState(provider.supportedCurrencies.join(", "));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Provider name is required.");
      return;
    }

    const updatedCurrencies = currencies
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    if (onUpdate) {
      onUpdate({
        name,
        description,
        category,
        environment,
        supportedCurrencies: updatedCurrencies,
      });
      toast.success("Provider information updated successfully.");
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(provider.name);
    setDescription(provider.description);
    setCategory(provider.category);
    setEnvironment(provider.environment);
    setCurrencies(provider.supportedCurrencies.join(", "));
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Provider Information</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Configure gateway classification, target environment, and currency handling.
          </p>
        </div>

        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-1.5 font-semibold text-xs cursor-pointer border-primary/40 text-primary hover:bg-primary/10"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Information
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="gap-1 text-xs cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="gap-1 text-xs bg-primary font-semibold cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!isEditing ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Provider Name
              </p>
              <p className="mt-1 font-semibold text-foreground text-sm">{provider.name}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </p>
              <p className="mt-1 font-semibold text-foreground text-sm capitalize">
                {provider.category.replace("_", "-")} Gateway
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Slug Identifier
              </p>
              <p className="mt-1 font-mono text-foreground text-sm">{provider.slug}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Environment
              </p>
              <p className="mt-1 font-semibold text-foreground text-sm uppercase">
                {provider.environment}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{provider.description}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Supported Currencies
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {provider.supportedCurrencies.map((c) => (
                  <span
                    key={c}
                    className="rounded-md border bg-muted/60 px-2 py-0.5 font-mono text-xs font-bold text-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Provider Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paystack"
                required
                className="h-9 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProviderCategory)}
                className="w-full h-9 rounded-lg border bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pay_in">Pay-In (Collections)</option>
                <option value="pay_out">Pay-Out (Settlements)</option>
                <option value="currency">Currency & FX</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Environment
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as ProviderEnvironment)}
                className="w-full h-9 rounded-lg border bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="live">Live (Production)</option>
                <option value="test">Test (Sandbox)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Supported Currencies (comma-separated)
              </label>
              <Input
                value={currencies}
                onChange={(e) => setCurrencies(e.target.value)}
                placeholder="NGN, USD, KES, GHS"
                className="h-9 text-xs font-mono font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief description of this payment provider..."
                className="text-xs"
              />
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}