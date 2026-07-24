import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CurrencyDefaultBadge from "@/features/billing/components/CurrencyDefaultBadge";
import CurrencyRoleBadge from "@/features/billing/components/CurrencyRoleBadge";
import CurrencyStatusBadge from "@/features/billing/components/CurrencyStatusBadge";

import { mockCurrencies } from "@/features/billing/data/mockCurrencies";

interface Props {
  params: Promise<{
    currencyCode: string;
  }>;
}

export default async function CurrencyDetailsPage({
  params,
}: Props) {
  const { currencyCode } = await params;

  const currency = mockCurrencies.find(
    (currency) =>
      currency.code.toLowerCase() ===
      currencyCode.toLowerCase()
  );

  if (!currency) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/billing/currency"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Currencies
          </Link>

          <h1 className="text-3xl font-semibold">
            {currency.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            View operational information for this
            supported currency.
          </p>
        </div>

        <Button>
          <RefreshCcw className="mr-2 h-4 w-4" />

          Refresh Rate
        </Button>
      </div>

      {/* Information */}

      <Card>
        <CardHeader>
          <CardTitle>
            Currency Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <Info
            label="Name"
            value={currency.name}
          />

          <Info
            label="Code"
            value={currency.code}
          />

          <Info
            label="Symbol"
            value={currency.symbol}
          />

          <Info
            label="Region"
            value={currency.region}
          />

          <Info
            label="Exchange Rate"
            value={currency.exchangeRate.toString()}
          />

          <Info
            label="Decimal Places"
            value={currency.decimals.toString()}
          />

          <Info
            label="Last Updated"
            value={currency.lastUpdated}
          />

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <CurrencyRoleBadge
                role={currency.role}
              />

              <CurrencyStatusBadge
                enabled={currency.enabled}
              />

              <CurrencyDefaultBadge
                isDefault={currency.isDefault}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rate */}

      <Card>
        <CardHeader>
          <CardTitle>
            Exchange Rate
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Current Rate
            </span>

            <span className="font-semibold">
              {currency.exchangeRate}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Last Synced
            </span>

            <span>{currency.lastUpdated}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Source
            </span>

            <span>Exchange Rate Service</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 font-medium">
        {value}
      </p>
    </div>
  );
}