import { Provider } from "@/types/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProviderCredentialsProps {
  provider: Provider;
}

export function ProviderCredentials({
  provider,
}: ProviderCredentialsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credentials</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Public Key</label>
          <Input
            value={provider.credentials.publicKey}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Secret Key</label>
          <Input
            value={provider.credentials.secretKey}
            readOnly
            type="password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Webhook Secret</label>
          <Input
            value={provider.credentials.webhookSecret}
            readOnly
            type="password"
          />
        </div>
      </CardContent>
    </Card>
  );
}