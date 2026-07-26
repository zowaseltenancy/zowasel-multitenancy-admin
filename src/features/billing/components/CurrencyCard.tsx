import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import CurrencyDefaultBadge from "./CurrencyDefaultBadge";
import CurrencyRoleBadge from "./CurrencyRoleBadge";
import CurrencyStatusBadge from "./CurrencyStatusBadge";

import { Currency } from "@/types/currency";

interface Props {
  currency: Currency;

  markupPercentage: number;
}

export default function CurrencyCard({
  currency,
  markupPercentage,
}: Props) {
  const markedUpRate =
    currency.exchangeRate *
    (1 + markupPercentage / 100);
  return (
    <Link
      href={`/admin/billing/currency/${currency.code}`}
    >
      <Card className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
        <CardContent className="flex h-full flex-col gap-5 p-6">
          {/* Header */}

          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold">
                {currency.symbol}
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                {currency.code}
              </h3>

              <p className="text-sm text-muted-foreground">
                {currency.name}
              </p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>

          {/* Badges */}

          <div className="flex flex-wrap gap-2">
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

          {/* Footer */}

          <div className="space-y-2 border-t pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Base Rate
              </span>

              <span className="font-medium">
                {currency.exchangeRate.toFixed(
                  currency.decimals
                )}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-primary/5 px-2 py-1.5">
              <span className="text-muted-foreground">
                With Markup ({markupPercentage}%)
              </span>

              <span className="font-semibold text-primary">
                {markedUpRate.toFixed(
                  Math.max(currency.decimals, 4)
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Region
              </span>

              <span>{currency.region}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />

              <span>
                Updated {currency.lastUpdated}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}