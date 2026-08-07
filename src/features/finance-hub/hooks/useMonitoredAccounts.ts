"use client";

import { useState } from "react";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useLedgerTransactions } from "./useLedgerTransactions";
import { useActingFinanceOfficer } from "../context/FinanceOfficerContext";
import { convertToUSD } from "../utils/currency";
import { MonitoredAccount, MonitoredAccountStatus } from "@/types/finance";

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

// Every "monitored account" here is a real organization — its volume and
// balance are computed from the shared ledger feed, not hand-authored.
// Figures are normalized to USD before summing, since a single org's
// transactions can span currencies — never blend native amounts together.
// Suspend/activate is the only local override; everything else is derived.
export function useMonitoredAccounts() {
  const { organizations } = useOrganizations();
  const { transactions } = useLedgerTransactions();
  const { isCountryInScope } = useActingFinanceOfficer();
  const [statusOverrides, setStatusOverrides] = useState<Record<string, MonitoredAccountStatus>>({});

  // eslint-disable-next-line react-hooks/purity -- dormancy is inherently wall-clock-relative
  const now = Date.now();

  const accounts: MonitoredAccount[] = organizations
    .filter((org) => isCountryInScope(org.countryCode))
    .map((org) => {
      const orgTransactions = transactions.filter(
        (t) => t.organizationId === org.id || t.accountName === org.name
      );
      const completed = orgTransactions.filter((t) => t.status === "Completed");
      const totalVolumeProcessed = completed.reduce(
        (sum, t) => sum + convertToUSD(t.amount, t.currencyCode),
        0
      );
      const currentBalance = completed.reduce(
        (sum, t) => sum + (t.type === "credit" ? 1 : -1) * convertToUSD(t.amount, t.currencyCode),
        0
      );
      const mostRecent = orgTransactions[0];
      const lastActive = mostRecent ? mostRecent.date : null;

      const daysSinceActive = mostRecent
        ? (now - new Date(mostRecent.date).getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;

      const computedStatus: MonitoredAccountStatus = daysSinceActive > 60 ? "Dormant" : "Active";

      // Large realized volume draws the same enhanced-due-diligence scrutiny
      // a real AML/risk desk would apply; an unapproved KYB is an open risk
      // regardless of volume.
      const riskTier =
        org.kybStatus !== "approved"
          ? "Medium Risk"
          : totalVolumeProcessed > 300_000
            ? "High Risk"
            : "Low Risk";

      return {
        id: org.id,
        organizationId: org.id,
        accountName: org.name,
        accountType: org.type,
        countryCode: org.countryCode,
        countryName: org.countryName,
        createdDate: org.createdAt,
        totalVolumeProcessed,
        currentBalance: Math.max(currentBalance, 0),
        riskTier,
        status: statusOverrides[org.id] ?? computedStatus,
        lastActive,
      };
    });

  const toggleStatus = (accountId: string) => {
    setStatusOverrides((prev) => {
      const current = accounts.find((a) => a.id === accountId);
      const next: MonitoredAccountStatus = current?.status === "Active" ? "Suspended" : "Active";
      return { ...prev, [accountId]: next };
    });
  };

  return { accounts, toggleStatus, formatRelativeTime };
}
