"use client";

import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Sprout,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  DollarSign,
  PieChart as PieChartIcon,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Building2,
  Calendar,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";
import { GeographicFilterState } from "@/types/geo";

interface LoanRecord {
  id: string;
  applicantName: string;
  applicantType: "Merchant" | "Commodity Buyer" | "Cooperative" | "Agrodealer";
  requestedAmount: number;
  approvedAmount: number;
  disbursedDate: string;
  repaymentDueDate: string;
  dpd: number; // Days Past Due
  parStatus: "PAR 0 (Performing)" | "Watchlist (<30 DPD)" | "PAR 30+ (Substandard)" | "NPL (90+ DPD)";
  acessScore: number; // ACESS Credit Score 0-100
  status: "Active" | "Pending Review" | "Repaid" | "Defaulted";
}

const initialLoans: LoanRecord[] = [
  {
    id: "LN-88210",
    applicantName: "Greenfield Agro Merchants Ltd",
    applicantType: "Merchant",
    requestedAmount: 50000000,
    approvedAmount: 45000000,
    disbursedDate: "2026-06-15",
    repaymentDueDate: "2026-09-15",
    dpd: 0,
    parStatus: "PAR 0 (Performing)",
    acessScore: 88,
    status: "Active",
  },
  {
    id: "LN-88195",
    applicantName: "Kano Farmers Produce Supply Ltd",
    applicantType: "Merchant",
    requestedAmount: 30000000,
    approvedAmount: 30000000,
    disbursedDate: "2026-05-10",
    repaymentDueDate: "2026-08-10",
    dpd: 14,
    parStatus: "Watchlist (<30 DPD)",
    acessScore: 76,
    status: "Active",
  },
  {
    id: "LN-88180",
    applicantName: "Highland Grain Buyers Corp",
    applicantType: "Commodity Buyer",
    requestedAmount: 25000000,
    approvedAmount: 0,
    disbursedDate: "-",
    repaymentDueDate: "-",
    dpd: 0,
    parStatus: "PAR 0 (Performing)",
    acessScore: 92,
    status: "Pending Review",
  },
  {
    id: "LN-88102",
    applicantName: "Sokoto Grains Cooperative",
    applicantType: "Cooperative",
    requestedAmount: 18000000,
    approvedAmount: 15000000,
    disbursedDate: "2026-03-01",
    repaymentDueDate: "2026-06-01",
    dpd: 45,
    parStatus: "PAR 30+ (Substandard)",
    acessScore: 58,
    status: "Active",
  },
  {
    id: "LN-88044",
    applicantName: "Savannah Input Dealers",
    applicantType: "Agrodealer",
    requestedAmount: 12000000,
    approvedAmount: 12000000,
    disbursedDate: "2026-01-10",
    repaymentDueDate: "2026-04-10",
    dpd: 115,
    parStatus: "NPL (90+ DPD)",
    acessScore: 42,
    status: "Defaulted",
  },
];

const parChartData = [
  { status: "PAR 0", amount: 620, color: "#10b981" },
  { status: "PAR 1-30", amount: 140, color: "#f59e0b" },
  { status: "PAR 31-60", amount: 45, color: "#f97316" },
  { status: "PAR 61-90", amount: 22, color: "#ef4444" },
  { status: "NPL (90+)", amount: 13, color: "#be123c" },
];

export default function CreditPortfolioRiskPage() {
  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const [loans, setLoans] = useState<LoanRecord[]>(initialLoans);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedApplication, setSelectedApplication] = useState<LoanRecord | null>(null);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveLoan = (id: string) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "Active",
              approvedAmount: l.requestedAmount,
              disbursedDate: new Date().toISOString().split("T")[0],
              repaymentDueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            }
          : l
      )
    );
    setSelectedApplication(null);
  };

  const handleRejectLoan = (id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
    setSelectedApplication(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Credit Portfolio & Risk</h1>
            <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-bold text-sky-600 border border-sky-500/20">
              Alternative Finance Intelligence
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Alternative Finance credit requests, portfolio exposure, DPD risk, PAR30/60/90, and ACESS credit scoring.
          </p>
        </div>

        <CompactRegionScopeSelector value={geoFilter} onChange={setGeoFilter} />
      </div>

      {/* Finance Hub Nav */}
      <FinanceHubNav />

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Credit Demand Requested
              </p>
              <CreditCard className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">₦840M</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-sky-600 font-bold">245 Applicants</span>
              <span className="text-muted-foreground font-semibold">Avg ₦3.4M/app</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Disbursement & Approvals
              </p>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">₦620M</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold">73.8% Approval Rate</span>
              <span className="text-muted-foreground font-semibold">Turnaround: 3.2 Days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Portfolio PAR30 / PAR60
              </p>
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">3.4%</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-amber-600 font-bold">PAR30: 2.1%</span>
              <span className="text-muted-foreground font-semibold">PAR60: 1.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                NPL Ratio (Non-Performing)
              </p>
              <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">1.15%</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-rose-600 font-bold">₦7.1M Outstanding</span>
              <span className="text-muted-foreground font-semibold">Recovery: 88.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Recharts PAR Exposure Visual */}
      <Card className="border shadow-2xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-600" />
            <span>Portfolio PAR (Portfolio-at-Risk) & DPD Exposure (Millions NGN)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Risk distribution across performing, watchlist, substandard, and non-performing loan brackets.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₦${val}M`, "Exposure"]}
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {parChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter Bar */}
      <Card className="border shadow-2xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search applicant name or loan ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="All">All Loan Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Defaulted">Defaulted</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Finance Loan Portfolio Table */}
      <Card className="border shadow-2xs">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Alternative Finance Loan Applications & Exposure</CardTitle>
              <CardDescription className="text-xs">
                Financed buyers, merchants, and cooperatives tracked by ACESS Credit Score and DPD risk.
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md">
              Risk Scoring Engine: ACESS v3.2
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Loan ID & Type</th>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Requested / Approved</th>
                  <th className="p-3">ACESS Credit Score</th>
                  <th className="p-3">DPD & PAR Status</th>
                  <th className="p-3">Loan Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono">
                      <p className="font-bold text-foreground">{loan.id}</p>
                      <p className="text-[11px] text-muted-foreground">{loan.applicantType}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{loan.applicantName}</p>
                      <p className="text-[11px] text-muted-foreground">Due: {loan.repaymentDueDate}</p>
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <p className="text-foreground">₦{loan.requestedAmount.toLocaleString()}</p>
                      <p className="text-[11px] text-emerald-600">
                        {loan.approvedAmount ? `Approved: ₦${loan.approvedAmount.toLocaleString()}` : "Pending Approval"}
                      </p>
                    </td>
                    <td className="p-3 font-bold">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-mono ${
                          loan.acessScore >= 80
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : loan.acessScore >= 60
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                        }`}
                      >
                        {loan.acessScore} / 100 Score
                      </span>
                    </td>
                    <td className="p-3">
                      <p className={loan.dpd > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                        {loan.dpd} Days DPD
                      </p>
                      <p className="text-[10px] text-muted-foreground">{loan.parStatus}</p>
                    </td>
                    <td className="p-3">
                      {loan.status === "Active" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Active Loan
                        </span>
                      )}
                      {loan.status === "Pending Review" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                          <Clock className="h-3 w-3" /> Pending Review
                        </span>
                      )}
                      {loan.status === "Defaulted" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20">
                          <ShieldAlert className="h-3 w-3" /> Defaulted
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApplication(loan)}
                        className="h-7 text-[11px] font-bold text-primary border-primary/30"
                      >
                        Review Credit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Credit Decision Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Credit Decision Review</h2>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-semibold">
              <div className="p-3 border rounded-lg bg-muted/30 space-y-1">
                <p className="font-bold text-foreground text-sm">{selectedApplication.applicantName}</p>
                <p className="text-muted-foreground font-mono">
                  Application ID: {selectedApplication.id} &bull; Type: {selectedApplication.applicantType}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg bg-card">
                  <p className="text-[11px] text-muted-foreground uppercase">Requested Credit</p>
                  <p className="text-lg font-extrabold text-foreground">
                    ₦{selectedApplication.requestedAmount.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 border rounded-lg bg-card">
                  <p className="text-[11px] text-muted-foreground uppercase">ACESS Credit Score</p>
                  <p className="text-lg font-extrabold text-emerald-600">
                    {selectedApplication.acessScore} / 100
                  </p>
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-emerald-500/10 border-emerald-500/20 text-emerald-600 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> AI Credit Assessment: Recommended
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Strong marketplace transaction velocity and 0 DPD default history over the past 12 months.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleRejectLoan(selectedApplication.id)}
                  className="h-8 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <X className="h-3.5 w-3.5 mr-1" /> Decline Application
                </Button>
                <Button
                  onClick={() => handleApproveLoan(selectedApplication.id)}
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Approve & Disburse
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
