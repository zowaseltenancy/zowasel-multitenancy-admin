"use client";

import { useState } from "react";
import {
  Target,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  X,
  Sliders,
} from "lucide-react";
import {
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import ExportMenu from "@/components/shared/ExportMenu";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { useLedgerTransactions } from "@/features/finance-hub/hooks/useLedgerTransactions";
import { useBudgets } from "@/features/finance-hub/hooks/useBudgets";
import { formatUSD } from "@/features/finance-hub/utils/currency";
import { LEDGER_CATEGORY_LABELS, MONTHLY_BUDGET_USD } from "@/constants/finance";
import { LedgerCategory, BudgetPeriodType, FinanceBudget } from "@/types/finance";
import { toast } from "sonner";

const PERIOD_LABELS: Record<BudgetPeriodType, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

function isCurrentPeriod(budget: FinanceBudget): boolean {
  const now = Date.now();
  return new Date(budget.periodStart).getTime() <= now && now <= new Date(budget.periodEnd).getTime();
}

function periodBoundsFor(periodType: BudgetPeriodType) {
  // Mirrors mockBudgets.ts's period math for the create form, so a freshly
  // drafted budget resolves to the same real calendar bounds an approved
  // one would.
  const now = new Date();
  if (periodType === "weekly") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000 + 86399000);
    return { start: start.toISOString(), end: end.toISOString(), label: `Wk of ${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}` };
  }
  if (periodType === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { start: start.toISOString(), end: end.toISOString(), label: start.toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
  }
  if (periodType === "quarterly") {
    const q = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), q * 3, 1);
    const end = new Date(now.getFullYear(), q * 3 + 3, 0, 23, 59, 59);
    return { start: start.toISOString(), end: end.toISOString(), label: `Q${q + 1} ${now.getFullYear()}` };
  }
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  return { start: start.toISOString(), end: end.toISOString(), label: `FY${now.getFullYear()}` };
}

export default function BudgetPerformancePage() {
  const { actingOfficer, actingOfficerCapability } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();
  const { transactions } = useLedgerTransactions();
  const { budgets, createBudget, submitForApproval, approveBudget, rejectBudget, computeActualUSD } = useBudgets();

  const actorName = `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position || actingOfficer.role})`;

  const [activeTab, setActiveTab] = useState<string>("performance");
  const [performancePeriodType, setPerformancePeriodType] = useState<BudgetPeriodType>("monthly");
  const [performanceChartType, setPerformanceChartType] = useState<"progress" | "composed">("progress");
  const [commentInput, setCommentInput] = useState("");

  // Create Budget modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategory, setNewCategory] = useState<LedgerCategory>("Operational Outflow");
  const [newPeriodType, setNewPeriodType] = useState<BudgetPeriodType>("monthly");
  const [newTarget, setNewTarget] = useState<string>(String(MONTHLY_BUDGET_USD["Operational Outflow"]));

  const budgetPills = [
    { id: "performance", label: "Performance & Variance", icon: Target },
    { id: "manage", label: "Manage Budgets", icon: Sliders, badge: budgets.length },
    { id: "queue", label: "Approval Queue", icon: Clock, badge: budgets.filter((b) => b.status === "pending_approval").length },
  ];

  // --- Performance & Variance ---
  const currentPeriodBudgets = budgets.filter((b) => b.status === "approved" && b.periodType === performancePeriodType && isCurrentPeriod(b));

  const performanceRows = currentPeriodBudgets.map((b) => {
    const actualUSD = computeActualUSD(b, transactions);
    const variancePct = b.targetUSD > 0 ? ((actualUSD - b.targetUSD) / b.targetUSD) * 100 : 0;
    const isOutflowCategory = b.category !== "Platform Fee" && b.category !== "Subscription";

    // Real "vs prior period" comparison — the closest earlier approved
    // budget of the same category + period type, not a fabricated year of
    // history that doesn't exist in the mock data yet.
    const priorBudget = budgets
      .filter((p) => p.status === "approved" && p.category === b.category && p.periodType === b.periodType && new Date(p.periodEnd).getTime() < new Date(b.periodStart).getTime())
      .sort((a, c) => new Date(c.periodEnd).getTime() - new Date(a.periodEnd).getTime())[0];
    const priorActualUSD = priorBudget ? computeActualUSD(priorBudget, transactions) : null;

    return { budget: b, actualUSD, variancePct, isOutflowCategory, priorBudget, priorActualUSD };
  });

  // --- Approval Queue ---
  const pendingBudgets = budgets.filter((b) => b.status === "pending_approval");

  const currentPendingStep = (b: FinanceBudget) => b.approvalSteps.find((s) => s.status === "pending");

  const canActOnBudget = (b: FinanceBudget): { allowed: boolean; reason?: string } => {
    const step = currentPendingStep(b);
    if (!step) return { allowed: false, reason: "No pending step" };
    if (actingOfficer.role !== step.role) {
      return { allowed: false, reason: `Only a ${step.role} can act on this stage. You are acting as ${actingOfficer.role}.` };
    }
    const requiredCapability = step.role === "Chief Executive Officer" ? actingOfficerCapability.canAuthorize : actingOfficerCapability.canApprove;
    if (!requiredCapability) {
      return { allowed: false, reason: `${actorName} does not hold the required authority for this stage.` };
    }
    return { allowed: true };
  };

  const handleApprove = (b: FinanceBudget) => {
    const check = canActOnBudget(b);
    if (!check.allowed) {
      toast.error(`STAGE BLOCKED: ${check.reason}`);
      return;
    }
    approveBudget(b.id, actorName, actingOfficer.id);
    logAction(actorName, "Approved budget stage", `${b.id} — ${LEDGER_CATEGORY_LABELS[b.category]} (${b.periodLabel})`, commentInput || "Approved");
    toast.success(`${b.id} stage signed off by ${actorName}.`);
    setCommentInput("");
  };

  const handleReject = (b: FinanceBudget) => {
    const check = canActOnBudget(b);
    if (!check.allowed) {
      toast.error(`STAGE BLOCKED: ${check.reason}`);
      return;
    }
    rejectBudget(b.id, actorName, actingOfficer.id, commentInput || "Rejected");
    logAction(actorName, "Rejected budget", `${b.id} — ${LEDGER_CATEGORY_LABELS[b.category]} (${b.periodLabel})`, commentInput || "Rejected");
    toast.error(`${b.id} rejected by ${actorName}.`);
    setCommentInput("");
  };

  const handleSubmitForApproval = (b: FinanceBudget) => {
    if (!actingOfficerCapability.canInitiate) {
      toast.error(`${actorName} does not hold Initiate authority and cannot submit budgets for approval.`);
      return;
    }
    submitForApproval(b.id);
    logAction(actorName, "Submitted budget for approval", `${b.id} — ${LEDGER_CATEGORY_LABELS[b.category]} (${b.periodLabel})`, formatUSD(b.targetUSD));
    toast.success(`${b.id} submitted for approval.`);
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actingOfficerCapability.canInitiate) {
      toast.error(`${actorName} does not hold Initiate authority and cannot draft a new budget.`);
      return;
    }
    const targetUSD = parseFloat(newTarget) || 0;
    if (targetUSD <= 0) {
      toast.error("Enter a target amount greater than zero.");
      return;
    }
    const { start, end, label } = periodBoundsFor(newPeriodType);
    const created = createBudget({
      category: newCategory,
      periodType: newPeriodType,
      periodLabel: label,
      periodStart: start,
      periodEnd: end,
      targetUSD,
      createdByOfficerId: actingOfficer.id,
      createdByName: actorName,
    });
    logAction(actorName, "Drafted new budget", `${created.id} — ${LEDGER_CATEGORY_LABELS[newCategory]} (${label})`, formatUSD(targetUSD));
    toast.success(`Budget drafted for ${LEDGER_CATEGORY_LABELS[newCategory]} — ${label}.`);
    setShowCreateModal(false);
    setNewTarget(String(MONTHLY_BUDGET_USD[newCategory]));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Budget Performance</h1>
            <PageHeaderInfo
              title="Budget Performance Scope"
              description="Real budgets — created, routed through the same maker-checker chain as Requisitions, and tracked against actual ledger activity for their own specific period, not a flat monthly constant."
            />
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="h-9 bg-primary font-bold text-xs gap-2 shadow-2xs cursor-pointer">
          <PlusCircle className="h-4 w-4" /> Create Budget
        </Button>
      </div>

      <SubSectionPillNav items={budgetPills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB 1: Performance & Variance */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          <Card id="budget-performance-chart" className="w-full border shadow-2xs">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span>{PERIOD_LABELS[performancePeriodType]} Budget vs. Actual</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Real approved budgets for the current {performancePeriodType.replace("ly", "")} period, compared against actual completed ledger activity for that exact window.
                  </CardDescription>
                </div>
                <ExportMenu
                  data={performanceRows.map((r) => ({
                    Category: LEDGER_CATEGORY_LABELS[r.budget.category],
                    Period: r.budget.periodLabel,
                    "Target USD": r.budget.targetUSD,
                    "Actual USD": Math.round(r.actualUSD),
                    "Variance %": `${r.variancePct >= 0 ? "+" : ""}${r.variancePct.toFixed(1)}%`,
                  }))}
                  columns={[
                    { header: "Category", accessor: "Category" },
                    { header: "Period", accessor: "Period" },
                    { header: "Target USD", accessor: "Target USD" },
                    { header: "Actual USD", accessor: "Actual USD" },
                    { header: "Variance %", accessor: "Variance %" },
                  ]}
                  filename={`budget-performance-${performancePeriodType}`}
                  targetElementId="budget-performance-chart"
                />
              </div>

              <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
                  {(Object.keys(PERIOD_LABELS) as BudgetPeriodType[]).map((pt) => (
                    <button
                      key={pt}
                      onClick={() => setPerformancePeriodType(pt)}
                      className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                        performancePeriodType === pt ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {PERIOD_LABELS[pt]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 border bg-card p-1 rounded-lg">
                  <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                  <select
                    value={performanceChartType}
                    onChange={(e) => setPerformanceChartType(e.target.value as "progress" | "composed")}
                    className="rounded bg-background border px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="progress">Progress Cards</option>
                    <option value="composed">Combo (Bar + Variance Line)</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceRows.length === 0 ? (
                <p className="text-xs text-muted-foreground p-6 text-center">
                  No approved {performancePeriodType} budgets cover the current period yet. Draft one from &ldquo;Create Budget&rdquo; and route it through approval.
                </p>
              ) : performanceChartType === "progress" ? (
                performanceRows.map(({ budget, actualUSD, variancePct, isOutflowCategory, priorActualUSD, priorBudget }) => {
                  const over = variancePct > 0;
                  const badDirection = isOutflowCategory ? over : !over;
                  return (
                    <div key={budget.id} className="space-y-1.5 p-3 border rounded-xl bg-card">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-foreground text-sm">
                          {LEDGER_CATEGORY_LABELS[budget.category]} <span className="text-muted-foreground font-semibold">— {budget.periodLabel}</span>
                        </span>
                        <span className="font-mono text-muted-foreground">
                          {formatUSD(actualUSD)} / {formatUSD(budget.targetUSD)} target
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full ${badDirection ? "bg-rose-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(100, (actualUSD / budget.targetUSD) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="text-muted-foreground font-semibold">
                          Performance: {Math.min(100, (actualUSD / budget.targetUSD) * 100).toFixed(0)}% of target
                        </span>
                        <span className={`flex items-center gap-1 font-extrabold ${badDirection ? "text-rose-600" : "text-emerald-600"}`}>
                          {over ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          Variance: {over ? "+" : ""}{variancePct.toFixed(1)}% {over ? "over" : "under"} budget
                        </span>
                      </div>
                      {priorBudget && priorActualUSD !== null && (
                        <p className="text-[10px] text-muted-foreground pt-0.5 border-t mt-1">
                          vs {priorBudget.periodLabel}: {formatUSD(priorActualUSD)} actual ({priorActualUSD > 0 ? (((actualUSD - priorActualUSD) / priorActualUSD) * 100).toFixed(0) : "—"}% {actualUSD >= priorActualUSD ? "increase" : "decrease"})
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="h-[320px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={performanceRows.map((r) => ({
                        name: LEDGER_CATEGORY_LABELS[r.budget.category],
                        Actual: r.actualUSD,
                        Target: r.budget.targetUSD,
                        "Variance %": Number(r.variancePct.toFixed(1)),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="usd" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="pct" orientation="right" tick={{ fontSize: 11 }} unit="%" />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Bar yAxisId="usd" dataKey="Actual" name="Actual Amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="usd" dataKey="Target" name="Budget Target" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.7} />
                      <Line yAxisId="pct" type="monotone" dataKey="Variance %" name="Variance %" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Manage Budgets */}
      {activeTab === "manage" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              All Budgets
            </CardTitle>
            <CardDescription className="text-xs">Every budget ever drafted, regardless of status or period.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 font-bold border-b">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Period</th>
                    <th className="p-3 text-right">Target</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">Created By</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {budgets.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/20">
                      <td className="p-3 font-mono text-primary font-bold">{b.id}</td>
                      <td className="p-3 text-foreground font-bold">{LEDGER_CATEGORY_LABELS[b.category]}</td>
                      <td className="p-3 text-muted-foreground">{b.periodLabel} <span className="text-[10px] uppercase">({b.periodType})</span></td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">{formatUSD(b.targetUSD)}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : b.status === "pending_approval"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : b.status === "rejected"
                              ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                              : "bg-muted text-muted-foreground border"
                          }`}
                        >
                          {b.status === "pending_approval" ? "Pending Approval" : b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{b.createdByName}</td>
                      <td className="p-3 text-center">
                        {b.status === "draft" && (
                          <Button size="sm" variant="outline" onClick={() => handleSubmitForApproval(b)} className="h-7 text-[11px] font-bold">
                            Submit for Approval
                          </Button>
                        )}
                        {b.status !== "draft" && <span className="text-muted-foreground text-[11px]">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Approval Queue */}
      {activeTab === "queue" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Budget Approval Queue
            </CardTitle>
            <CardDescription className="text-xs">
              Same escalation ladder as transaction approvals — a budget routes to whichever tier&apos;s ceiling covers its target, with a Chief Executive Officer authorization stage added on top for budgets over {formatUSD(500_000)}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingBudgets.length === 0 ? (
              <p className="text-xs text-muted-foreground p-6 text-center">No budgets currently awaiting approval.</p>
            ) : (
              pendingBudgets.map((b) => {
                const step = currentPendingStep(b);
                const check = canActOnBudget(b);
                return (
                  <div key={b.id} className="p-4 border rounded-xl bg-card space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{b.id}</span>
                        <h3 className="text-sm font-bold text-foreground mt-1">
                          {LEDGER_CATEGORY_LABELS[b.category]} — {b.periodLabel}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Target: <strong className="font-mono text-foreground">{formatUSD(b.targetUSD)}</strong> &bull; Drafted by <strong>{b.createdByName}</strong> &bull; Awaiting: <strong>{step?.role}</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" disabled={!check.allowed} title={check.reason} onClick={() => handleApprove(b)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> {step?.role === "Chief Executive Officer" ? "Authorize" : "Approve"}
                        </Button>
                        <Button size="sm" variant="outline" disabled={!check.allowed} title={check.reason} onClick={() => handleReject(b)} className="text-rose-600 border-rose-200 font-bold text-xs h-8 gap-1.5">
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>

                    {!check.allowed && (
                      <p className="text-[11px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" /> {check.reason}
                      </p>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      {b.approvalSteps.map((s, idx) => (
                        <div
                          key={idx}
                          className={`p-3 border rounded-lg space-y-1 text-xs ${
                            s.status === "approved"
                              ? "bg-emerald-500/5 border-emerald-500/30"
                              : s.status === "pending"
                              ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/50"
                              : s.status === "rejected"
                              ? "bg-rose-500/5 border-rose-500/30"
                              : "bg-muted/20 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">Stage {idx + 1}</span>
                            {s.status === "approved" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                            {s.status === "pending" && <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />}
                            {s.status === "rejected" && <XCircle className="h-3.5 w-3.5 text-rose-600" />}
                          </div>
                          <p className="font-bold text-foreground text-[11px]">{s.role}</p>
                          {s.officerName && <p className="text-[11px] text-muted-foreground">{s.officerName}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal: Create Budget */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-md w-full min-w-[50vw] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" /> Create Budget
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground -mt-2">
              Drafted as {actorName}. New budgets start as a draft — submit for approval afterward from &ldquo;Manage Budgets.&rdquo;
            </p>

            <form onSubmit={handleCreateBudget} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => {
                    const cat = e.target.value as LedgerCategory;
                    setNewCategory(cat);
                    setNewTarget(String(MONTHLY_BUDGET_USD[cat]));
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  {Object.keys(LEDGER_CATEGORY_LABELS).map((cat) => (
                    <option key={cat} value={cat}>{LEDGER_CATEGORY_LABELS[cat as LedgerCategory]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Period Type</label>
                <select
                  value={newPeriodType}
                  onChange={(e) => setNewPeriodType(e.target.value as BudgetPeriodType)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  {(Object.keys(PERIOD_LABELS) as BudgetPeriodType[]).map((pt) => (
                    <option key={pt} value={pt}>{PERIOD_LABELS[pt]} (current {pt.replace("ly", "")})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Target (USD)</label>
                <input
                  type="number"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 font-mono font-bold focus:outline-none"
                />
                <p className="text-[10px] text-muted-foreground">
                  Routes to {parseFloat(newTarget) > 500_000 ? "Chief Financial Officer + Chief Executive Officer authorization" : "the tier whose ceiling covers this amount"} once submitted.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="h-8 text-xs font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-primary font-bold">
                  Create Draft
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
