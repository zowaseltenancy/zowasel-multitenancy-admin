"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Filter,
  Layers,
  Search,
  SlidersHorizontal,
  X,
  CreditCard,
  ShieldCheck,
  UserCheck,
  Building,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KybStatus } from "@/types/kyb";
import { Organization, OrganizationType } from "@/types/organization";
import { cn } from "@/lib/utils";

export interface OrganizationFiltersState {
  status: KybStatus | "all";
  plan: string;
  modules: string[];
  kybStatus: KybStatus | "all";
  onboardedBy: string;
  type: OrganizationType | "all";
  moduleCount: "all" | "0" | "1-2" | "3+";
  search: string;
}

export const INITIAL_ORGANIZATION_FILTERS: OrganizationFiltersState = {
  status: "all",
  plan: "all",
  modules: [],
  kybStatus: "all",
  onboardedBy: "all",
  type: "all",
  moduleCount: "all",
  search: "",
};

const MODULE_OPTIONS = [
  { id: "farmer_database", label: "Farmer Database & Registration" },
  { id: "carbon_sustainability", label: "Carbon & Sustainability" },
  { id: "soil_carbon", label: "Soil Carbon Analysis" },
  { id: "agroforestry", label: "Agroforestry Intelligence" },
  { id: "yield_forecast", label: "Crop Yield Forecasting" },
  { id: "crop_monitoring", label: "Crop Health & Satellite" },
  { id: "weather_alerts", label: "Weather & Climate Alerts" },
  { id: "supply_chain", label: "Supply Chain & Traceability" },
  { id: "leads_crm", label: "Leads & CRM Management" },
  { id: "marketplace", label: "Marketplace & Trade" },
  { id: "microfinance", label: "Microfinance & Credit" },
  { id: "kyb_verification", label: "KYB Compliance Engine" },
];

const PLAN_OPTIONS = [
  { id: "all", label: "All plans" },
  { id: "Free", label: "Free" },
  { id: "Growth", label: "Growth" },
  { id: "Enterprise", label: "Enterprise" },
  { id: "Pay-As-You-Go", label: "Pay-As-You-Go" },
];

const STATUS_OPTIONS: { id: KybStatus | "all"; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "approved", label: "Approved" },
  { id: "pending", label: "Pending" },
  { id: "rejected", label: "Rejected" },
];

const ORG_TYPE_OPTIONS: { id: OrganizationType | "all"; label: string }[] = [
  { id: "all", label: "All organization types" },
  { id: "merchant", label: "Merchant" },
  { id: "buyer", label: "Buyer" },
  { id: "agrodealer", label: "Agrodealer" },
  { id: "cooperative", label: "Cooperative" },
];

const MODULE_COUNT_OPTIONS: { id: "all" | "0" | "1-2" | "3+"; label: string }[] = [
  { id: "all", label: "All module counts" },
  { id: "0", label: "No modules (0)" },
  { id: "1-2", label: "1–2 modules" },
  { id: "3+", label: "3+ modules" },
];

interface Props {
  filters: OrganizationFiltersState;
  onFilterChange: (filters: OrganizationFiltersState) => void;
  organizations: Organization[];
  hideStatusInToolbar?: boolean;
}

export default function OrganizationFilterToolbar({
  filters,
  onFilterChange,
  organizations,
  hideStatusInToolbar = false,
}: Props) {
  // Temporary state for Modules popover multi-select
  const [tempModules, setTempModules] = useState<string[]>(filters.modules);
  const [isModulesOpen, setIsModulesOpen] = useState(false);

  // Temporary state for More Filters popover
  const [tempKyb, setTempKyb] = useState<KybStatus | "all">(filters.kybStatus);
  const [tempOnboardedBy, setTempOnboardedBy] = useState<string>(filters.onboardedBy);
  const [tempType, setTempType] = useState<OrganizationType | "all">(filters.type);
  const [tempModuleCount, setTempModuleCount] = useState<"all" | "0" | "1-2" | "3+">(filters.moduleCount);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Derive unique staff / agents from organization data
  const onboardedByOptions = useMemo(() => {
    const staffSet = new Map<string, string>();
    organizations.forEach((org) => {
      if (org.onboardedByAgent?.name) {
        staffSet.set(org.onboardedByAgent.id, org.onboardedByAgent.name);
      }
      if (org.assignedStaff?.primary?.name) {
        staffSet.set(org.assignedStaff.primary.id, org.assignedStaff.primary.name);
      }
    });
    return Array.from(staffSet.entries()).map(([id, name]) => ({
      id,
      label: name,
    }));
  }, [organizations]);

  // Calculate secondary active filter count for "More Filters"
  const secondaryFilterCount = useMemo(() => {
    let count = 0;
    if (filters.kybStatus !== "all") count++;
    if (filters.onboardedBy !== "all") count++;
    if (filters.type !== "all") count++;
    if (filters.moduleCount !== "all") count++;
    return count;
  }, [filters]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      (filters.status !== "all" && !hideStatusInToolbar) ||
      filters.plan !== "all" ||
      filters.modules.length > 0 ||
      filters.kybStatus !== "all" ||
      filters.onboardedBy !== "all" ||
      filters.type !== "all" ||
      filters.moduleCount !== "all" ||
      filters.search.trim().length > 0
    );
  }, [filters, hideStatusInToolbar]);

  const updateFilter = <K extends keyof OrganizationFiltersState>(
    key: K,
    value: OrganizationFiltersState[K]
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      ...INITIAL_ORGANIZATION_FILTERS,
      // Preserve tab scope status if locked
      status: hideStatusInToolbar ? filters.status : "all",
    });
  };

  const handleApplyModules = () => {
    updateFilter("modules", tempModules);
    setIsModulesOpen(false);
  };

  const handleClearModules = () => {
    setTempModules([]);
    updateFilter("modules", []);
    setIsModulesOpen(false);
  };

  const handleApplyMoreFilters = () => {
    onFilterChange({
      ...filters,
      kybStatus: tempKyb,
      onboardedBy: tempOnboardedBy,
      type: tempType,
      moduleCount: tempModuleCount,
    });
    setIsMoreOpen(false);
  };

  const handleClearMoreFilters = () => {
    setTempKyb("all");
    setTempOnboardedBy("all");
    setTempType("all");
    setTempModuleCount("all");
    onFilterChange({
      ...filters,
      kybStatus: "all",
      onboardedBy: "all",
      type: "all",
      moduleCount: "all",
    });
    setIsMoreOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Primary Toolbar Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Filter Dropdowns Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Status Filter (unless hidden on specific tab) */}
          {!hideStatusInToolbar && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`inline-flex h-10 items-center justify-between gap-2 rounded-xl border px-3 text-xs font-medium transition-colors shadow-2xs hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-[#438B3E]/30 cursor-pointer ${
                  filters.status !== "all"
                    ? "border-[#438B3E] bg-[#438B3E]/10 text-[#438B3E] font-semibold dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <span>
                  {filters.status === "all"
                    ? "Status"
                    : STATUS_OPTIONS.find((s) => s.id === filters.status)?.label || "Status"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 rounded-xl p-1 shadow-lg">
                {STATUS_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.id}
                    onClick={() => updateFilter("status", opt.id)}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs cursor-pointer ${
                      filters.status === opt.id ? "bg-[#438B3E]/10 text-[#438B3E] font-semibold" : ""
                    }`}
                  >
                    <span>{opt.label}</span>
                    {filters.status === opt.id && <Check className="h-3.5 w-3.5 text-[#438B3E]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* 2. Plan Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`inline-flex h-10 items-center justify-between gap-2 rounded-xl border px-3 text-xs font-medium transition-colors shadow-2xs hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-[#438B3E]/30 cursor-pointer ${
                filters.plan !== "all"
                  ? "border-[#438B3E] bg-[#438B3E]/10 text-[#438B3E] font-semibold dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]"
                  : "border-border bg-card text-foreground"
              }`}
            >
              <CreditCard className="h-3.5 w-3.5 opacity-70" />
              <span>
                {filters.plan === "all"
                  ? "Plan"
                  : PLAN_OPTIONS.find((p) => p.id === filters.plan)?.label || filters.plan}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 rounded-xl p-1 shadow-lg">
              {PLAN_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() => updateFilter("plan", opt.id)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs cursor-pointer ${
                    filters.plan === opt.id ? "bg-[#438B3E]/10 text-[#438B3E] font-semibold" : ""
                  }`}
                >
                  <span>{opt.label}</span>
                  {filters.plan === opt.id && <Check className="h-3.5 w-3.5 text-[#438B3E]" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. Modules Filter (Multi-select with checkboxes) */}
          <Popover
            open={isModulesOpen}
            onOpenChange={(open) => {
              setIsModulesOpen(open);
              if (open) setTempModules(filters.modules);
            }}
          >
            <PopoverTrigger
              className={`inline-flex h-10 items-center justify-between gap-2 rounded-xl border px-3 text-xs font-medium transition-colors shadow-2xs hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-[#438B3E]/30 cursor-pointer ${
                filters.modules.length > 0
                  ? "border-[#438B3E] bg-[#438B3E]/10 text-[#438B3E] font-semibold dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]"
                  : "border-border bg-card text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5 opacity-70" />
              <span>
                {filters.modules.length === 0
                  ? "Modules"
                  : filters.modules.length === 1
                  ? MODULE_OPTIONS.find((m) => m.id === filters.modules[0])?.label || "1 Module"
                  : `Modules (${filters.modules.length})`}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 rounded-2xl p-3 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Filter by Modules
                  </span>
                  {tempModules.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTempModules([])}
                      className="text-[11px] font-semibold text-[#438B3E] hover:underline cursor-pointer"
                    >
                      Deselect all
                    </button>
                  )}
                </div>

                <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
                  {MODULE_OPTIONS.map((module) => {
                    const isChecked = tempModules.includes(module.id);
                    return (
                      <label
                        key={module.id}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTempModules([...tempModules, module.id]);
                            } else {
                              setTempModules(tempModules.filter((id) => id !== module.id));
                            }
                          }}
                        />
                        <span className={isChecked ? "font-medium text-foreground" : "text-muted-foreground"}>
                          {module.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearModules}
                    className="h-8 text-xs cursor-pointer"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyModules}
                    className="h-8 bg-[#438B3E] hover:bg-[#367632] text-white text-xs font-semibold rounded-lg px-3 cursor-pointer"
                  >
                    Apply ({tempModules.length})
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* More Filters Popover */}
          <Popover
            open={isMoreOpen}
            onOpenChange={(open) => {
              setIsMoreOpen(open);
              if (open) {
                setTempKyb(filters.kybStatus);
                setTempOnboardedBy(filters.onboardedBy);
                setTempType(filters.type);
                setTempModuleCount(filters.moduleCount);
              }
            }}
          >
            <PopoverTrigger
              className={`inline-flex h-10 items-center justify-between gap-2 rounded-xl border px-3 text-xs font-medium transition-colors shadow-2xs hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-[#438B3E]/30 cursor-pointer ${
                secondaryFilterCount > 0
                  ? "border-[#438B3E] bg-[#438B3E]/10 text-[#438B3E] font-semibold dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]"
                  : "border-border bg-card text-foreground"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 opacity-70" />
              <span>More Filters</span>
              {secondaryFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#438B3E] px-1 text-[10px] font-bold text-white">
                  {secondaryFilterCount}
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 rounded-2xl p-4 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-1.5">
                    <Filter className="h-4 w-4 text-[#438B3E]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Secondary Filters
                    </span>
                  </div>
                  {secondaryFilterCount > 0 && (
                    <span className="text-[11px] font-semibold text-[#438B3E]">
                      {secondaryFilterCount} active
                    </span>
                  )}
                </div>

                {/* Secondary 1: KYB Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#438B3E]" />
                    <span>KYB Status</span>
                  </label>
                  <select
                    value={tempKyb}
                    onChange={(e) => setTempKyb(e.target.value as KybStatus | "all")}
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#438B3E]/30"
                  >
                    <option value="all">All KYB statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Secondary 2: Organization Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[#438B3E]" />
                    <span>Organization Type</span>
                  </label>
                  <select
                    value={tempType}
                    onChange={(e) => setTempType(e.target.value as OrganizationType | "all")}
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#438B3E]/30"
                  >
                    {ORG_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Secondary 3: Onboarded By Staff */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-[#438B3E]" />
                    <span>Onboarded By</span>
                  </label>
                  <select
                    value={tempOnboardedBy}
                    onChange={(e) => setTempOnboardedBy(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#438B3E]/30"
                  >
                    <option value="all">All staff / agents</option>
                    {onboardedByOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Secondary 4: Module Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#438B3E]" />
                    <span>Module Count</span>
                  </label>
                  <select
                    value={tempModuleCount}
                    onChange={(e) => setTempModuleCount(e.target.value as "all" | "0" | "1-2" | "3+")}
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#438B3E]/30"
                  >
                    {MODULE_COUNT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearMoreFilters}
                    className="h-8 text-xs cursor-pointer"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyMoreFilters}
                    className="h-8 bg-[#438B3E] hover:bg-[#367632] text-white text-xs font-semibold rounded-lg px-3 cursor-pointer"
                  >
                    Apply filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Search Input Box */}
        <div className="relative min-w-[240px] sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search by business or owner..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-8 text-xs font-medium placeholder:text-muted-foreground/70 focus-visible:border-[#438B3E] focus-visible:ring-2 focus-visible:ring-[#438B3E]/20"
          />
          {filters.search.length > 0 && (
            <button
              type="button"
              onClick={() => updateFilter("search", "")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips Bar (Section 5 of qx.docx) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 animate-auth-fade">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Active filters:</span>

          {/* Status chip */}
          {!hideStatusInToolbar && filters.status !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]">
              <span>Status: <strong className="capitalize">{filters.status}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter("status", "all")}
                className="hover:opacity-75 cursor-pointer ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Plan chip */}
          {filters.plan !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]">
              <span>Plan: <strong>{filters.plan}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter("plan", "all")}
                className="hover:opacity-75 cursor-pointer ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Module chips */}
          {filters.modules.map((modId) => {
            const modLabel = MODULE_OPTIONS.find((m) => m.id === modId)?.label || modId;
            return (
              <span
                key={modId}
                className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]"
              >
                <span>Module: <strong>{modLabel}</strong></span>
                <button
                  type="button"
                  onClick={() => updateFilter("modules", filters.modules.filter((id) => id !== modId))}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}

          {/* KYB Status chip */}
          {filters.kybStatus !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]">
              <span>KYB: <strong className="capitalize">{filters.kybStatus}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter("kybStatus", "all")}
                className="hover:opacity-75 cursor-pointer ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Type chip */}
          {filters.type !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]">
              <span>Type: <strong className="capitalize">{filters.type}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter("type", "all")}
                className="hover:opacity-75 cursor-pointer ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Onboarded By chip */}
          {filters.onboardedBy !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]">
              <span>
                Onboarded: <strong>{onboardedByOptions.find((o) => o.id === filters.onboardedBy)?.label || filters.onboardedBy}</strong>
              </span>
              <button
                type="button"
                onClick={() => updateFilter("onboardedBy", "all")}
                className="hover:opacity-75 cursor-pointer ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Module Count chip */}
          {filters.moduleCount !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]">
              <span>Modules: <strong>{filters.moduleCount}</strong></span>
              <button
                type="button"
                onClick={() => updateFilter("moduleCount", "all")}
                className="hover:opacity-75 cursor-pointer ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Search chip */}
          {filters.search.trim().length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-[#438B3E]/20 bg-[#438B3E]/10 px-2 py-1 text-xs font-medium text-[#438B3E] dark:bg-[#438B3E]/20 dark:text-[#B8E5B8]">
              <span>Search: &ldquo;<strong>{filters.search}</strong>&rdquo;</span>
              <button
                type="button"
                onClick={() => updateFilter("search", "")}
                className="hover:opacity-75 cursor-pointer ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Clear all action */}
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-muted-foreground hover:text-[#438B3E] underline cursor-pointer ml-1.5 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
