import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PeriodComparison } from "../utils/transaction";

interface Props {
  label: string;

  comparisonLabel: string;

  comparison: PeriodComparison;
}

export default function VolumeComparisonCard({
  label,
  comparisonLabel,
  comparison,
}: Props) {
  const isPositive =
    comparison.absoluteChange >= 0;

  return (
    <Card className="min-w-[220px] shrink-0">
      <CardContent className="space-y-2 p-5">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <h3 className="text-2xl font-bold">
          {comparison.currentVolume.toLocaleString()}
        </h3>

        {comparison.percentChange === null ? (
          <p className="text-xs text-muted-foreground">
            No {comparisonLabel} data to compare against.
          </p>
        ) : (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}

            <span>
              {isPositive ? "+" : ""}
              {comparison.percentChange.toFixed(1)}%
            </span>

            <span className="text-muted-foreground">
              ({isPositive ? "+" : ""}
              {comparison.absoluteChange.toLocaleString()})
            </span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          vs {comparisonLabel}
        </p>
      </CardContent>
    </Card>
  );
}
