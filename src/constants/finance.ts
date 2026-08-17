import { StatusTone } from "@/lib/statusTone";
import { GeographicScopeLevel } from "@/types/user";
import {
  LedgerCategory,
  LedgerTransactionStatus,
  MonitoredAccountRiskTier,
  MonitoredAccountStatus,
  StatementLineStatus,
  FinanceGovernanceRole,
  FinanceRoleCapability,
} from "@/types/finance";

// Re-exported for existing call sites (GovernanceView, FinanceOfficerContext)
// that import these from constants/finance — the type definitions
// themselves live in types/finance.ts now (a domain's shapes belong with its
// other types, not its static data), needed there too so the new Budget
// types can reference FinanceGovernanceRole without types/finance.ts
// importing back from constants/finance.ts.
export type { FinanceGovernanceRole, FinanceRoleCapability };

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

export const FINANCE_ROLE_CAPABILITIES: Record<FinanceGovernanceRole, FinanceRoleCapability> = {
  "Country Finance Officer": { canInitiate: true, canValidate: true, canApprove: true, canAuthorize: false, approvalCapLabel: "$2,000" },
  "Regional Finance Manager": { canInitiate: true, canValidate: true, canApprove: true, canAuthorize: false, approvalCapLabel: "$20,000" },
  "Continental Finance Director": { canInitiate: true, canValidate: true, canApprove: true, canAuthorize: false, approvalCapLabel: "$200,000" },
  "Chief Financial Officer": { canInitiate: true, canValidate: true, canApprove: true, canAuthorize: true, approvalCapLabel: "Uncapped" },
  "Chief Executive Officer": { canInitiate: false, canValidate: false, canApprove: false, canAuthorize: true, approvalCapLabel: "Authorize Only" },
};

export const NO_FINANCE_CAPABILITY: FinanceRoleCapability = {
  canInitiate: false,
  canValidate: false,
  canApprove: false,
  canAuthorize: false,
  approvalCapLabel: "No Access",
};

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
