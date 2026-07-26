"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBillingSettings } from "@/features/billing/hooks/useBillingSettings";
import { useCurrencies } from "@/features/billing/hooks/useCurrencies";
import { DISPUTE_NOTIFY_TARGET_OPTIONS } from "@/constants/transaction";
import {
  BillingSettings,
  PaymentTerms,
} from "@/types/billing";
import { DisputeNotifyTarget } from "@/types/transaction";

export default function BillingSettingsPage() {
  const { settings, updateSettings } =
    useBillingSettings();

  const { currencies } = useCurrencies();

  const [draft, setDraft] =
    useState<BillingSettings>(settings);

  const save = (section: string) => {
    updateSettings(draft);

    toast.success(`${section} settings saved.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Billing Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Platform-wide defaults for invoicing, tax, reminders and escalation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Default Currency
            </label>

            <Select
              value={draft.defaultCurrency}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  defaultCurrency:
                    value ?? current.defaultCurrency,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency.code}
                    value={currency.code}
                  >
                    {currency.code} — {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
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
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Default Payment Terms
            </label>

            <Select
              value={draft.paymentTerms}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  paymentTerms: value as PaymentTerms,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="net_15">
                  Net 15
                </SelectItem>

                <SelectItem value="net_30">
                  Net 30
                </SelectItem>

                <SelectItem value="net_60">
                  Net 60
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("General")}>
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Tax Rate (%)
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
                  taxRatePercentage: Number(
                    event.target.value
                  ),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Tax Registration Number
            </label>

            <Input
              value={draft.taxRegistrationNumber}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  taxRegistrationNumber:
                    event.target.value,
                }))
              }
              placeholder="e.g. TIN 12345678-0001"
            />
          </div>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("Tax")}>
            Save Tax Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
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
                  reminderRatePerHour: Number(
                    event.target.value
                  ),
                }))
              }
            />

            <p className="text-xs text-muted-foreground">
              Throttles how many payment/expiry reminder emails go out per hour.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              First Reminder (days before due)
            </label>

            <Input
              type="number"
              min={1}
              max={30}
              value={draft.reminderDaysBeforeDue}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  reminderDaysBeforeDue: Number(
                    event.target.value
                  ),
                }))
              }
            />
          </div>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("Reminder")}>
            Save Reminder Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Default</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Default team notified on a new dispute
          </label>

          <Select
            value={draft.defaultEscalationTarget}
            onValueChange={(value) =>
              setDraft((current) => ({
                ...current,
                defaultEscalationTarget:
                  value as DisputeNotifyTarget,
              }))
            }
          >
            <SelectTrigger className="max-w-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {DISPUTE_NOTIFY_TARGET_OPTIONS.map(
                (option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            Pre-selects this option whenever someone opens the escalate dialog on a transaction — still changeable per dispute.
          </p>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("Escalation")}>
            Save Escalation Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <label className="text-sm text-muted-foreground">
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
          />

          <p className="text-xs text-muted-foreground">
            Zowasel will POST invoice, settlement and transaction status changes to this URL once connected to a real backend.
          </p>
        </CardContent>

        <CardContent className="flex justify-end pt-0">
          <Button onClick={() => save("Webhook")}>
            Save Webhook Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
