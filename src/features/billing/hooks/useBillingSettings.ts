"use client";

import { useState } from "react";

import { BillingSettings } from "@/types/billing";

const defaultSettings: BillingSettings = {
  defaultCurrency: "NGN",
  invoicePrefix: "INV",
  paymentTerms: "net_30",
  taxRatePercentage: 7.5,
  taxRegistrationNumber: "",
  reminderRatePerHour: 50,
  reminderScheduleDays: [14, 7, 3],
  webhookUrl: "",
};

export function useBillingSettings() {
  const [settings, setSettings] = useState<BillingSettings>(
    defaultSettings
  );

  const updateSettings = (
    updates: Partial<BillingSettings>
  ) => {
    setSettings((current) => ({
      ...current,
      ...updates,
    }));
  };

  return {
    settings,
    updateSettings,
  };
}
