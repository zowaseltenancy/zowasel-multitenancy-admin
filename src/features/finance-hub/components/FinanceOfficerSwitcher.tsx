"use client";

import { UserCircle2, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActingFinanceOfficer } from "../context/FinanceOfficerContext";
import { formatUSD } from "../utils/currency";

// The mock-RBAC control surface: switching officers here actually changes
// what every Finance Hub page shows — not a cosmetic label.
export default function FinanceOfficerSwitcher() {
  const { officers, actingOfficer, setActingOfficerId, approvalThresholdUSD, scopeLabel } =
    useActingFinanceOfficer();

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2 shadow-2xs flex-wrap">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground shrink-0">
        <UserCircle2 className="h-4 w-4 text-primary" />
        Acting as
      </div>

      <Select value={actingOfficer.id} onValueChange={(value) => setActingOfficerId(value ?? actingOfficer.id)}>
        <SelectTrigger className="h-8 w-full sm:w-[280px] text-xs font-semibold">
          <SelectValue>
            {`${actingOfficer.firstName} ${actingOfficer.lastName} — ${actingOfficer.position}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {officers.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.firstName} {o.lastName} — {o.position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground shrink-0">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        Scope: <span className="text-foreground">{scopeLabel}</span>
        <span className="text-border">&bull;</span>
        Approves up to:{" "}
        <span className="text-foreground">
          {approvalThresholdUSD === null ? "Uncapped" : formatUSD(approvalThresholdUSD)}
        </span>
      </div>
    </div>
  );
}
