"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Percent } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  markupPercentage: number;

  onChange: (value: number) => void;
}

export default function CurrencyMarkupConfig({
  markupPercentage,
  onChange,
}: Props) {
  const [draft, setDraft] = useState(
    markupPercentage.toString()
  );

  const parsed = Number(draft);

  const isValid =
    draft.trim().length > 0 &&
    !Number.isNaN(parsed) &&
    parsed >= 0 &&
    parsed <= 20;

  const exampleAmount = 100000;

  const exampleRate = 0.00064;

  const convertedAmount =
    exampleAmount *
    exampleRate *
    (1 + (isValid ? parsed : markupPercentage) / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Exchange Rate Markup
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          A percentage added on top of the raw provider exchange rate on every conversion, to protect against rate fluctuations between conversion and settlement.
        </p>

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <label className="text-sm text-muted-foreground">
              Markup (%)
            </label>

            <div className="relative mt-1">
              <Input
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={draft}
                onChange={(event) =>
                  setDraft(event.target.value)
                }
                className="pr-8"
              />

              <Percent className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <Button
            disabled={!isValid}
            onClick={() => {
              onChange(parsed);

              toast.success(
                `Exchange rate markup set to ${parsed}%.`
              );
            }}
          >
            Save Markup
          </Button>
        </div>

        {!isValid && (
          <p className="text-sm text-destructive">
            Enter a markup between 0% and 20%.
          </p>
        )}

        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <p className="text-muted-foreground">
            Example: converting NGN 100,000 to USD at a raw rate of 0.00064, with a{" "}
            {isValid ? parsed : markupPercentage}% markup —
          </p>

          <p className="mt-2 font-mono text-xs text-muted-foreground">
            convertedAmount = amount × rate × (1 + markup%)
          </p>

          <p className="mt-2 font-semibold">
            USD {convertedAmount.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
