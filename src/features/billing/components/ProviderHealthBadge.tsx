import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Provider } from "@/types/provider";

interface ProviderHealthBadgeProps {
  provider: Provider;
}

export function ProviderHealthBadge({
  provider,
}: ProviderHealthBadgeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Health</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium capitalize">
            {provider.health}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Response Time
          </p>
          <p className="font-medium">
            {provider.responseTime} ms
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Last Health Check
          </p>
          <p className="font-medium">
            {provider.lastHealthCheck}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Supported Currencies
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {provider.supportedCurrencies.map((currency) => (
              <span
                key={currency}
                className="rounded-md border px-2 py-1 text-xs"
              >
                {currency}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}