"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Save,
  Building,
  Globe,
  Sliders,
  FileText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubSectionPillNav from "@/features/finance-hub/components/SubSectionPillNav";
import PageHeaderInfo from "@/components/shared/PageHeaderInfo";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { formatUSD } from "@/features/finance-hub/utils/currency";
import { GeographicScopeLevel } from "@/types/user";

export default function GovernanceView() {
  const { actingOfficer, thresholds, updateThreshold } = useActingFinanceOfficer();
  const { logAction } = useFinanceAuditLog();
  const actorName = actingOfficer ? `${actingOfficer.firstName} ${actingOfficer.lastName} (${actingOfficer.position || "Staff"})` : "System";

  const isCFO = actingOfficer?.geographicScopeLevel === "global" || actingOfficer?.position?.includes("CFO") || actingOfficer?.position?.includes("Chief");

  // Local state for editing thresholds before saving
  const [countryVal, setCountryVal] = useState<string>(thresholds.country?.toString() ?? "2000");
  const [subRegionVal, setSubRegionVal] = useState<string>(thresholds.sub_region?.toString() ?? "20000");
  const [continentVal, setContinentVal] = useState<string>(thresholds.continent?.toString() ?? "200000");

  const [activeTab, setActiveTab] = useState<string>("hierarchy");

  const governancePills = [
    { id: "hierarchy", label: "4-Level Authorization Hierarchy", icon: ShieldCheck },
    { id: "ceilings", label: "CFO Approval Ceilings & Limits", icon: Sliders },
    { id: "control_center", label: "Finance Control Center Matrix", icon: ShieldAlert },
    { id: "policies", label: "Maker-Checker & Security Rules", icon: Lock },
  ];

  // Governance Toggles
  const [preventSelfApproval, setPreventSelfApproval] = useState(true);
  const [requireDualAuthBankChanges, setRequireDualAuthBankChanges] = useState(true);
  const [enforceDocumentAttachments, setEnforceDocumentAttachments] = useState(true);
  const [requireAffidavitForAccountEdit, setRequireAffidavitForAccountEdit] = useState(true);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCFO) {
      toast.error("Only the Chief Financial Officer (CFO) can modify approval threshold ceilings.");
      return;
    }

    updateThreshold("country", parseFloat(countryVal) || 0);
    updateThreshold("sub_region", parseFloat(subRegionVal) || 0);
    updateThreshold("continent", parseFloat(continentVal) || 0);

    logAction(
      actorName,
      "Updated CFO Approval Threshold Ceilings",
      `Country: $${countryVal}, Region: $${subRegionVal}, Continent: $${continentVal}`,
      "Configuration Saved"
    );

    toast.success("Governance approval threshold limits successfully updated and applied across Finance Hub.");
  };

  const handleTogglePolicy = (policyName: string, newValue: boolean) => {
    logAction(
      actorName,
      `Toggled Governance Policy: ${policyName}`,
      newValue ? "Enabled" : "Disabled",
      "Security Policy Updated"
    );
    toast.success(`Governance policy '${policyName}' set to ${newValue ? "Enabled" : "Disabled"}.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Finance Governance & Controls</h1>
          <PageHeaderInfo
            title="Finance Governance Overview"
            description="Configure financial approval thresholds, maker-checker governance rules, multi-level authorization tiers, and fraud prevention protocols."
          />
        </div>
      </div>

      {/* Pill Navigation Bar */}
      <SubSectionPillNav items={governancePills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 1. 4-Level Authorization Workflow Hierarchy Tab */}
      {activeTab === "hierarchy" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              4-Level Financial Approval Hierarchy
            </CardTitle>
            <CardDescription className="text-xs">
              Every transaction, outflow, and manual requisition must pass through these distinct authorization levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Level 1 */}
              <div className="border rounded-xl p-4 bg-muted/20 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Level 1
                    </span>
                    <FileText className="h-4 w-4 text-sky-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-foreground">1. Initiator (Maker)</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">
                    Field agents, sales reps, or account officers who create offline transaction entries, requisitions, or invoices.
                  </p>
                </div>
                <div className="pt-2 border-t text-[11px] font-bold text-sky-600 flex items-center gap-1">
                  <span>Action:</span> <span className="text-foreground">Record / Upload Entry</span>
                </div>
              </div>

              {/* Level 2 */}
              <div className="border rounded-xl p-4 bg-muted/20 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Level 2
                    </span>
                    <UserCheck className="h-4 w-4 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-foreground">2. Validator</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">
                    Country Finance Controllers who verify supporting documentation, receipt scans, and initial accuracy.
                  </p>
                </div>
                <div className="pt-2 border-t text-[11px] font-bold text-amber-600 flex items-center gap-1">
                  <span>Action:</span> <span className="text-foreground">Doc & Receipt Check</span>
                </div>
              </div>

              {/* Level 3 */}
              <div className="border rounded-xl p-4 bg-muted/20 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Level 3
                    </span>
                    <Sliders className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-foreground">3. Approver</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">
                    Regional Finance Officers who approve amounts up to their configured approval ceiling limit ($20,000 default).
                  </p>
                </div>
                <div className="pt-2 border-t text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                  <span>Action:</span> <span className="text-foreground">Limit & Ledger Approval</span>
                </div>
              </div>

              {/* Level 4 */}
              <div className="border rounded-xl p-4 bg-emerald-500/5 border-emerald-500/20 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Level 4
                    </span>
                    <Lock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-foreground">4. Authorizer</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">
                    CFO / CEO who performs final disbursement authorization for high-value transactions exceeding regional caps.
                  </p>
                </div>
                <div className="pt-2 border-t text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <span>Action:</span> <span className="text-foreground">Final Treasury Release</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. CFO Approval Ceilings Tab */}
      {activeTab === "ceilings" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                CFO Approval Threshold Settings
              </CardTitle>
              {!isCFO && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Read-Only (CFO Only)
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              Manually set maximum approval ceilings per geographic officer tier (in USD). Amounts exceeding a tier ceiling automatically escalate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-muted-foreground mb-1 font-bold">Country Finance Officer Ceiling (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground font-mono">$</span>
                  <input
                    type="number"
                    disabled={!isCFO}
                    value={countryVal}
                    onChange={(e) => setCountryVal(e.target.value)}
                    className="w-full rounded-lg border bg-background pl-7 pr-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Applies to Country Controllers in Nigeria, Kenya, Tanzania.</p>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-bold">Regional Finance Director Ceiling (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground font-mono">$</span>
                  <input
                    type="number"
                    disabled={!isCFO}
                    value={subRegionVal}
                    onChange={(e) => setSubRegionVal(e.target.value)}
                    className="w-full rounded-lg border bg-background pl-7 pr-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Applies to West Africa and East Africa regional directors.</p>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-bold">Continental Finance Officer Ceiling (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground font-mono">$</span>
                  <input
                    type="number"
                    disabled={!isCFO}
                    value={continentVal}
                    onChange={(e) => setContinentVal(e.target.value)}
                    className="w-full rounded-lg border bg-background pl-7 pr-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Applies to Africa-wide financial directors.</p>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Chief Financial Officer (CFO) Ceiling</p>
                  <p className="text-[11px] text-muted-foreground">Global policy setter — uncapped authorization authority.</p>
                </div>
                <span className="font-mono font-extrabold text-emerald-600 text-sm">UNCAPPED</span>
              </div>

              {isCFO && (
                <Button type="submit" className="w-full h-9 bg-primary font-bold gap-2 text-xs shadow-2xs">
                  <Save className="h-4 w-4" /> Save Governance Thresholds
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* 3. Finance Control Center Matrix Tab */}
      {activeTab === "control_center" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-600" />
              Finance Control Center — Stage Permission & Role Authority Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Configure which administrative and executive roles can Initiate, Validate, Approve, or Authorize disbursements and requisitions per RVE-093.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b text-muted-foreground font-bold uppercase">
                  <tr>
                    <th className="p-3">Platform Role</th>
                    <th className="p-3 text-center">1. Initiate (Maker)</th>
                    <th className="p-3 text-center">2. Validate</th>
                    <th className="p-3 text-center">3. Approve</th>
                    <th className="p-3 text-center">4. Authorize</th>
                    <th className="p-3">Default Cap</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-semibold">
                  {[
                    { role: "Field Agent / Local Officer", init: true, val: false, app: false, auth: false, cap: "$2,000" },
                    { role: "Country Finance Officer", init: true, val: true, app: true, auth: false, cap: "$5,000" },
                    { role: "Regional Finance Director", init: true, val: true, app: true, auth: false, cap: "$20,000" },
                    { role: "Chief Financial Officer (CFO)", init: true, val: true, app: true, auth: true, cap: "Uncapped" },
                    { role: "Chief Executive Officer (CEO)", init: false, val: false, app: false, auth: true, cap: "Authorize Only" },
                  ].map((r) => (
                    <tr key={r.role}>
                      <td className="p-3 font-bold text-foreground">{r.role}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.init ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-muted text-muted-foreground"}`}>
                          {r.init ? "ALLOWED" : "DENIED"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.val ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-muted text-muted-foreground"}`}>
                          {r.val ? "ALLOWED" : "DENIED"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.app ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-muted text-muted-foreground"}`}>
                          {r.app ? "ALLOWED" : "DENIED"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.auth ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20" : "bg-muted text-muted-foreground"}`}>
                          {r.auth ? "ALLOWED" : "DENIED"}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-foreground">{r.cap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border rounded-xl bg-muted/20 text-xs space-y-1">
              <p className="font-bold text-foreground">Rule Summary:</p>
              <p className="text-muted-foreground">&bull; <strong>Finance Officers</strong>: Initiate & Validate only (cannot perform final release on transactions &gt; $5k).</p>
              <p className="text-muted-foreground">&bull; <strong>CFO</strong>: Approves & Authorizes high-value treasury movements.</p>
              <p className="text-muted-foreground">&bull; <strong>CEO</strong>: Authorize only (does not initiate or validate operational entries).</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Maker-Checker & Security Rules Tab */}
      {activeTab === "policies" && (
        <Card className="border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Maker-Checker & Fraud Prevention Controls
            </CardTitle>
            <CardDescription className="text-xs">
              Strict platform security policies protecting treasury assets against fraud, unauthorized edits, and self-approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 border rounded-xl bg-card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span>Self-Approval Prevention Rule</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Strict Maker-Checker enforcement: Officers who record or upload an offline transaction or requisition are blocked from approving it.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preventSelfApproval}
                  onChange={(e) => {
                    setPreventSelfApproval(e.target.checked);
                    handleTogglePolicy("Self-Approval Prevention Rule", e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                />
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    <span>Immutable Verified Banking Details</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Once vendor/merchant bank accounts are verified, account details are locked and immutable. Changes require formal legal proof.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireDualAuthBankChanges}
                  onChange={(e) => {
                    setRequireDualAuthBankChanges(e.target.checked);
                    handleTogglePolicy("Immutable Verified Banking Details", e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                />
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <span>Mandatory Legal Affidavit for Account Edits</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Modifying verified bank accounts requires uploading a police report or court affidavit PDF, subject to Finance Manager sign-off.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireAffidavitForAccountEdit}
                  onChange={(e) => {
                    setRequireAffidavitForAccountEdit(e.target.checked);
                    handleTogglePolicy("Mandatory Legal Affidavit for Account Edits", e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                />
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-sky-600" />
                    <span>Mandatory Supporting Document Attachments</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Require receipt scans, payment proofs, or invoices to be attached to all offline ledger entries before clearing approval.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceDocumentAttachments}
                  onChange={(e) => {
                    setEnforceDocumentAttachments(e.target.checked);
                    handleTogglePolicy("Mandatory Supporting Document Attachments", e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
