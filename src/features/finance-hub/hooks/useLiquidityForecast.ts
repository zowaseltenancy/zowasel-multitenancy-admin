"use client";

import { useMemo } from "react";
import { mockSubscriptions } from "@/features/billing/data/mockSubscriptions";
import { BillingCycle } from "@/types/subscription";
import { LedgerTransaction } from "@/types/finance";
import { convertToUSD } from "../utils/currency";

const BILLING_CYCLE_DAYS: Record<BillingCycle, number> = { Monthly: 30, Quarterly: 90, Yearly: 365 };

export interface LiquidityForecastOptions {
  // Projection length — defaults to 13 weeks (standard treasury practice),
  // but the finance team can widen/narrow it to stress-test different
  // horizons without waiting on a code change.
  horizonWeeks?: number;
  // Scenario lever: "what if outflows run N% hotter than recent history."
  // 0 = no adjustment, uses the real historical run-rate as-is.
  outflowStressPct?: number;
  // Scenario lever: "what if only N% of scheduled renewals actually land
  // on time." 100 = assume every scheduled renewal happens as scheduled.
  renewalConfidencePct?: number;
}

// Rolling liquidity forecast — real direct-method projection, shared by both
// the Finance Hub overview cards and the Analytics Liquidity Forecast tab so
// they can never silently disagree (the overview page used to show a
// hardcoded $1,784,500 / "14.2 Mos" while Analytics computed a real,
// different number from the same underlying transactions). Inflows combine
// scheduled subscription renewals (walked forward by each subscription's own
// billing cycle) with the ongoing Platform Fee run-rate (recurring
// per-transaction revenue that doesn't stop at the horizon start, so it gets
// the same historical-run-rate treatment as outflow). Outflow is the real
// weekly debit run-rate from completed ledger transactions, excluding Escrow
// Settlement — that's fiduciary pass-through of buyer funds Zowasel already
// collected and holds in trust, not its own operating spend. Rolls forward
// automatically since it's always computed from "now." The two scenario
// levers (outflowStressPct, renewalConfidencePct) scale the real baseline —
// they don't replace it with hand-typed numbers.
export function useLiquidityForecast(transactions: LedgerTransaction[], options: LiquidityForecastOptions = {}) {
  const { horizonWeeks = 13, outflowStressPct = 0, renewalConfidencePct = 100 } = options;

  return useMemo(() => {
    const completed = transactions.filter((t) => t.status === "Completed");
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const horizonStart = Date.now();
    const horizonEnd = horizonStart + horizonWeeks * weekMs;

    const renewalEvents: { time: number; amountUSD: number }[] = [];
    mockSubscriptions.forEach((sub) => {
      if (sub.status === "Cancelled") return;
      const cycleMs = BILLING_CYCLE_DAYS[sub.billingCycle] * 24 * 60 * 60 * 1000;
      let nextTime = new Date(sub.nextRenewal).getTime();
      while (nextTime < horizonStart) nextTime += cycleMs; // catch up if nextRenewal already passed
      while (nextTime <= horizonEnd) {
        renewalEvents.push({ time: nextTime, amountUSD: convertToUSD(sub.amount, sub.currency) });
        if (!sub.autoRenew) break; // fixed-term / trial subscriptions only renew once, if at all
        nextTime += cycleMs;
      }
    });

    // Escrow Settlement debits are fiduciary pass-through — Zowasel disburses
    // buyer funds it already collected and held in trust for a
    // cooperative/off-taker, not its own operating spend. Counting them as
    // cash burn would make runway swing on trade volume that never touched
    // Zowasel's own P&L, so only genuine operating outflows count here.
    const debitTxns = completed.filter((t) => t.type === "debit" && t.category !== "Escrow Settlement");
    const totalDebitUSD = debitTxns.reduce((s, t) => s + convertToUSD(t.amount, t.currencyCode), 0);
    const oldestDebitTime =
      debitTxns.length > 0 ? Math.min(...debitTxns.map((t) => new Date(t.date).getTime())) : horizonStart - 30 * 24 * 60 * 60 * 1000;
    const historyWeeks = Math.max(1, (horizonStart - oldestDebitTime) / weekMs);
    const baseWeeklyOutflowRunRate = totalDebitUSD / historyWeeks;
    const weeklyOutflowRunRate = baseWeeklyOutflowRunRate * (1 + outflowStressPct / 100);

    // Platform Fee is Zowasel's ongoing per-transaction revenue (distinct
    // from the discrete, scheduled subscription renewals above) — it never
    // stops just because the forecast horizon starts, so it belongs in the
    // same historical-run-rate treatment as outflow, not left out entirely.
    const platformFeeCredits = completed.filter((t) => t.type === "credit" && t.category === "Platform Fee");
    const totalPlatformFeeUSD = platformFeeCredits.reduce((s, t) => s + convertToUSD(t.amount, t.currencyCode), 0);
    const oldestPlatformFeeTime =
      platformFeeCredits.length > 0 ? Math.min(...platformFeeCredits.map((t) => new Date(t.date).getTime())) : horizonStart - 30 * 24 * 60 * 60 * 1000;
    const platformFeeHistoryWeeks = Math.max(1, (horizonStart - oldestPlatformFeeTime) / weekMs);
    const weeklyPlatformFeeRunRate = totalPlatformFeeUSD / platformFeeHistoryWeeks;

    const confidenceFactor = Math.max(0, Math.min(100, renewalConfidencePct)) / 100;

    let cumulativeNet = 0;
    const weeks = Array.from({ length: horizonWeeks }, (_, i) => {
      const weekStart = horizonStart + i * weekMs;
      const weekEnd = weekStart + weekMs;
      const renewalInflow =
        renewalEvents.filter((e) => e.time >= weekStart && e.time < weekEnd).reduce((s, e) => s + e.amountUSD, 0) * confidenceFactor;
      const inflow = renewalInflow + weeklyPlatformFeeRunRate;
      const netLiquidity = inflow - weeklyOutflowRunRate;
      cumulativeNet += netLiquidity;
      return { week: `Wk ${i + 1}`, Inflow: Math.round(inflow), Outflow: Math.round(weeklyOutflowRunRate), NetLiquidity: Math.round(netLiquidity) };
    });

    const runwayMonths = weeklyOutflowRunRate > 0 ? cumulativeNet / weeklyOutflowRunRate / 4.33 : 0;
    const netInflowHorizon = weeks.reduce((sum, w) => sum + w.NetLiquidity, 0);

    return { weeks, runwayMonths, netInflow13wk: netInflowHorizon };
  }, [transactions, horizonWeeks, outflowStressPct, renewalConfidencePct]);
}
