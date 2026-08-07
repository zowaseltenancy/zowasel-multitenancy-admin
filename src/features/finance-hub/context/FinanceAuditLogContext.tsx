"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { FinanceAuditEntry } from "@/types/finance";

const seedLog: FinanceAuditEntry[] = [
  {
    id: "AUD-0001",
    timestamp: "2026-08-05T14:10:00Z",
    actor: "Emeka Obiora (Country Finance Officer, Nigeria)",
    action: "Reconciled statement line",
    target: "ST-8821",
    details: "Matched against TRM-SMS-202608 (Termii Technologies).",
    countryCode: "NG",
  },
];

interface FinanceAuditLogContextValue {
  entries: FinanceAuditEntry[];
  logAction: (actor: string, action: string, target: string, details?: string, countryCode?: string) => void;
}

const FinanceAuditLogContext = createContext<FinanceAuditLogContextValue | null>(null);

// Shared across every Finance Hub page (provided once, in finance-hub/layout.tsx)
// — a per-page instance would mean the Activity Log page could only ever
// show its own seed entry and nothing logged anywhere else during the
// session, defeating the entire point of a cross-page audit trail.
export function FinanceAuditLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<FinanceAuditEntry[]>(seedLog);

  const logAction = (
    actor: string,
    action: string,
    target: string,
    details?: string,
    countryCode?: string
  ) => {
    setEntries((prev) => [
      {
        id: `AUD-${Date.now().toString().slice(-8)}`,
        timestamp: new Date().toISOString(),
        actor,
        action,
        target,
        details,
        countryCode,
      },
      ...prev,
    ]);
  };

  return (
    <FinanceAuditLogContext.Provider value={{ entries, logAction }}>
      {children}
    </FinanceAuditLogContext.Provider>
  );
}

// Same name/shape as the old per-component hook on purpose — every existing
// call site (account/transactions/accounts-monitor pages, detail view) keeps
// working unchanged; only the storage moved from local state to shared context.
export function useFinanceAuditLog() {
  const ctx = useContext(FinanceAuditLogContext);
  if (!ctx) {
    throw new Error("useFinanceAuditLog must be used within FinanceAuditLogProvider");
  }
  return ctx;
}
