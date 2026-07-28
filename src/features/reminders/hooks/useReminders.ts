"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SubscriptionReminder, ReminderSettings } from "@/types/reminder";
import { mockReminders, defaultReminderSettings } from "../data/mockReminders";

export function useReminders() {
  const [reminders, setReminders] = useState<SubscriptionReminder[]>(mockReminders);
  const [settings, setSettings] = useState<ReminderSettings>(defaultReminderSettings);
  const [loading, setLoading] = useState(false);

  const triggerPaymentReminder = (reminderId: string) => {
    setLoading(true);
    setTimeout(() => {
      setReminders((prev) =>
        prev.map((item) =>
          item.id === reminderId
            ? {
                ...item,
                status: "Sent",
                lastNotifiedAt: new Date().toISOString(),
              }
            : item
        )
      );
      setLoading(false);
      toast.success("Payment reminder notification sent successfully!");
    }, 400);
  };

  const updateSettings = (newSettings: Partial<ReminderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast.success("Reminder settings updated successfully!");
  };

  return {
    reminders,
    settings,
    loading,
    triggerPaymentReminder,
    updateSettings,
  };
}
