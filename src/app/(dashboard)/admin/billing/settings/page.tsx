"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Globe, CheckCircle2, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { useBillingSettings } from "@/features/billing/hooks/useBillingSettings";
import { useCurrencies } from "@/features/billing/hooks/useCurrencies";
import DeveloperPortalView from "@/features/developer/components/DeveloperPortalView";
import CountryFlag from "@/components/shared/CountryFlag";
import { DISPUTE_NOTIFY_TARGET_OPTIONS } from "@/constants/transaction";
import { BillingSettings, PaymentTerms } from "@/types/billing";
import { GLOBAL_COUNTRY_CURRENCIES, SUB_REGIONS } from "@/data/geoData";
import { SubRegion } from "@/types/geo";

interface CountryTaxOverride {
  countryCode: string;
  countryName: string;
  taxLabel: string;
  taxRatePercentage: number;
  taxRegistrationNumber: string;
}

interface RegionalTaxOverride {
  subRegion: SubRegion;
  subRegionLabel: string;
  taxRatePercentage: number;
}

const INITIAL_REGIONAL_OVERRIDES: RegionalTaxOverride[] = [
  { subRegion: "west_africa", subRegionLabel: "West Africa", taxRatePercentage: 7.5 },
  { subRegion: "east_africa", subRegionLabel: "East Africa", taxRatePercentage: 16.0 },
  { subRegion: "southern_africa", subRegionLabel: "Southern Africa", taxRatePercentage: 15.0 },
];

const INITIAL_OVERRIDES: CountryTaxOverride[] = [
  {
    countryCode: "KE",
    countryName: "Kenya",
    taxLabel: "KRA PIN",
    taxRatePercentage: 16.0,
    taxRegistrationNumber: "KRA-PIN-8920194-K",
  },
  {
    countryCode: "GH",
    countryName: "Ghana",
    taxLabel: "GRA TIN",
    taxRatePercentage: 15.0,
    taxRegistrationNumber: "GRA-TIN-7730192-G",
  },
  {
    countryCode: "TZ",
    countryName: "Tanzania",
    taxLabel: "TRA TIN",
    taxRatePercentage: 18.0,
    taxRegistrationNumber: "TRA-TIN-4491023-T",
  },
  {
    countryCode: "ZA",
    countryName: "South Africa",
    taxLabel: "SARS VAT No.",
    taxRatePercentage: 15.0,
    taxRegistrationNumber: "SARS-VAT-491029384",
  },
];

export default function BillingSettingsPage() {
  const { settings, updateSettings } = useBillingSettings();
  const { currencies } = useCurrencies();

  const [draft, setDraft] = useState<BillingSettings>(settings);
  const [taxOverrides, setTaxOverrides] = useState<CountryTaxOverride[]>(INITIAL_OVERRIDES);
  const [regionalOverrides, setRegionalOverrides] = useState<RegionalTaxOverride[]>(INITIAL_REGIONAL_OVERRIDES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const updateRegionalRate = (subRegion: SubRegion, rate: number) => {
    setRegionalOverrides((prev) =>
      prev.map((entry) =>
        entry.subRegion === subRegion ? { ...entry, taxRatePercentage: rate } : entry
      )
    );
  };
  const [newReminderDay, setNewReminderDay] = useState("");

  const addReminderDay = () => {
    const day = Number(newReminderDay);
    if (!day || day < 1 || draft.reminderScheduleDays.includes(day)) return;

    setDraft((current) => ({
      ...current,
      reminderScheduleDays: [...current.reminderScheduleDays, day].sort((a, b) => b - a),
    }));
    setNewReminderDay("");
  };

  const removeReminderDay = (day: number) => {
    setDraft((current) => ({
      ...current,
      reminderScheduleDays: current.reminderScheduleDays.filter((d) => d !== day),
    }));
  };

  const [newCountryCode, setNewCountryCode] = useState("UG");
  const [newTaxLabel, setNewTaxLabel] = useState("URA TIN");
  const [newTaxRate, setNewTaxRate] = useState("18.0");
  const [newTaxRegNo, setNewTaxRegNo] = useState("URA-TIN-5910293");

  const save = (section: string) => {
    updateSettings(draft);
    toast.success(`${section} settings saved.`);
  };

  const handleAddOverride = () => {
    const matchedCountry = GLOBAL_COUNTRY_CURRENCIES.find(
      (c) => c.countryCode === newCountryCode
    );

    if (!matchedCountry) return;

    const exists = taxOverrides.some((o) => o.countryCode === newCountryCode);
    if (exists) {
      toast.error(`A tax override for ${matchedCountry.countryName} already exists.`);
      return;
    }

    const created: CountryTaxOverride = {
      countryCode: matchedCountry.countryCode,
      countryName: matchedCountry.countryName,
      taxLabel: newTaxLabel || "Local Tax ID",
      taxRatePercentage: Number(newTaxRate) || 0,
      taxRegistrationNumber: newTaxRegNo || "PENDING",
    };

    setTaxOverrides((prev) => [...prev, created]);
    toast.success(`Tax override added for ${matchedCountry.countryName}!`);
    setIsAddDialogOpen(false);
  };

  const handleDeleteOverride = (code: string, name: string) => {
    setTaxOverrides((prev) => prev.filter((o) => o.countryCode !== code));
    toast.success(`Removed tax override for ${name}. Defaults will now apply.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Platform Billing Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide defaults for invoicing, payment terms, multi-country tax registration, escalation rules, and webhooks.
        </p>
      </div>

      {/* General Defaults */}
      <Card className="bg-card shadow-2xs">
        <CardHeader>
          <CardTitle>General Defaults</CardTitle>
          <CardDescription>Default platform currency, invoice prefixing, and standard payment terms.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Default Platform Currency
            </label>

            <Select
              value={draft.defaultCurrency}
              onValueChange={(value) =>
                value && setDraft((current) => ({
                  ...current,
                  defaultCurrency: value,
                }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Invoice Number Prefix
            </label>

            <Input
              value={draft.invoicePrefix}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  invoicePrefix: event.target.value,
                }))
              }
              placeholder="INV"
              className="h-10 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Default Payment Terms
            </label>

            <Select
              value={draft.paymentTerms}
              onValueChange={(value) =>
                value && setDraft((current) => ({
                  ...current,
                  paymentTerms: value as PaymentTerms,
                }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="net_15">Net 15 Days</SelectItem>
                <SelectItem value="net_30">Net 30 Days</SelectItem>
                <SelectItem value="net_60">Net 60 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("General")} size="sm" className="cursor-pointer">
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      {/* Hierarchical Multi-Country Tax & Compliance Matrix */}
      <Card className="bg-card shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Hierarchical Multi-Country Tax & Registration System</CardTitle>
            <CardDescription>
              Configure global default tax rates and manage localized country-specific tax ID registration overrides for Pan-African and international operations.
            </CardDescription>
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 cursor-pointer shrink-0" size="sm">
            <Plus className="h-4 w-4" />
            Add Country Override
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Global Fallback Card */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Global Fallback Tax Defaults</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                Default Active
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Global Default Tax Rate (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  step={0.1}
                  value={draft.taxRatePercentage}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      taxRatePercentage: Number(event.target.value),
                    }))
                  }
                  className="h-9 bg-background text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Fallback Tax Registration Number (Nigeria TIN)
                </label>
                <Input
                  value={draft.taxRegistrationNumber}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      taxRegistrationNumber: event.target.value,
                    }))
                  }
                  placeholder="TIN 12345678-0001"
                  className="h-9 bg-background font-mono text-xs"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Fallback order: Country override → Regional override → this <strong>{draft.taxRatePercentage}%</strong> global default (Nigerian TIN <strong>{draft.taxRegistrationNumber}</strong>).</span>
            </p>
          </div>

          {/* Regional Tax Overrides — sits between Global and Country */}
          <div className="space-y-3 pt-2 border-t border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Regional Tax Overrides ({regionalOverrides.length})
            </span>
            <p className="text-xs text-muted-foreground">
              Applies to any country in the region that doesn&apos;t have its own country-level override below —
              e.g. cross-border operations like a Tanzania ↔ Malawi transaction settle at the East Africa rate.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SUB_REGIONS.africa
                .filter((region) => region.key !== "all")
                .map((region) => {
                  const override = regionalOverrides.find((o) => o.subRegion === region.key);

                  return (
                    <div key={region.key} className="p-3 rounded-xl border border-border bg-card space-y-2 shadow-2xs">
                      <span className="text-sm font-semibold text-foreground">{region.label}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={30}
                          step={0.5}
                          value={override?.taxRatePercentage ?? ""}
                          placeholder="Not set"
                          onChange={(event) => {
                            const rate = Number(event.target.value);
                            if (override) {
                              updateRegionalRate(region.key, rate);
                            } else {
                              setRegionalOverrides((prev) => [
                                ...prev,
                                { subRegion: region.key, subRegionLabel: region.label, taxRatePercentage: rate },
                              ]);
                            }
                          }}
                          className="h-9 font-mono text-xs"
                        />
                        <span className="text-xs text-muted-foreground shrink-0">%</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Local Country Overrides Table */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Country Tax Overrides ({taxOverrides.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {taxOverrides.map((override) => (
                <div key={override.countryCode} className="p-3.5 rounded-xl border border-border bg-card space-y-3 shadow-2xs hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CountryFlag countryCode={override.countryCode} countryName={override.countryName} size="md" className="rounded-xs border" />
                      <div>
                        <span className="text-sm font-semibold text-foreground">{override.countryName}</span>
                        <span className="text-xs text-muted-foreground ml-1 font-mono">({override.countryCode})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono">
                        {override.taxRatePercentage}% Tax
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() => handleDeleteOverride(override.countryCode, override.countryName)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
                    <div>
                      <span className="text-muted-foreground">Tax Name:</span>
                      <p className="font-semibold text-foreground">{override.taxLabel}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Registration ID:</span>
                      <p className="font-mono text-foreground font-semibold">{override.taxRegistrationNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("Multi-Country Tax")} size="sm" className="cursor-pointer">
            Save Multi-Country Tax Settings
          </Button>
        </CardContent>
      </Card>

      {/* Reminders Settings */}
      <Card className="bg-card shadow-2xs">
        <CardHeader>
          <CardTitle>Automated Payment Reminders</CardTitle>
          <CardDescription>Configure email dispatch rates and first notification schedules for due invoices.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Reminder Rate Limit (emails/hour)
            </label>

            <Input
              type="number"
              min={1}
              max={500}
              value={draft.reminderRatePerHour}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  reminderRatePerHour: Number(event.target.value),
                }))
              }
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Throttles payment reminder emails to prevent gateway or SMTP rate limits.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Reminder Schedule (days before due date)
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {draft.reminderScheduleDays.map((day) => (
                <Badge key={day} variant="outline" className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-semibold">
                  {day} {day === 1 ? "day" : "days"}
                  <button
                    type="button"
                    onClick={() => removeReminderDay(day)}
                    className="rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={90}
                placeholder="e.g. 5"
                value={newReminderDay}
                onChange={(event) => setNewReminderDay(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addReminderDay();
                  }
                }}
                className="h-9"
              />
              <Button type="button" variant="outline" size="sm" onClick={addReminderDay} className="shrink-0 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              A reminder email fires on each day offset listed above, e.g. 14, 7, and 3 days before the due date.
            </p>
          </div>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("Reminder")} size="sm" className="cursor-pointer">
            Save Reminder Settings
          </Button>
        </CardContent>
      </Card>

      {/* Escalation Defaults */}
      <Card className="bg-card shadow-2xs">
        <CardHeader>
          <CardTitle>Dispute Escalation Rules</CardTitle>
          <CardDescription>Every transaction dispute follows this fixed sequence — it is not a free pick.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {DISPUTE_NOTIFY_TARGET_OPTIONS.map((option, index) => (
              <div key={option.value} className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
                  {index + 1}. {option.label}
                </Badge>
                {index < DISPUTE_NOTIFY_TARGET_OPTIONS.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Escalating a transaction always starts at Stage 1 (Operations). It only advances to Finance, then
            Provider Support, if the previous stage can&apos;t resolve it — never straight to a later stage.
          </p>
        </CardContent>
      </Card>

      {/* Webhooks & Developer Portal */}
      <Card className="bg-card shadow-2xs">
        <CardHeader>
          <CardTitle>Billing Event Webhooks</CardTitle>
          <CardDescription>Endpoints notified on real-time billing, subscription, and transaction events.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Billing Event Webhook URL
          </label>

          <Input
            value={draft.webhookUrl}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                webhookUrl: event.target.value,
              }))
            }
            placeholder="https://yourservice.com/webhooks/billing"
            className="h-10 font-mono text-xs"
          />
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("Webhook")} size="sm" className="cursor-pointer">
            Save Webhook Settings
          </Button>
        </CardContent>
      </Card>

      {/* Developer API Keys & Webhooks Portal */}
      <DeveloperPortalView />

      {/* Add Country Override Dialog Modal */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Country Tax Override</DialogTitle>
            <DialogDescription>
              Configure localized tax registration number and tax rate (%) for transactions operating in this country.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Country</label>
              <Select value={newCountryCode} onValueChange={(val) => val && setNewCountryCode(val)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {GLOBAL_COUNTRY_CURRENCIES.map((c) => (
                    <SelectItem key={c.countryCode} value={c.countryCode}>
                      {c.countryName} ({c.countryCode}) — {c.subRegionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Local Tax Name / Label</label>
              <Input
                value={newTaxLabel}
                onChange={(e) => setNewTaxLabel(e.target.value)}
                placeholder="e.g. KRA PIN, GRA TIN, TRA TIN, VAT ID"
                className="h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tax Rate (%)</label>
                <Input
                  type="number"
                  step={0.1}
                  value={newTaxRate}
                  onChange={(e) => setNewTaxRate(e.target.value)}
                  className="h-9 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tax Registration No.</label>
                <Input
                  value={newTaxRegNo}
                  onChange={(e) => setNewTaxRegNo(e.target.value)}
                  placeholder="e.g. URA-TIN-10293"
                  className="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddOverride} className="cursor-pointer">
              Save Country Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
