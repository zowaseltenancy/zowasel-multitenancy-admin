"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import {
  APPROVAL_THRESHOLD_USD,
  TRANSFER_CAPABLE_LEVELS,
  FINANCE_ROLE_CAPABILITIES,
  NO_FINANCE_CAPABILITY,
  FinanceGovernanceRole,
  FinanceRoleCapability,
} from "@/constants/finance";
import { PlatformUser, GeographicScopeLevel } from "@/types/user";

function isFinanceGovernanceRole(role: string): role is FinanceGovernanceRole {
  return role in FINANCE_ROLE_CAPABILITIES;
}

interface FinanceOfficerContextValue {
  officers: PlatformUser[];
  actingOfficer: PlatformUser;
  setActingOfficerId: (id: string) => void;
  isCountryInScope: (countryCode: string | undefined) => boolean;
  approvalThresholdUSD: number | null;
  thresholds: Record<GeographicScopeLevel, number | null>;
  updateThreshold: (level: GeographicScopeLevel, val: number | null) => void;
  canApprove: (amountUSD: number) => boolean;
  canTransfer: boolean;
  scopeLabel: string;
  isCFO: boolean;
  roleCapabilities: Record<FinanceGovernanceRole, FinanceRoleCapability>;
  updateRoleCapability: (role: FinanceGovernanceRole, key: keyof Omit<FinanceRoleCapability, "approvalCapLabel">, value: boolean) => void;
  actingOfficerCapability: FinanceRoleCapability;
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
  // The Finance department roster plus the CEO — the CEO sits in the
  // "Executive" department, not "Finance", but is a real, named participant
  // in the requisition sign-off chain (final "Authorize" stage), so the
  // officer pool has to include him or the "Acting as" switcher could never
  // demonstrate his stage of the pipeline at all.
  const officers = useMemo(
    () => users.filter((u) => u.department === "Finance" || u.role === "Chief Executive Officer"),
    [users]
  );

  // Default to the CFO (broadest view) so the hub isn't empty on first load.
  const [actingOfficerId, setActingOfficerId] = useState("usr_fin_cfo");
  const [customThresholds, setCustomThresholds] = useState<Record<GeographicScopeLevel, number | null>>({ ...APPROVAL_THRESHOLD_USD });
  const [customCapabilities, setCustomCapabilities] = useState<Record<FinanceGovernanceRole, FinanceRoleCapability>>({
    ...FINANCE_ROLE_CAPABILITIES,
  });

  const actingOfficer =
    officers.find((o) => o.id === actingOfficerId) ?? officers[0];

  const updateThreshold = (level: GeographicScopeLevel, val: number | null) => {
    setCustomThresholds((prev) => ({ ...prev, [level]: val }));
  };

  const updateRoleCapability = (
    role: FinanceGovernanceRole,
    key: keyof Omit<FinanceRoleCapability, "approvalCapLabel">,
    value: boolean
  ) => {
    setCustomCapabilities((prev) => ({ ...prev, [role]: { ...prev[role], [key]: value } }));
  };

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

    const approvalThresholdUSD = customThresholds[level];
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

    const actingOfficerCapability = isFinanceGovernanceRole(actingOfficer.role)
      ? customCapabilities[actingOfficer.role]
      : NO_FINANCE_CAPABILITY;

    return {
      officers,
      actingOfficer,
      setActingOfficerId,
      isCountryInScope,
      approvalThresholdUSD,
      thresholds: customThresholds,
      updateThreshold,
      canApprove,
      canTransfer: TRANSFER_CAPABLE_LEVELS.includes(level),
      scopeLabel,
      isCFO: actingOfficer.role === "Chief Financial Officer",
      roleCapabilities: customCapabilities,
      updateRoleCapability,
      actingOfficerCapability,
    };
  }, [actingOfficer, officers, customThresholds, customCapabilities]);

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
