"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useTransactions } from "@/features/billing/hooks/useTransactions";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useCampaigns } from "@/features/marketing/hooks/useCampaigns";
import { useCrops } from "@/features/crop/hooks/useCrops";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { GeographicFilterState } from "@/types/geo";

// 8 Carousel Cards
import OrganizationsCarouselCard from "@/features/dashboard/components/OrganizationsCarouselCard";
import KybPipelineCarouselCard from "@/features/dashboard/components/KybPipelineCarouselCard";
import TenantsCarouselCard from "@/features/dashboard/components/TenantsCarouselCard";
import StaffCarouselCard from "@/features/dashboard/components/StaffCarouselCard";
import PlatformActivityCarouselCard from "@/features/organization/components/PlatformActivityCarouselCard";
import CropMarketCarouselCard from "@/features/dashboard/components/CropMarketCarouselCard";
import CommerceFinanceCarouselCard from "@/features/dashboard/components/CommerceFinanceCarouselCard";
import EngagementOpsCarouselCard from "@/features/dashboard/components/EngagementOpsCarouselCard";
import RecentActivityFeed from "@/features/organization/components/RecentActivityFeed";

const CARD_METADATA = [
  { id: 0, title: "Organizations Overview", category: "Core Entities", ringColor: "hover:ring-cyan-500/50 hover:border-cyan-500", badgeBg: "bg-cyan-600" },
  { id: 1, title: "KYB Compliance Pipeline", category: "Verification & Compliance", ringColor: "hover:ring-amber-500/50 hover:border-amber-500", badgeBg: "bg-amber-600" },
  { id: 2, title: "Tenants & Platform Users", category: "Ecosystem Users", ringColor: "hover:ring-indigo-500/50 hover:border-indigo-500", badgeBg: "bg-indigo-600" },
  { id: 3, title: "Zowasel Staff Directory", category: "Internal Team", ringColor: "hover:ring-purple-500/50 hover:border-purple-500", badgeBg: "bg-purple-600" },
  { id: 4, title: "Platform Live Activity", category: "System Pulse", ringColor: "hover:ring-sky-500/50 hover:border-sky-500", badgeBg: "bg-sky-600" },
  { id: 5, title: "Crops & Commodity Market", category: "Marketplace Execution", ringColor: "hover:ring-emerald-500/50 hover:border-emerald-500", badgeBg: "bg-emerald-600" },
  { id: 6, title: "Commerce & Finance", category: "Trade Volume & GMV", ringColor: "hover:ring-blue-500/50 hover:border-blue-500", badgeBg: "bg-blue-600" },
  { id: 7, title: "Engagement & Operations", category: "Leads & Marketing", ringColor: "hover:ring-rose-500/50 hover:border-rose-500", badgeBg: "bg-rose-600" },
];

export default function AdminDashboard() {
  const { organizations } = useOrganizations();
  const { transactions } = useTransactions();
  const { users } = useUsers();
  const { leads } = useLeads();
  const { campaigns } = useCampaigns();

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  // Dynamic Expanded Focus State: null = 8-card grid mode; 0-7 = focus expanded mode
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

  const { summary: cropSummary } = useCrops(geoFilter);

  const isScoped =
    geoFilter.continent !== "all" ||
    geoFilter.subRegion !== "all" ||
    geoFilter.countryCode !== "all";

  // Keyboard shortcut listener for Esc key to collapse expanded view
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && focusedCardIndex !== null) {
        setFocusedCardIndex(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedCardIndex]);

  const matchesGeo = (entity: { continent?: string; subRegion?: string; countryCode?: string }) => {
    const matchesContinent = geoFilter.continent === "all" || entity.continent === geoFilter.continent;
    const matchesSubRegion = geoFilter.subRegion === "all" || entity.subRegion === geoFilter.subRegion;
    const matchesCountry = geoFilter.countryCode === "all" || entity.countryCode === geoFilter.countryCode;
    return matchesContinent && matchesSubRegion && matchesCountry;
  };

  const scopedOrganizations = useMemo(() => organizations.filter(matchesGeo), [organizations, geoFilter]);
  const tenantUsers = useMemo(() => users.filter((user) => user.userCategory !== "staff"), [users]);
  const scopedTenantUsers = useMemo(() => tenantUsers.filter(matchesGeo), [tenantUsers, geoFilter]);
  const scopedLeads = useMemo(() => leads.filter(matchesGeo), [leads, geoFilter]);

  const scopedTransactions = useMemo(() => {
    const scopedOrgNames = new Set(scopedOrganizations.map((o) => o.name));
    return transactions.filter((transaction) => scopedOrgNames.has(transaction.organization));
  }, [transactions, scopedOrganizations]);

  const activeModulesCount = useMemo(
    () =>
      scopedOrganizations.reduce(
        (total, organization) =>
          total + organization.subscriptions.reduce((subTotal, s) => subTotal + s.activeModules.length, 0),
        0
      ),
    [scopedOrganizations]
  );


  const handlePrevCard = () => {
    if (focusedCardIndex === null) return;
    setFocusedCardIndex((prev) => (prev! === 0 ? CARD_METADATA.length - 1 : prev! - 1));
  };

  const handleNextCard = () => {
    if (focusedCardIndex === null) return;
    setFocusedCardIndex((prev) => (prev! === CARD_METADATA.length - 1 ? 0 : prev! + 1));
  };

  // Render Card Component by index
  const renderCardContent = (index: number, isExpanded: boolean) => {
    switch (index) {
      case 0:
        return <OrganizationsCarouselCard organizations={scopedOrganizations} isExpanded={isExpanded} />;
      case 1:
        return <KybPipelineCarouselCard organizations={scopedOrganizations} isExpanded={isExpanded} />;
      case 2:
        return <TenantsCarouselCard users={users} isExpanded={isExpanded} />;
      case 3:
        return <StaffCarouselCard users={users} isExpanded={isExpanded} />;
      case 4:
        return (
          <PlatformActivityCarouselCard
            organizations={scopedOrganizations}
            users={scopedTenantUsers}
            transactions={scopedTransactions}
            isExpanded={isExpanded}
          />
        );
      case 5:
        return <CropMarketCarouselCard summary={cropSummary} isExpanded={isExpanded} />;
      case 6:
        return (
          <CommerceFinanceCarouselCard
            organizations={scopedOrganizations}
            transactions={scopedTransactions}
            isExpanded={isExpanded}
          />
        );
      case 7:
        return (
          <EngagementOpsCarouselCard
            activeModulesCount={activeModulesCount}
            leads={scopedLeads}
            campaigns={campaigns}
            isExpanded={isExpanded}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Section Grid: Greeting + Live Activity Ticker on Left, Region Scope Map Selector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Greeting & Live Activity Ticker matching right map card height 1:1 */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back Super Admin</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isScoped
                ? "Here's an overview scoped to your selected region."
                : "Here's an overview of your platform."}
            </p>
          </div>

          {/* Compact Live Activity Ticker (stretches vertically to match map card height) */}
          <div className="w-full flex-1 min-h-[160px]">
            <RecentActivityFeed
              organizations={scopedOrganizations}
              users={scopedTenantUsers}
              leads={scopedLeads}
              campaigns={campaigns}
              compact={true}
              className="h-full"
            />
          </div>
        </div>

        {/* Right Column: Full Region Scope Map Selector Card */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector value={geoFilter} onChange={setGeoFilter} />
        </div>
      </div>

      {/* Dynamic Dashboard Overview Section with Framer Motion Inward Origin Morphing */}
      <LayoutGroup>
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Platform Overview ({focusedCardIndex === null ? "8 Executive Summaries" : "Expanded Focus View"})
              </h3>
            </div>

            {focusedCardIndex !== null && (
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted border rounded">Esc</kbd> to return to grid
              </p>
            )}
          </div>

          {/* Focus Mode Action Bar (Visible only when a card is expanded) */}
          <AnimatePresence>
            {focusedCardIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border bg-card shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => setFocusedCardIndex(null)}
                    className="h-8 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>← Back to All 8 Cards</span>
                  </Button>

                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Section {focusedCardIndex + 1} of {CARD_METADATA.length}: {CARD_METADATA[focusedCardIndex].title}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-semibold">
                      Category: {CARD_METADATA[focusedCardIndex].category}
                    </p>
                  </div>
                </div>

                {/* Next / Prev Section Buttons */}
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevCard}
                    className="h-8 text-xs font-bold gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </Button>
                  <span className="text-xs font-mono font-bold text-muted-foreground px-2">
                    {focusedCardIndex + 1} / {CARD_METADATA.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextCard}
                    className="h-8 text-xs font-bold gap-1 cursor-pointer"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid Layout Container */}
          <div
            className={
              focusedCardIndex === null
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden p-1"
                : "w-full overflow-hidden p-1"
            }
          >
            {CARD_METADATA.map((meta, index) => {
              const isFocused = focusedCardIndex === index;
              const isAnyFocused = focusedCardIndex !== null;

              // Hide non-focused cards when in expanded mode
              if (isAnyFocused && !isFocused) return null;

              return (
                <div key={meta.id} className="overflow-hidden rounded-xl">
                  <motion.div
                    {...(isAnyFocused ? { layoutId: `dashboard-card-slot-${meta.id}` } : {})}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 34,
                      mass: 0.85,
                    }}
                    onClick={() => focusedCardIndex === null && setFocusedCardIndex(index)}
                    className={
                      focusedCardIndex === null
                        ? `group relative cursor-pointer rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-2 ${meta.ringColor} transform-gpu`
                        : "w-full min-h-[360px] transform-gpu"
                    }
                  >
                    {focusedCardIndex === null && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className={`absolute top-3 right-3 z-10 text-[10px] font-extrabold ${meta.badgeBg} text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 pointer-events-none`}
                      >
                        <Maximize2 className="h-2.5 w-2.5" /> Expand Overview
                      </motion.span>
                    )}
                    {renderCardContent(index, isFocused)}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>
      </LayoutGroup>

    </div>
  );
}
