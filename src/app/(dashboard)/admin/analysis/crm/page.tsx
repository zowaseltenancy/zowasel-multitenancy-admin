"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Clock,
  Activity,
  Search,
  UserPlus,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import AnalysisNav from "@/features/analysis/components/AnalysisNav";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useUsers } from "@/features/users/hooks/useUsers";
import { Organization, AssignedStaffMember } from "@/types/organization";
import { GeographicFilterState } from "@/types/geo";

// A deterministic, explainable health score computed from real signals —
// not a fabricated number — so it agrees with whatever the org's actual KYB
// status and staff coverage say elsewhere in the app.
function computeHealthScore(org: Organization): number {
  const kybPoints = org.kybStatus === "approved" ? 40 : org.kybStatus === "pending" ? 20 : 0;
  const hasPaidSubscription = org.subscriptions.some((s) => s.billingState === "paid");
  const subscriptionPoints = hasPaidSubscription ? 30 : 10;
  const assignedCount = [org.assignedStaff?.primary, org.assignedStaff?.secondary].filter(Boolean).length;
  const coveragePoints = assignedCount === 2 ? 30 : assignedCount === 1 ? 15 : 0;
  return Math.min(100, kybPoints + subscriptionPoints + coveragePoints);
}

export default function Crm360PipelinePage() {
  const { organizations, assignStaff } = useOrganizations();
  const { users } = useUsers();

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [reassignTarget, setReassignTarget] = useState<Organization | null>(null);
  const [newPrimaryId, setNewPrimaryId] = useState("");
  const [newSecondaryId, setNewSecondaryId] = useState("");

  const eligibleStaff = useMemo<AssignedStaffMember[]>(
    () =>
      users
        .filter((u) => u.userCategory === "staff" && (u.department === "Sales" || u.department === "Regional Operations"))
        .map((u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` })),
    [users]
  );

  const scopedOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesContinent = geoFilter.continent === "all" || org.continent === geoFilter.continent;
      const matchesSubRegion = geoFilter.subRegion === "all" || org.subRegion === geoFilter.subRegion;
      const matchesCountry = geoFilter.countryCode === "all" || org.countryCode === geoFilter.countryCode;
      return matchesContinent && matchesSubRegion && matchesCountry;
    });
  }, [organizations, geoFilter]);

  const filteredOrganizations = scopedOrganizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.assignedStaff?.primary?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.assignedStaff?.secondary?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fieldAgents = users.filter((u) => u.userCategory === "agent");
  const activeFieldAgents = fieldAgents.filter((u) => u.status === "active");
  const fieldAgentRetentionPct = fieldAgents.length > 0 ? Math.round((activeFieldAgents.length / fieldAgents.length) * 100) : 0;

  const approvedOrgs = scopedOrganizations.filter((o) => o.kybStatus === "approved" && o.kybSubmittedAt && o.kybApprovedAt);
  const avgKybTurnaroundDays =
    approvedOrgs.length > 0
      ? Math.round(
          approvedOrgs.reduce((total, org) => {
            const submitted = new Date(org.kybSubmittedAt as string).getTime();
            const approved = new Date(org.kybApprovedAt as string).getTime();
            return total + (approved - submitted) / (1000 * 60 * 60 * 24);
          }, 0) / approvedOrgs.length
        )
      : 0;

  const fullyCoveredOrgs = scopedOrganizations.filter(
    (o) => o.assignedStaff?.primary && o.assignedStaff?.secondary
  ).length;
  const accountCoveragePct =
    scopedOrganizations.length > 0 ? Math.round((fullyCoveredOrgs / scopedOrganizations.length) * 100) : 0;

  const avgHealthScore =
    scopedOrganizations.length > 0
      ? Math.round(scopedOrganizations.reduce((total, org) => total + computeHealthScore(org), 0) / scopedOrganizations.length)
      : 0;

  const handleOpenReassign = (org: Organization) => {
    setReassignTarget(org);
    setNewPrimaryId(org.assignedStaff?.primary?.id ?? "");
    setNewSecondaryId(org.assignedStaff?.secondary?.id ?? "");
  };

  const handleSaveReassignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignTarget) return;

    const primary = eligibleStaff.find((s) => s.id === newPrimaryId) ?? null;
    const secondary = eligibleStaff.find((s) => s.id === newSecondaryId) ?? null;

    assignStaff(reassignTarget.id, "primary", primary);
    assignStaff(reassignTarget.id, "secondary", secondary);
    toast.success(`Officer mapping updated for ${reassignTarget.name}.`);
    setReassignTarget(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">CRM 360 & Accountability</h1>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-600 border border-purple-500/20">
                Staff Account Mapping Standard
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Account officer staff assignments, customer 360 health scores, and field agent activity monitoring —
              the same assignment data as each organization&rsquo;s Profile tab, in one directory.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector value={geoFilter} onChange={setGeoFilter} />
        </div>
      </div>

      <AnalysisNav />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Field Agent Retention
              </p>
              <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{fieldAgentRetentionPct}%</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-purple-600 font-bold">{activeFieldAgents.length} Active Agents</span>
              <span className="text-muted-foreground font-semibold">of {fieldAgents.length} Total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tenant KYB Turnaround
              </p>
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{avgKybTurnaroundDays} Days</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-blue-600 font-bold">Avg across {approvedOrgs.length} approved</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Account Coverage %
              </p>
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{accountCoveragePct}%</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold">{fullyCoveredOrgs} of {scopedOrganizations.length} Orgs</span>
              <span className="text-muted-foreground font-semibold">Primary & Secondary</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer Health Index
              </p>
              <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{avgHealthScore} / 100</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold">KYB + subscription + coverage</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-2xs">
        <CardContent className="p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search organization or staff name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-2xs">
        <CardHeader className="py-4">
          <div>
            <CardTitle className="text-base font-bold">CRM Account Officer Staff Assignment Directory</CardTitle>
            <CardDescription className="text-xs">
              Reads and writes the same assignment data as each organization&rsquo;s Profile tab — reassigning here
              updates there too.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Organization Name</th>
                  <th className="p-3">Org Type</th>
                  <th className="p-3">Primary Account Officer</th>
                  <th className="p-3">Secondary Officer</th>
                  <th className="p-3">Region Scope</th>
                  <th className="p-3">Health Score</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">
                      <p>{org.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">ID: {org.businessId}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold border capitalize">
                        {org.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-primary">
                      {org.assignedStaff?.primary?.name ?? <span className="text-muted-foreground font-normal">Unassigned</span>}
                    </td>
                    <td className="p-3 text-muted-foreground font-medium">
                      {org.assignedStaff?.secondary?.name ?? "Unassigned"}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {[org.subRegion, org.continent].filter(Boolean).join(" / ") || "—"}
                    </td>
                    <td className="p-3 font-bold text-emerald-600 font-mono">{computeHealthScore(org)} / 100</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReassign(org)}
                        className="h-7 text-[11px] font-bold text-primary border-primary/30"
                      >
                        Reassign Officer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {reassignTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Reassign Zowasel Staff Officers</h2>
              </div>
              <button
                onClick={() => setReassignTarget(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReassignment} className="p-5 space-y-4 text-xs font-semibold">
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="font-bold text-foreground">{reassignTarget.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Current Region: {[reassignTarget.subRegion, reassignTarget.continent].filter(Boolean).join(" / ") || "—"}
                </p>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Primary Account Officer</label>
                <select
                  value={newPrimaryId}
                  onChange={(e) => setNewPrimaryId(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {eligibleStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Secondary Account Officer</label>
                <select
                  value={newSecondaryId}
                  onChange={(e) => setNewSecondaryId(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {eligibleStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReassignTarget(null)}
                  className="h-8 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-primary font-bold">
                  Save Officer Mapping
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
