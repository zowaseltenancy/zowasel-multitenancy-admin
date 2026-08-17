import { FinanceBudget, BudgetApprovalStep, LedgerCategory, BudgetPeriodType, FinanceGovernanceRole } from "@/types/finance";
import { MONTHLY_BUDGET_USD, APPROVAL_THRESHOLD_USD } from "@/constants/finance";

// Same escalation ladder Requisitions and the transaction-approval gate
// already use (constants/finance.ts APPROVAL_THRESHOLD_USD) — a budget
// target routes to whichever tier's ceiling actually covers it, instead of
// every budget needing the same fixed signatory regardless of size.
function resolveApprovingRole(targetUSD: number): FinanceGovernanceRole {
  if (APPROVAL_THRESHOLD_USD.country !== null && targetUSD <= APPROVAL_THRESHOLD_USD.country) return "Country Finance Officer";
  if (APPROVAL_THRESHOLD_USD.sub_region !== null && targetUSD <= APPROVAL_THRESHOLD_USD.sub_region) return "Regional Finance Manager";
  if (APPROVAL_THRESHOLD_USD.continent !== null && targetUSD <= APPROVAL_THRESHOLD_USD.continent) return "Continental Finance Director";
  return "Chief Financial Officer";
}

// Very large budgets need the CEO's final authorization on top of CFO
// approval — mirrors Requisitions' 4th signatory tier, just with a threshold
// instead of "every requisition gets a CEO block."
const CEO_AUTHORIZATION_THRESHOLD_USD = 500_000;

export function buildApprovalChain(targetUSD: number, status: "draft" | "pending" | "approved" | "rejected"): BudgetApprovalStep[] {
  const approvingRole = resolveApprovingRole(targetUSD);
  const needsCeo = targetUSD > CEO_AUTHORIZATION_THRESHOLD_USD;

  const steps: BudgetApprovalStep[] = [
    { role: approvingRole, status: status === "draft" ? "awaiting" : status === "approved" || status === "rejected" ? status : "pending" },
  ];
  if (needsCeo) {
    steps.push({ role: "Chief Executive Officer", status: status === "approved" ? "approved" : "awaiting" });
  }
  return steps;
}

function monthBounds(monthsFromNow: number): { start: string; end: string; label: string } {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + monthsFromNow);
  const start = new Date(d);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: start.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
  };
}

function quarterBounds(quartersFromNow: number): { start: string; end: string; label: string } {
  const d = new Date();
  const currentQuarter = Math.floor(d.getMonth() / 3);
  const targetQuarterIndex = currentQuarter + quartersFromNow;
  const year = d.getFullYear() + Math.floor(targetQuarterIndex / 4);
  const quarterInYear = ((targetQuarterIndex % 4) + 4) % 4;
  const start = new Date(year, quarterInYear * 3, 1);
  const end = new Date(year, quarterInYear * 3 + 3, 0, 23, 59, 59);
  return { start: start.toISOString(), end: end.toISOString(), label: `Q${quarterInYear + 1} ${year}` };
}

function yearBounds(yearsFromNow: number): { start: string; end: string; label: string } {
  const year = new Date().getFullYear() + yearsFromNow;
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);
  return { start: start.toISOString(), end: end.toISOString(), label: `FY${year}` };
}

function weekBounds(weeksFromNow: number): { start: string; end: string; label: string } {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + weeksFromNow * 7);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: `Wk of ${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
  };
}

function periodBounds(periodType: BudgetPeriodType, offset: number) {
  if (periodType === "weekly") return weekBounds(offset);
  if (periodType === "monthly") return monthBounds(offset);
  if (periodType === "quarterly") return quarterBounds(offset);
  return yearBounds(offset);
}

let seq = 1;
function nextBudgetId(): string {
  return `BUD-${(seq++).toString().padStart(4, "0")}`;
}

function makeBudget(
  category: LedgerCategory,
  periodType: BudgetPeriodType,
  offset: number,
  targetUSD: number,
  status: "draft" | "pending" | "approved" | "rejected",
  createdByOfficerId: string,
  createdByName: string,
  daysAgoCreated: number
): FinanceBudget {
  const { start, end, label } = periodBounds(periodType, offset);
  const statusMap: Record<typeof status, FinanceBudget["status"]> = {
    draft: "draft",
    pending: "pending_approval",
    approved: "approved",
    rejected: "rejected",
  };
  const created = new Date();
  created.setDate(created.getDate() - daysAgoCreated);
  return {
    id: nextBudgetId(),
    category,
    periodType,
    periodLabel: label,
    periodStart: start,
    periodEnd: end,
    targetUSD,
    status: statusMap[status],
    createdByOfficerId,
    createdByName,
    createdAt: created.toISOString(),
    approvalSteps: buildApprovalChain(targetUSD, status),
  };
}

// Current-month budgets for all 6 categories, already approved — these back
// the default view of Budget vs Actual so it isn't empty on first load.
const currentMonthApproved: FinanceBudget[] = (Object.keys(MONTHLY_BUDGET_USD) as LedgerCategory[]).map((category) =>
  makeBudget(category, "monthly", 0, MONTHLY_BUDGET_USD[category], "approved", "usr_fin_cfo", "Folasade Bankole", 35)
);

export const mockBudgets: FinanceBudget[] = [
  ...currentMonthApproved,

  // Last month, also approved — gives the Manage Budgets table real history
  // to show, not just the current period.
  ...(Object.keys(MONTHLY_BUDGET_USD) as LedgerCategory[]).map((category) =>
    makeBudget(category, "monthly", -1, MONTHLY_BUDGET_USD[category], "approved", "usr_fin_country_ng", "Emeka Obiora", 65)
  ),

  // Next month's Escrow Settlement budget, raised and awaiting approval —
  // real content for the Approval Queue.
  makeBudget("Escrow Settlement", "monthly", 1, 8_500, "pending", "usr_fin_reg_wa", "Ngozi Chukwu", 2),
  makeBudget("Operational Outflow", "monthly", 1, 2_200, "pending", "usr_fin_country_ke", "Wanjiru Njoroge", 1),

  // A quarterly Platform Fee target, still in draft — nobody's submitted it yet.
  makeBudget("Platform Fee", "quarterly", 1, 12_000, "draft", "usr_fin_country_tz", "Juma Ngowi", 0),

  // A yearly Escrow Settlement budget, large enough to need CEO
  // authorization on top of CFO approval — proves the 2-step chain works.
  makeBudget("Escrow Settlement", "yearly", 0, 620_000, "pending", "usr_fin_cfo", "Folasade Bankole", 4),

  // A rejected one — Dispute Fee target someone tried to zero out.
  makeBudget("Dispute Fee", "monthly", 0, 50, "rejected", "usr_fin_country_ng", "Emeka Obiora", 20),

  // A weekly Operational Outflow budget — proves the weekly period type
  // isn't just decorative in the dropdown.
  makeBudget("Operational Outflow", "weekly", 0, 400, "approved", "usr_fin_reg_ea", "Amina Hassan", 6),
];
