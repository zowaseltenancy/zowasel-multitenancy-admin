"use client";

import { useState } from "react";
import { mockBudgets, buildApprovalChain } from "../data/mockBudgets";
import { FinanceBudget, LedgerCategory, LedgerTransaction, BudgetPeriodType } from "@/types/finance";
import { convertToUSD } from "../utils/currency";

export interface NewBudgetInput {
  category: LedgerCategory;
  periodType: BudgetPeriodType;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  targetUSD: number;
  createdByOfficerId: string;
  createdByName: string;
}

let seq = mockBudgets.length + 1;
function nextBudgetId(): string {
  return `BUD-${(seq++).toString().padStart(4, "0")}`;
}

// Real budget records with a real maker-checker chain (buildApprovalChain,
// same escalation ladder as transaction approvals), replacing the old
// MONTHLY_BUDGET_USD flat constant nobody actually set for a specific period
// — that constant still supplies sensible defaults when drafting a new one.
export function useBudgets() {
  const [budgets, setBudgets] = useState<FinanceBudget[]>(mockBudgets);

  const createBudget = (input: NewBudgetInput) => {
    const newBudget: FinanceBudget = {
      id: nextBudgetId(),
      category: input.category,
      periodType: input.periodType,
      periodLabel: input.periodLabel,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      targetUSD: input.targetUSD,
      status: "draft",
      createdByOfficerId: input.createdByOfficerId,
      createdByName: input.createdByName,
      createdAt: new Date().toISOString(),
      approvalSteps: buildApprovalChain(input.targetUSD, "draft"),
    };
    setBudgets((prev) => [newBudget, ...prev]);
    return newBudget;
  };

  const submitForApproval = (id: string) => {
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const steps = b.approvalSteps.map((s, i) => (i === 0 ? { ...s, status: "pending" as const } : s));
        return { ...b, status: "pending_approval", approvalSteps: steps };
      })
    );
  };

  // Advances whichever step is currently "pending" — if that was the last
  // step, the whole budget becomes approved; otherwise the next step (e.g.
  // CEO authorization on a large budget) becomes pending in turn, same
  // multi-stage pattern Requisitions uses.
  const approveBudget = (id: string, approvedByName: string, approvedByOfficerId: string) => {
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        let advanced = false;
        const steps = b.approvalSteps.map((s) => {
          if (!advanced && s.status === "pending") {
            advanced = true;
            return { ...s, status: "approved" as const, officerId: approvedByOfficerId, officerName: approvedByName, timestamp: new Date().toISOString() };
          }
          return s;
        });
        let promotedNext = false;
        const finalSteps = steps.map((s) => {
          if (s.status === "awaiting" && !promotedNext) {
            promotedNext = true;
            return { ...s, status: "pending" as const };
          }
          return s;
        });
        const allApproved = finalSteps.every((s) => s.status === "approved");
        return { ...b, status: allApproved ? "approved" : "pending_approval", approvalSteps: finalSteps };
      })
    );
  };

  const rejectBudget = (id: string, rejectedByName: string, rejectedByOfficerId: string, comment?: string) => {
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const steps = b.approvalSteps.map((s) =>
          s.status === "pending" ? { ...s, status: "rejected" as const, officerId: rejectedByOfficerId, officerName: rejectedByName, comment, timestamp: new Date().toISOString() } : s
        );
        return { ...b, status: "rejected", approvalSteps: steps };
      })
    );
  };

  // Real "actual" for a budget's own period — filters the shared ledger
  // feed by the budget's exact date bounds and category, not a hardcoded
  // trailing window that ignores what period the budget was actually set for.
  const computeActualUSD = (budget: FinanceBudget, transactions: LedgerTransaction[]): number => {
    const start = new Date(budget.periodStart).getTime();
    const end = new Date(budget.periodEnd).getTime();
    return transactions
      .filter((t) => t.status === "Completed" && t.category === budget.category)
      .filter((t) => {
        const time = new Date(t.date).getTime();
        return time >= start && time <= end;
      })
      .reduce((sum, t) => sum + convertToUSD(t.amount, t.currencyCode), 0);
  };

  return { budgets, createBudget, submitForApproval, approveBudget, rejectBudget, computeActualUSD };
}
