"use client";

import { useState } from "react";
import { History, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FinanceHubNav from "@/features/finance-hub/components/FinanceHubNav";
import { useFinanceAuditLog } from "@/features/finance-hub/context/FinanceAuditLogContext";
import { useActingFinanceOfficer } from "@/features/finance-hub/context/FinanceOfficerContext";

// The global, filterable log page — the QuickBooks Audit Log pattern —
// sitting alongside the per-account activity panel (AccountLedgerDetailView).
// Nothing here was rendered anywhere before tonight; the data existed, the
// page didn't.
export default function FinanceActivityLogPage() {
  const { entries } = useFinanceAuditLog();
  const { isCountryInScope } = useActingFinanceOfficer();
  const [searchQuery, setSearchQuery] = useState("");

  const scopedEntries = entries.filter((e) => !e.countryCode || isCountryInScope(e.countryCode));

  const filtered = scopedEntries.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      e.actor.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.target.toLowerCase().includes(q) ||
      (e.details ?? "").toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Actor", "Action", "Target", "Details", "Country"];
    const rows = filtered.map((e) => [
      e.timestamp,
      `"${e.actor}"`,
      `"${e.action}"`,
      `"${e.target}"`,
      `"${e.details ?? ""}"`,
      e.countryCode ?? "",
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Finance_Activity_Log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
            <span className="rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-500/20">
              Finance-Specific Audit Trail
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Every action that touches money state — reconcile, approve/reject, transfer, suspend —
            independently citable, scoped to what you can see.
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="h-9 text-xs font-bold gap-2 text-primary border-primary/30">
          <Download className="h-4 w-4" /> Export Log (CSV)
        </Button>
      </div>

      <Card className="border shadow-2xs">
        <CardContent className="p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search actor, action, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-2xs">
        <CardHeader className="py-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            All Actions
          </CardTitle>
          <CardDescription className="text-xs">Showing {filtered.length} entries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold">
                {filtered.length > 0 ? (
                  filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-muted-foreground">
                        {new Date(e.timestamp).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-3 text-foreground">{e.actor}</td>
                      <td className="p-3 text-foreground">{e.action}</td>
                      <td className="p-3 font-mono text-muted-foreground">{e.target}</td>
                      <td className="p-3 text-muted-foreground">{e.details ?? "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground italic">
                      No activity recorded yet in your current scope.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
