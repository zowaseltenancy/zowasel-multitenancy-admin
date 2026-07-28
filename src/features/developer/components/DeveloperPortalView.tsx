"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Key, Webhook, Copy, Plus, Trash2, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string;
  status: "active" | "revoked";
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: "active" | "failing";
  createdAt: string;
}

export default function DeveloperPortalView() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key_001",
      name: "Production Master Integration Key",
      prefix: "zw_live_89a1...4f02",
      createdAt: "2026-01-10",
      lastUsedAt: "5 minutes ago",
      status: "active",
    },
    {
      id: "key_002",
      name: "Sandbox Testing Credentials",
      prefix: "zw_test_12c9...8e91",
      createdAt: "2026-03-15",
      lastUsedAt: "2 days ago",
      status: "active",
    },
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: "wh_001",
      url: "https://api.greenfieldsagro.com/webhooks/zowasel",
      events: ["farmer.registered", "mrv.report_generated", "payment.settled"],
      status: "active",
      createdAt: "2026-02-01",
    },
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("API Key name is required");
      return;
    }
    const created: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: `zw_live_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsedAt: "Never",
      status: "active",
    };
    setApiKeys([created, ...apiKeys]);
    setNewKeyName("");
    toast.success(`API Key "${created.name}" generated successfully!`);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("API Key revoked successfully.");
  };

  const handleAddWebhook = () => {
    if (!newWebhookUrl.trim()) {
      toast.error("Webhook endpoint URL is required");
      return;
    }
    const created: WebhookEndpoint = {
      id: `wh_${Date.now()}`,
      url: newWebhookUrl,
      events: ["farmer.registered", "payment.settled"],
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setWebhooks([created, ...webhooks]);
    setNewWebhookUrl("");
    toast.success("Webhook endpoint registered successfully!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* API Keys Section */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>API Keys & Developer Authentication</CardTitle>
                <CardDescription>Manage secret API keys for external ERP and third-party integrations.</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Key label (e.g. ERP System)..."
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-56 text-xs"
              />
              <Button size="sm" onClick={handleCreateApiKey} className="gap-1.5 shrink-0">
                <Plus className="h-4 w-4" /> Generate Key
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-3">Key Label</th>
                  <th className="px-4 py-3">Key Prefix</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{key.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground flex items-center gap-2">
                      <span>{key.prefix}</span>
                      <button type="button" onClick={() => copyToClipboard(key.prefix)} className="hover:text-primary">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{key.createdAt}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{key.lastUsedAt}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        Active
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/10" onClick={() => handleRevokeKey(key.id)}>
                        <Trash2 className="h-3.5 w-3.5" /> Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks Section */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Webhook Event Subscriptions</CardTitle>
                <CardDescription>Receive real-time HTTP POST notifications when key platform events occur.</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="https://api.tenant.com/webhooks"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="w-64 text-xs"
              />
              <Button size="sm" onClick={handleAddWebhook} className="gap-1.5 shrink-0">
                <Plus className="h-4 w-4" /> Add Webhook
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div key={wh.id} className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <span>{wh.url}</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      Active
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {wh.events.map((evt) => (
                      <span key={evt} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground">
                        {evt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => toast.success("Test ping sent to webhook!")}>
                    <RefreshCw className="h-3.5 w-3.5" /> Test Event Ping
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
