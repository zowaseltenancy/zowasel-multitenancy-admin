"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Provider } from "@/types/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProviderCredentialsProps {
  provider: Provider;
}

const FIELDS: {
  key: keyof Provider["credentials"];

  label: string;
}[] = [
  { key: "publicKey", label: "Public Key" },
  { key: "secretKey", label: "Secret Key" },
  { key: "webhookSecret", label: "Webhook Secret" },
  { key: "apiKey", label: "API Key" },
];

export function ProviderCredentials({
  provider,
}: ProviderCredentialsProps) {
  const [revealed, setRevealed] = useState(false);

  const visibleFields = FIELDS.filter(
    (field) => provider.credentials[field.key]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Credentials</CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setRevealed((value) => !value)}
        >
          {revealed ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Reveal
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {visibleFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No credentials stored for this provider yet.
          </p>
        ) : (
          visibleFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium">
                {field.label}
              </label>

              <Input
                value={provider.credentials[field.key]}
                readOnly
                type={revealed ? "text" : "password"}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
