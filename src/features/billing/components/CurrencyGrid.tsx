import { Currency } from "@/types/currency";

import CurrencyCard from "./CurrencyCard";

interface Props {
  currencies: Currency[];

  markupPercentage: number;
}

export default function CurrencyGrid({
  currencies,
  markupPercentage,
}: Props) {
  if (currencies.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">
          No currencies found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {currencies.map((currency) => (
        <CurrencyCard
          key={currency.id}
          currency={currency}
          markupPercentage={markupPercentage}
        />
      ))}
    </div>
  );
}