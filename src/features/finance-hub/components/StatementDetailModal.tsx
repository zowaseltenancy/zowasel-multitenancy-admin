"use client";

import { X, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet, Building2, Link2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatementLine } from "@/types/finance";
import { STATEMENT_LINE_STATUS_TONE } from "@/constants/finance";
import { statusBadgeClass } from "@/lib/statusTone";

interface StatementDetailModalProps {
  line: StatementLine;
  onClose: () => void;
  onReconcile?: (id: string) => void;
  onBindMatch?: (line: StatementLine) => void;
}

export default function StatementDetailModal({
  line,
  onClose,
  onReconcile,
  onBindMatch,
}: StatementDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg min-w-[50vw] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- print-context asset, next/image adds no value here */}
            <img src="/zowasel-logo-grey.png" alt="Zowasel" className="h-6 w-auto" />
            <div className="flex items-center gap-2 border-l pl-3">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-extrabold text-foreground">Bank Statement Line Detail</h2>
                <p className="text-xs font-mono text-muted-foreground">{line.id}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs font-semibold">
          {/* Main Bank Amount Banner */}
          <div className="p-4 border rounded-xl bg-muted/20 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Bank Statement Amount</p>
              <p className={`text-2xl font-black font-mono mt-1 ${line.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}>
                {line.type === "credit" ? "+" : "-"}₦{line.bankAmount.toLocaleString()}
              </p>
            </div>
            <span className={statusBadgeClass(STATEMENT_LINE_STATUS_TONE[line.status])}>
              {line.status}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3 border rounded-xl p-4 bg-card">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> Corporate Bank Account
              </p>
              <p className="font-bold text-foreground mt-1 text-xs">{line.bankAccount}</p>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Statement Value Date
              </p>
              <p className="font-mono text-foreground mt-1">{line.date}</p>
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase">Bank Narration / Raw Text</p>
              <p className="font-mono bg-muted p-2 rounded text-[11px] text-foreground mt-1 break-all">
                {line.narration}
              </p>
            </div>
          </div>

          {/* Reconciliation Match Result */}
          <div className="border rounded-xl p-4 bg-muted/20 space-y-2">
            <p className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Internal Ledger Match Result</span>
              <span className="font-mono text-[11px] text-primary">{line.confidenceScore}% Confidence</span>
            </p>

            {line.internalTxnId ? (
              <div className="p-3 border rounded-lg bg-card space-y-1">
                <p className="font-mono text-primary font-extrabold">{line.internalTxnId}</p>
                <p className="text-xs text-foreground font-bold">{line.internalMatchName}</p>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Auto-reconciled against live ledger entry
                </p>
              </div>
            ) : (
              <div className="p-3 border rounded-lg bg-rose-500/10 border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>No automated match found in internal ledger. Manual binding required.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs font-bold">
            Close
          </Button>

          <div className="flex items-center gap-2">
            {line.status !== "reconciled" && onReconcile && (
              <Button
                size="sm"
                onClick={() => {
                  onReconcile(line.id);
                  onClose();
                }}
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Reconcile Line
              </Button>
            )}
            {!line.internalTxnId && onBindMatch && (
              <Button
                size="sm"
                onClick={() => {
                  onBindMatch(line);
                  onClose();
                }}
                className="h-8 text-xs bg-primary font-bold"
              >
                Bind Internal Match
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
