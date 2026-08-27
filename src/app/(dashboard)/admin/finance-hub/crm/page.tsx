"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  CreditCard,
  Sprout,
  UserCheck,
  Building2,
  CheckCircle2,
  PhoneCall,
  Activity,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  UserPlus,
  X,
  Check,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";
import { GeographicFilterState } from "@/types/geo";

interface AccountAssignment {
  id: string;
  orgName: string;
  orgType: "Merchant" | "Agrodealer" | "Commodity Buyer" | "Cooperative";
  primaryOfficer: string;
  secondaryOfficer: string;
  regionScope: string;
  healthScore: number;
  lastContact: string;
}

const mockAssignments: AccountAssignment[] = [
  {
    id: "CRM-101",
    orgName: "Greenfield Agro & Commodity Merchants",
    orgType: "Merchant",
    primaryOfficer: "Busayo (Operations)",
    secondaryOfficer: "Bisi Adeniyi (Sales)",
    regionScope: "West Africa / Nigeria",
    healthScore: 96,
    lastContact: "Yesterday",
  },
  {
    id: "CRM-102",
    orgName: "Gwarzo Farm Inputs & Seeds Hub",
    orgType: "Agrodealer",
    primaryOfficer: "Bisi Adeniyi (Sales)",
    secondaryOfficer: "Busayo (Operations)",
    regionScope: "West Africa / Nigeria",
    healthScore: 92,
    lastContact: "2 days ago",
  },
  {
    id: "CRM-103",
    orgName: "Kilimanjaro Produce Buyers Ltd",
    orgType: "Commodity Buyer",
    primaryOfficer: "Oreoluwa Okoro (Field Ops)",
    secondaryOfficer: "Ibrahim Sani (Regional)",
    regionScope: "East Africa / Tanzania",
    healthScore: 94,
    lastContact: "3 hours ago",
  },
  {
    id: "CRM-104",
    orgName: "Sokoto Grains Cooperative Association",
    orgType: "Cooperative",
    primaryOfficer: "Ibrahim Sani (Regional)",
    secondaryOfficer: "Oreoluwa Okoro (Field Ops)",
    regionScope: "West Africa / Nigeria",
    healthScore: 88,
    lastContact: "5 days ago",
  },
];

const zowaselStaffList = [
  "Busayo (Operations)",
  "Bisi Adeniyi (Sales)",
  "Oreoluwa Okoro (Field Ops)",
  "Ibrahim Sani (Regional Manager)",
  "Austin (Technical Lead)",
  "Ezuka (Account Director)",
];

export default function CRM360PipelinePage() {
  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const [assignments, setAssignments] = useState<AccountAssignment[]>(mockAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<AccountAssignment | null>(null);

  const [newPrimary, setNewPrimary] = useState("");
  const [newSecondary, setNewSecondary] = useState("");

  const filteredAssignments = assignments.filter(
    (a) =>
      a.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.primaryOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.secondaryOfficer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenReassignModal = (item: AccountAssignment) => {
    setSelectedAssignment(item);
    setNewPrimary(item.primaryOfficer);
    setNewSecondary(item.secondaryOfficer);
  };

  const handleSaveReassignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAssignment.id
          ? { ...a, primaryOfficer: newPrimary, secondaryOfficer: newSecondary }
          : a
      )
    );
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">CRM 360 & Accountability</h1>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-600 border border-purple-500/20">
              Staff Account Mapping Standard
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Account officer staff assignments, customer 360 health scores, and field agent activity monitoring.
          </p>
        </div>

        <CompactRegionScopeSelector value={geoFilter} onChange={setGeoFilter} />
      </div>

      {/* Finance Hub Nav */}
      <FinanceHubNav />

      {/* CRM 360 Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Field Agent Retention
              </p>
              <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">96.8%</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-purple-600 font-bold">42 Active Agents</span>
              <span className="text-muted-foreground font-semibold">Monthly Active</span>
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
            <p className="mt-2 text-3xl font-extrabold text-foreground">3.2 Days</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-blue-600 font-bold">Target 5 Days</span>
              <span className="text-muted-foreground font-semibold">95% Approved SLA</span>
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
            <p className="mt-2 text-3xl font-extrabold text-foreground">100% Covered</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold">14 Orgs Assigned</span>
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
            <p className="mt-2 text-3xl font-extrabold text-foreground">92 / 100</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-amber-600 font-bold">High Engagement</span>
              <span className="text-muted-foreground font-semibold">0 At Risk</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
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

      {/* Account Staff Assignments Table */}
      <Card className="border shadow-2xs">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">CRM Account Officer Staff Assignment Directory</CardTitle>
              <CardDescription className="text-xs">
                Zowasel staff accountability mapping: Primary & Secondary staff members assigned per tenant organization.
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md">
              SLA Standard: 100% Account Assignment
            </span>
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
                {filteredAssignments.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">
                      <p>{a.orgName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">ID: {a.id}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold border">
                        {a.orgType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-primary">{a.primaryOfficer}</td>
                    <td className="p-3 text-muted-foreground font-medium">{a.secondaryOfficer}</td>
                    <td className="p-3 text-muted-foreground">{a.regionScope}</td>
                    <td className="p-3 font-bold text-emerald-600 font-mono">{a.healthScore} / 100</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReassignModal(a)}
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

      {/* Staff Reassignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Reassign Zowasel Staff Officers</h2>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReassignment} className="p-5 space-y-4 text-xs font-semibold">
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="font-bold text-foreground">{selectedAssignment.orgName}</p>
                <p className="text-[11px] text-muted-foreground">Current Region: {selectedAssignment.regionScope}</p>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Primary Account Officer *</label>
                <select
                  value={newPrimary}
                  onChange={(e) => setNewPrimary(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                >
                  {zowaselStaffList.map((staff) => (
                    <option key={staff} value={staff}>
                      {staff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Secondary Account Officer *</label>
                <select
                  value={newSecondary}
                  onChange={(e) => setNewSecondary(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2 font-bold text-foreground focus:outline-none"
                >
                  {zowaselStaffList.map((staff) => (
                    <option key={staff} value={staff}>
                      {staff}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedAssignment(null)}
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
