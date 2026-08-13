import { StatusTone } from "@/lib/statusTone";
import { GeographicScopeLevel } from "@/types/user";
import {
  LedgerCategory,
  LedgerTransactionStatus,
  MonitoredAccountRiskTier,
  MonitoredAccountStatus,
  StatementLineStatus,
} from "@/types/finance";

export const LEDGER_CATEGORY_LABELS: Record<LedgerCategory, string> = {
  Subscription: "Subscription",
  "Platform Fee": "Platform Fee",
  "Operational Outflow": "Operational Outflow",
  "Dispute Fee": "Dispute Fee",
  "Escrow Settlement": "Escrow Settlement",
  "Internal Transfer": "Internal Transfer",
};

// Delegation-of-authority ceiling per level, sized to Zowasel's actual
// transaction range (mock ledger entries run $30–$6k) rather than
// textbook enterprise DOA figures ($25k+ for a Finance Director at a much
// larger company). Global has no ceiling — it IS the policy-setter.
// null = uncapped.
export const APPROVAL_THRESHOLD_USD: Record<GeographicScopeLevel, number | null> = {
  country: 2_000,
  sub_region: 20_000,
  continent: 200_000,
  global: null,
};

// Cross-entity movement (internal transfers between Zowasel's own accounts)
// is a heavier, rarer operation than routine approval — real treasury
// practice keeps it out of the routine maker-checker ladder, restricted to
// the levels that actually set consolidation/treasury policy.
export const TRANSFER_CAPABLE_LEVELS: GeographicScopeLevel[] = ["continent", "global"];

// Real, well-known standard VAT rates — used for the Tax & Regulatory
// tracking card, not display-only figures.
export const VAT_RATE_BY_COUNTRY: Record<string, number> = {
  NG: 0.075,
  KE: 0.16,
  TZ: 0.18,
};

export const WHT_RATES_BY_COUNTRY: Record<string, number> = {
  NG: 0.10,
  KE: 0.05,
  TZ: 0.05,
};

// Monthly budget targets per category, in USD — sized to the real
// magnitude of Zowasel's own transaction data (Platform Fee revenue runs
// low thousands/month) rather than arbitrary round numbers.
export const MONTHLY_BUDGET_USD: Record<LedgerCategory, number> = {
  "Platform Fee": 3000,
  Subscription: 1000,
  "Operational Outflow": 1500,
  "Dispute Fee": 300,
  "Escrow Settlement": 6000,
  "Internal Transfer": 500,
};

export const LEDGER_STATUS_TONE: Record<LedgerTransactionStatus, StatusTone> = {
  Completed: "success",
  Pending: "warning",
  Failed: "danger",
  Refunded: "info",
  "Pending Approval": "warning",
  Rejected: "danger",
};

export const STATEMENT_LINE_STATUS_TONE: Record<StatementLineStatus, StatusTone> = {
  reconciled: "success",
  pending: "warning",
  discrepancy: "danger",
};

export const MONITORED_ACCOUNT_STATUS_TONE: Record<MonitoredAccountStatus, StatusTone> = {
  Active: "success",
  Dormant: "warning",
  Suspended: "danger",
};

export const MONITORED_ACCOUNT_RISK_TONE: Record<MonitoredAccountRiskTier, StatusTone> = {
  "Low Risk": "success",
  "Medium Risk": "warning",
  "High Risk": "danger",
};
