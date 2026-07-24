import {
  ArrowUpDown,
  Coins,
  Globe,
  Landmark,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import CurrencyGrid from "@/features/billing/components/CurrencyGrid";
import { mockCurrencies } from "@/features/billing/data/mockCurrencies";

export default function CurrencyPage() {
  const africanCurrencies =
    mockCurrencies.filter(
      (currency) => currency.region === "Africa"
    );

  const globalCurrencies =
    mockCurrencies.filter(
      (currency) => currency.region === "Global"
    );

  const operationalCurrencies =
    mockCurrencies.filter(
      (currency) =>
        currency.role === "Operational"
    );

  const settlementCurrencies =
    mockCurrencies.filter(
      (currency) =>
        currency.role === "Settlement"
    );

  const defaultCurrency =
    mockCurrencies.find(
      (currency) => currency.isDefault
    );

  const stats = [
    {
      title: "Total Currencies",
      value: mockCurrencies.length,
      icon: Coins,
    },
    {
      title: "Operational",
      value: operationalCurrencies.length,
      icon: Landmark,
    },
    {
      title: "Settlement",
      value: settlementCurrencies.length,
      icon: Globe,
    },
    {
      title: "Default",
      value: defaultCurrency?.code ?? "--",
      icon: ArrowUpDown,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold">
          Currency Management
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage supported currencies, exchange
          rates and settlement currencies across
          the platform.
        </p>
      </div>

      {/* Snapshot */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* African */}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            African Currencies
          </h2>

          <p className="text-sm text-muted-foreground">
            Operational currencies supported across
            African markets.
          </p>
        </div>

        <CurrencyGrid
          currencies={africanCurrencies}
        />
      </section>

      {/* Global */}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            Global Settlement Currencies
          </h2>

          <p className="text-sm text-muted-foreground">
            International currencies available for
            cross-border settlements.
          </p>
        </div>

        <CurrencyGrid
          currencies={globalCurrencies}
        />
      </section>
    </div>
  );
}