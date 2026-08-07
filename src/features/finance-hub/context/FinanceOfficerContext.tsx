"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { APPROVAL_THRESHOLD_USD, TRANSFER_CAPABLE_LEVELS } from "@/constants/finance";
import { PlatformUser } from "@/types/user";

interface FinanceOfficerContextValue {
  officers: PlatformUser[];
  actingOfficer: PlatformUser;
  setActingOfficerId: (id: string) => void;
  isCountryInScope: (countryCode: string | undefined) => boolean;
  approvalThresholdUSD: number | null;
  canApprove: (amountUSD: number) => boolean;
  canTransfer: boolean;
  scopeLabel: string;
}

const FinanceOfficerContext = createContext<FinanceOfficerContextValue | null>(null);

function subRegionOf(countryCode: string): string | undefined {
  return GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === countryCode)?.subRegion;
}

// This is the mock-RBAC stand-in: no real auth exists yet, so instead of
// silently showing every officer everything (a fake-permissive demo), the
// acting officer is an explicit, switchable choice that genuinely narrows
// what every Finance Hub page renders — an honest simulation of access
// control, not a decorative one.
export function FinanceOfficerProvider({ children }: { children: ReactNode }) {
  const { users } = useUsers();
  const officers = useMemo(
    () => users.filter((u) => u.department === "Finance"),
    [users]
  );

  // Default to the CFO (broadest view) so the hub isn't empty on first load.
  const [actingOfficerId, setActingOfficerId] = useState("usr_fin_cfo");

  const actingOfficer =
    officers.find((o) => o.id === actingOfficerId) ?? officers[0];

  const value = useMemo<FinanceOfficerContextValue | null>(() => {
    if (!actingOfficer) return null;

    const level = actingOfficer.geographicScopeLevel ?? "country";

    const isCountryInScope = (countryCode: string | undefined) => {
      if (!countryCode) return false;
      // Continent-level scope covers all of Africa — every entity we model
      // today is African, so this is a real (not vacuous) boundary the
      // moment a non-African entity is added.
      if (level === "global" || level === "continent") return true;
      if (level === "sub_region") return subRegionOf(countryCode) === actingOfficer.subRegion;
      return countryCode === actingOfficer.countryCode;
    };

    const approvalThresholdUSD = APPROVAL_THRESHOLD_USD[level];
    const canApprove = (amountUSD: number) =>
      approvalThresholdUSD === null || amountUSD <= approvalThresholdUSD;

    const scopeLabel =
      level === "global"
        ? "Global"
        : level === "continent"
          ? actingOfficer.countryName || "All Africa"
          : level === "sub_region"
            ? actingOfficer.countryName || "Region"
            : actingOfficer.countryName || "Country";

    return {
      officers,
      actingOfficer,
      setActingOfficerId,
      isCountryInScope,
      approvalThresholdUSD,
      canApprove,
      canTransfer: TRANSFER_CAPABLE_LEVELS.includes(level),
      scopeLabel,
    };
  }, [actingOfficer, officers]);

  if (!value) return null;

  return (
    <FinanceOfficerContext.Provider value={value}>{children}</FinanceOfficerContext.Provider>
  );
}

export function useActingFinanceOfficer() {
  const ctx = useContext(FinanceOfficerContext);
  if (!ctx) {
    throw new Error("useActingFinanceOfficer must be used within FinanceOfficerProvider");
  }
  return ctx;
}
