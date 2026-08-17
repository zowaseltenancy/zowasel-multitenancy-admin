"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Edit2, Check, X, KeyRound } from "lucide-react";

import { Provider, ProviderCredentials as ProviderCredsType } from "@/types/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProviderCredentialsProps {
  provider: Provider;
  onUpdate?: (updates: Partial<Provider>) => void;
}

const FIELDS: {
  key: keyof ProviderCredsType;
  label: string;
  placeholder: string;
}[] = [
  { key: "publicKey", label: "Public Key", placeholder: "pk_test_..." },
  { key: "secretKey", label: "Secret Key", placeholder: "sk_test_..." },
  { key: "webhookSecret", label: "Webhook Secret", placeholder: "whsec_..." },
  { key: "apiKey", label: "API Key", placeholder: "api_key_..." },
];

export function ProviderCredentials({
  provider,
  onUpdate,
}: ProviderCredentialsProps) {
  const [revealed, setRevealed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [creds, setCreds] = useState<ProviderCredsType>({
    publicKey: provider.credentials.publicKey || "",
    secretKey: provider.credentials.secretKey || "",
    webhookSecret: provider.credentials.webhookSecret || "",
    apiKey: provider.credentials.apiKey || "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate({
        credentials: {
          publicKey: creds.publicKey || undefined,
          secretKey: creds.secretKey || undefined,
          webhookSecret: creds.webhookSecret || undefined,
          apiKey: creds.apiKey || undefined,
        },
      });
      toast.success("Provider credentials updated successfully.");
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCreds({
      publicKey: provider.credentials.publicKey || "",
      secretKey: provider.credentials.secretKey || "",
      webhookSecret: provider.credentials.webhookSecret || "",
      apiKey: provider.credentials.apiKey || "",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            API Keys & Security Credentials
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Encrypted keys and webhook signing secrets used for gateway dispatch and payment webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealed((value) => !value)}
                className="gap-1.5 text-xs font-semibold cursor-pointer"
              >
                {revealed ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Reveal Keys
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(true);
                  setRevealed(true);
                }}
                className="gap-1.5 text-xs font-semibold cursor-pointer border-primary/40 text-primary hover:bg-primary/10"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Credentials
              </Button>
            </>
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
                Save Credentials
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!isEditing ? (
          <div className="grid gap-4 md:grid-cols-2">
            {FIELDS.map((field) => {
              const val = provider.credentials[field.key];
              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {field.label}
                  </label>
                  <Input
                    value={val || "— Not configured —"}
                    readOnly
                    type={revealed || !val ? "text" : "password"}
                    className={`h-9 font-mono text-xs font-semibold ${
                      !val ? "text-muted-foreground italic bg-muted/20" : "bg-muted/40"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {field.label}
                </label>
                <Input
                  value={creds[field.key] || ""}
                  onChange={(e) =>
                    setCreds((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className="h-9 font-mono text-xs font-semibold"
                />
              </div>
            ))}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
