"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSubscriptions } from "../hooks/useSubscriptions";
import SubscriptionGrid from "./SubscriptionGrid";
import SearchBar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import HierarchicalRegionFilter from "@/components/shared/HierarchicalRegionFilter";
import { SubscriptionStatus } from "@/types/subscription";
import { GeographicFilterState } from "@/types/geo";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

export type SubscriptionStatusFilter = SubscriptionStatus | "all";

interface Props {
  title: string;
  description: string;
  statusFilter: SubscriptionStatusFilter;
}

export default function SubscriptionsListView({
  title,
  description,
  statusFilter,
}: Props) {
  const { subscriptions } = useSubscriptions();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<SubscriptionStatusFilter>(statusFilter);

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const activeCount = subscriptions.filter((s) => s.status === "Active").length;
  const trialCount = subscriptions.filter((s) => s.status === "Trial").length;
  const pastDueCount = subscriptions.filter((s) => s.status === "Past Due").length;
  const cancelledCount = subscriptions.filter((s) => s.status === "Cancelled").length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subscriptions.filter((sub) => {
      const matchesStatus =
        activeTab === "all" || sub.status.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        sub.organization.toLowerCase().includes(query) ||
        sub.product.toLowerCase().includes(query);

      // Geographic 4-Tier Filter matching
      let matchesGeo = true;
      if (geoFilter.continent !== "all" || geoFilter.subRegion !== "all" || geoFilter.countryCode !== "all") {
        const countryMatch = GLOBAL_COUNTRY_CURRENCIES.find(
          (c) => c.currencyCode === sub.currency
        );

        if (countryMatch) {
          if (geoFilter.continent !== "all" && countryMatch.continent !== geoFilter.continent) {
            matchesGeo = false;
          }
          if (geoFilter.subRegion !== "all" && countryMatch.subRegion !== geoFilter.subRegion) {
            matchesGeo = false;
          }
          if (geoFilter.countryCode !== "all" && countryMatch.countryCode !== geoFilter.countryCode) {
            matchesGeo = false;
          }
        }
      }

      return matchesStatus && matchesSearch && matchesGeo;
    });
  }, [subscriptions, activeTab, search, geoFilter]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const STATUS_TABS = [
    { key: "all", label: "All Subscriptions", href: "/admin/billing/subscriptions/all", count: subscriptions.length },
    { key: "Active", label: "Active", href: "/admin/billing/subscriptions/active", count: activeCount },
    { key: "Trial", label: "Trial", href: "/admin/billing/subscriptions/trial", count: trialCount },
    { key: "Past Due", label: "Past Due", href: "/admin/billing/subscriptions/past-due", count: pastDueCount },
    { key: "Cancelled", label: "Cancelled", href: "/admin/billing/subscriptions/cancelled", count: cancelledCount },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* 4-Tier Geographic Cascading Filter */}
      <HierarchicalRegionFilter
        value={geoFilter}
        onChange={(newVal) => {
          setGeoFilter(newVal);
          setPage(1);
        }}
      />

      {/* Tabbed Navigation Bar & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab.toLowerCase() === tab.key.toLowerCase();

            return (
              <Link key={tab.key} href={tab.href}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key as SubscriptionStatusFilter);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-background text-muted-foreground border"}`}>
                    {tab.count}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>

        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by business or product name..."
        />
      </div>

      {/* Subscriptions Grid & Pagination */}
      <section className="space-y-4">
        <SubscriptionGrid subscriptions={paginated} />

        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={totalItems}
          pageSizeOptions={[5, 10, 15, 20]}
        />
      </section>
    </div>
  );
}
