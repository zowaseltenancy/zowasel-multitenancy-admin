"use client";

import { FinanceOfficerProvider } from "@/features/finance-hub/context/FinanceOfficerContext";
import { FinanceAuditLogProvider } from "@/features/finance-hub/context/FinanceAuditLogContext";
import FinanceOfficerSwitcher from "@/features/finance-hub/components/FinanceOfficerSwitcher";

export default function FinanceHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <FinanceOfficerProvider>
      <FinanceAuditLogProvider>
        <div className="space-y-6">
          <FinanceOfficerSwitcher />
          {children}
        </div>
      </FinanceAuditLogProvider>
    </FinanceOfficerProvider>
  );
}
