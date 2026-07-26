"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";

interface Props {
  transactions: Transaction[];

  days?: number;
}

interface DayBucket {
  date: string;

  label: string;

  volume: number;
}

function buildDailyBuckets(
  transactions: Transaction[],
  days: number
): DayBucket[] {
  const buckets: DayBucket[] = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    buckets.push({
      date: date.toDateString(),
      label: date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      volume: 0,
    });
  }

  const byDate = new Map(
    buckets.map((bucket) => [bucket.date, bucket])
  );

  for (const transaction of transactions) {
    const date = new Date(transaction.createdAt);
    const key = date.toDateString();

    const bucket = byDate.get(key);

    if (bucket) {
      bucket.volume += transaction.amount;
    }
  }

  return buckets;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DayBucket }[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const bucket = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-medium">{bucket.label}</p>
      <p className="text-muted-foreground">
        Volume: {bucket.volume.toLocaleString()}
      </p>
    </div>
  );
}

export default function TransactionVolumeChart({
  transactions,
  days = 14,
}: Props) {
  const data = buildDailyBuckets(transactions, days);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Volume Trend — Last {days} Days
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                left: 8,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={Math.ceil(days / 7) - 1}
                tick={{
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                }}
              />

              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "var(--muted)" }}
              />

              <Bar
                dataKey="volume"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
