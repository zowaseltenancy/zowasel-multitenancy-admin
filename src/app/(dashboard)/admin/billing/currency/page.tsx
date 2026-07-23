import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import ProviderStatusBadge from "@/features/billing/components/ProviderStatusBadge";
import ProviderEnvironmentBadge from "@/features/billing/components/ProviderEnvironmentBadge";

export default function CurrencyPage() {
  const exchangeProvider = {
    name: "ExchangeRate.host",
    status: "healthy" as const,
    environment: "live" as const,
    lastUpdated: "2 minutes ago",
  };

  const supportedCurrencies = [
    "NGN",
    "USD",
    "EUR",
    "KES",
    "GHS",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Currency Management
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage supported currencies and monitor the platform&apos;s
          exchange-rate provider.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Base Currency</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">NGN</p>
            <p className="text-muted-foreground">
              Nigerian Naira
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supported</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {supportedCurrencies.length}
            </p>

            <p className="text-muted-foreground">
              Active currencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exchange Provider</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-lg font-semibold">
              {exchangeProvider.name}
            </p>

            <div className="mt-3 flex gap-2">
              <ProviderStatusBadge
                status={exchangeProvider.status}
              />

              <ProviderEnvironmentBadge
                environment={exchangeProvider.environment}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supported Currencies</CardTitle>

          <CardDescription>
            These currencies are currently enabled across the
            platform.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            {supportedCurrencies.map((currency) => (
              <span
                key={currency}
                className="rounded-lg border px-3 py-2 text-sm font-medium"
              >
                {currency}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Rate Provider</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Provider
            </span>

            <span className="font-medium">
              {exchangeProvider.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Last Updated
            </span>

            <span className="font-medium">
              {exchangeProvider.lastUpdated}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}