"use client";

import { useState } from "react";
import { Bell, Clock, Send, CheckCircle2, AlertTriangle, RefreshCw, Mail, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useReminders } from "../hooks/useReminders";
import { ReminderStatus } from "@/types/reminder";

export default function RemindersListView() {
  const { reminders, settings, triggerPaymentReminder, updateSettings } = useReminders();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState(settings.adminNotificationEmail);
  const [autoEmail, setAutoEmail] = useState(settings.autoSendEmail);
  const [autoSms, setAutoSms] = useState(settings.autoSendSms);

  const filteredReminders = reminders.filter(
    (item) =>
      item.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: ReminderStatus) => {
    switch (status) {
      case "Upcoming":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 gap-1"><Clock className="h-3 w-3" /> Upcoming</Badge>;
      case "Sent":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 gap-1"><CheckCircle2 className="h-3 w-3" /> Reminder Sent</Badge>;
      case "Overdue":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>;
      case "Auto-Renew":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200 gap-1"><RefreshCw className="h-3 w-3" /> Auto Renew</Badge>;
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      adminNotificationEmail: adminEmail,
      autoSendEmail: autoEmail,
      autoSendSms: autoSms,
    });
    setIsSettingsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Expiry Reminders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automated & manual billing notifications sent to business tenants before subscription renewals.
          </p>
        </div>
        <Button variant="outline" className="gap-2 self-start sm:self-auto" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-4 w-4" />
          Reminder Settings
        </Button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Expiring</p>
              <p className="mt-2 text-3xl font-bold">{reminders.filter((r) => r.status === "Upcoming").length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reminders Sent</p>
              <p className="mt-2 text-3xl font-bold">{reminders.filter((r) => r.status === "Sent").length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Send className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue Subscriptions</p>
              <p className="mt-2 text-3xl font-bold">{reminders.filter((r) => r.status === "Overdue").length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Auto-Renewal Active</p>
              <p className="mt-2 text-3xl font-bold">{reminders.filter((r) => r.status === "Auto-Renew").length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <RefreshCw className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Reminders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Expiration Queue</CardTitle>
              <CardDescription>All business subscriptions due for renewal within 30 days.</CardDescription>
            </div>
            <Input
              placeholder="Search by business, product, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Renewal Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReminders.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-foreground">{item.organizationName}</div>
                      <div className="text-xs text-muted-foreground">{item.contactEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{item.productName}</td>
                    <td className="px-4 py-3.5 font-semibold">
                      {item.currency} {item.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <div>{new Date(item.expiryDate).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">{item.daysUntilExpiry} days remaining</div>
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5"
                        onClick={() => triggerPaymentReminder(item.id)}
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Send Reminder
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reminder Schedule Settings</DialogTitle>
            <DialogDescription>
              Configure automated email & SMS triggers for expiring tenant subscriptions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Admin Alerts Notification Email</label>
              <Input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <div>
                <label className="text-sm font-medium text-foreground">Auto Send Email Reminders</label>
                <p className="text-xs text-muted-foreground">Triggers emails at 14, 7, and 3 days before expiry.</p>
              </div>
              <input
                type="checkbox"
                checked={autoEmail}
                onChange={(e) => setAutoEmail(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <div>
                <label className="text-sm font-medium text-foreground">Auto Send SMS Reminders</label>
                <p className="text-xs text-muted-foreground">Send SMS notifications to business account owner.</p>
              </div>
              <input
                type="checkbox"
                checked={autoSms}
                onChange={(e) => setAutoSms(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSettings}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
