import { OrganizationType } from "@/types/organization";

// Zowasel's own corporate/operational bank accounts — one per operating
// legal entity, always denominated in that entity's local currency. The
// USD figure shown anywhere is a computed rollup on top of this, never
// a substitute for the native balance.
export interface TreasuryAccount {
  id: string;
  accountName: string;
  bankName: string;
  maskedAccountNumber: string;
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  legalEntity: string;
  purpose: string;
  nativeBalance: number;
  // Local-currency units per 1 USD (same convention as GLOBAL_COUNTRY_CURRENCIES.baseRateToUSD).
  fxRateToUSD: number;
  fxRateAsOf: string;
}

export type LedgerCategory =
  | "Subscription"
  | "Platform Fee"
  | "Operational Outflow"
  | "Dispute Fee"
  | "Escrow Settlement"
  | "Internal Transfer";

export type LedgerChannel = "Online" | "Offline / Manual";

export type LedgerTransactionStatus =
  | "Completed"
  | "Pending"
  | "Failed"
  | "Refunded"
  | "Pending Approval"
  | "Rejected";

// The shared ledger feed: Billing's tenant-payment transactions flow into
// this shape (as Platform Fee / Online), plus Zowasel's own vendor
// outflows and settlements that Billing never tracks. Master Account
// reconciliation and the Platform Ledger page both read this one feed.
export interface LedgerTransaction {
  id: string;
  date: string;
  accountName: string;
  organizationId?: string;
  // Explicit where known (finance-only entries); derived from currency for
  // billing-derived entries that don't carry one — see useLedgerTransactions.
  countryCode?: string;
  category: LedgerCategory;
  channel: LedgerChannel;
  amount: number;
  currencyCode: string;
  type: "credit" | "debit";
  method: string;
  status: LedgerTransactionStatus;
  reference: string;
  receiptFileName?: string;
  recordedBy?: string;
  approvedBy?: string;
}

// The 5 real PlatformUserRole values that participate in Finance Hub's
// maker-checker chain. This is the single source of truth for "who can
// initiate/validate/approve/authorize" — Governance's Control Center Matrix
// reads and writes it, and Requisitions/Master Account/Budget gate real
// actions against it, instead of each screen inventing its own disconnected
// notion of authority.
export type FinanceGovernanceRole =
  | "Country Finance Officer"
  | "Regional Finance Manager"
  | "Continental Finance Director"
  | "Chief Financial Officer"
  | "Chief Executive Officer";

export interface FinanceRoleCapability {
  canInitiate: boolean;
  canValidate: boolean;
  canApprove: boolean;
  canAuthorize: boolean;
  approvalCapLabel: string;
}

export type MonitoredAccountStatus = "Active" | "Dormant" | "Suspended";
export type MonitoredAccountRiskTier = "Low Risk" | "Medium Risk" | "High Risk";

// A real organization's ledger footprint, computed from the shared
// transaction feed — not a hand-authored fictional business.
export interface MonitoredAccount {
  id: string;
  organizationId: string;
  accountName: string;
  accountType: OrganizationType;
  countryCode?: string;
  countryName?: string;
  createdDate: string;
  // USD-normalized — an org's transactions can span currencies, so these
  // are converted before summing rather than blending native amounts.
  totalVolumeProcessed: number;
  currentBalance: number;
  riskTier: MonitoredAccountRiskTier;
  status: MonitoredAccountStatus;
  lastActive: string | null;
}

export type StatementLineStatus = "reconciled" | "pending" | "discrepancy";

export interface StatementLine {
  id: string;
  date: string;
  narration: string;
  bankAmount: number;
  type: "credit" | "debit";
  bankAccount: string;
  internalTxnId: string | null;
  internalMatchName: string | null;
  status: StatementLineStatus;
  confidenceScore: number;
}

// Lightweight finance-specific audit trail — distinct from a general
// activity log: only actions that touch money state (reconcile, approve,
// suspend an account) land here, so they're independently citable.
export interface FinanceAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details?: string;
  // Which country this action pertains to, if any — lets the Activity Log
  // be scoped by the acting officer the same way accounts/transactions are.
  countryCode?: string;
}

// A real budget: a specific category, a specific period, a specific target —
// created and routed through the same maker-checker chain as Requisitions,
// instead of being a flat constant nobody actually set for a specific
// quarter or year. MONTHLY_BUDGET_USD (constants/finance.ts) still supplies
// sensible defaults when drafting a new one.
export type BudgetPeriodType = "weekly" | "monthly" | "quarterly" | "yearly";

export type BudgetStatus = "draft" | "pending_approval" | "approved" | "rejected";

export interface BudgetApprovalStep {
  // The capability a step requires, not a named individual — a budget isn't
  // tied to one fixed signatory roster the way a requisition's 4 blocks are.
  role: FinanceGovernanceRole;
  status: "pending" | "approved" | "rejected" | "awaiting";
  officerId?: string;
  officerName?: string;
  timestamp?: string;
  comment?: string;
}

export interface FinanceBudget {
  id: string;
  category: LedgerCategory;
  periodType: BudgetPeriodType;
  // Human label ("August 2026", "Q3 2026", "FY2026", "Wk 34, 2026") plus the
  // real bounding dates it resolves to, so "actual" can be computed by
  // filtering the shared ledger feed against periodStart/periodEnd — not
  // re-guessed per screen.
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  targetUSD: number;
  status: BudgetStatus;
  createdByOfficerId: string;
  createdByName: string;
  createdAt: string;
  approvalSteps: BudgetApprovalStep[];
}
