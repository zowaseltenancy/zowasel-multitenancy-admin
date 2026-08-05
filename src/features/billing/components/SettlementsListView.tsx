"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSettlements } from "../hooks/useSettlements";
import SettlementTable from "./SettlementTable";
import SearchBar from "@/components/shared/SearchBar";
import ExportMenu from "@/components/shared/ExportMenu";
import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { toSettlementExportTable } from "../utils/settlement";
import { SettlementStatus } from "@/types/settlement";
import { GeographicFilterState } from "@/types/geo";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

export type SettlementStatusFilter = SettlementStatus | "all";

interface Props {
  title: string;
  description: string;
  statusFilter: SettlementStatusFilter;
}

export default function SettlementsListView({
  title,
  description,
  statusFilter,
}: Props) {
  const { settlements } = useSettlements();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<SettlementStatusFilter>(statusFilter);

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return settlements.filter((settlement) => {
      const matchesStatus =
        activeTab === "all" || settlement.status.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        settlement.organization.toLowerCase().includes(query) ||
        settlement.settlementNumber.toLowerCase().includes(query);

      // Geographic Region Filter matching
      let matchesGeo = true;
      if (geoFilter.continent !== "all" || geoFilter.subRegion !== "all" || geoFilter.countryCode !== "all") {
        const countryMatch = GLOBAL_COUNTRY_CURRENCIES.find(
          (c) => c.currencyCode === settlement.currency
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
  }, [settlements, activeTab, search, geoFilter]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const STATUS_TABS = [
    { key: "all", label: "All Settlements", href: "/admin/billing/settlements/all" },
    { key: "Completed", label: "Completed", href: "/admin/billing/settlements/completed" },
    { key: "Scheduled", label: "Scheduled", href: "/admin/billing/settlements/scheduled" },
    { key: "Processing", label: "Processing", href: "/admin/billing/settlements/processing" },
    { key: "Failed", label: "Failed", href: "/admin/billing/settlements/failed" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Top Section Grid: Title + ExportMenu + Status Tabs on Left, Map Selector at Top Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>

            <ExportMenu
              table={toSettlementExportTable(filtered, title)}
              captureElementId="settlement-table-capture"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab.toLowerCase() === tab.key.toLowerCase();
              const count =
                tab.key === "all"
                  ? settlements.length
                  : settlements.filter((s) => s.status.toLowerCase() === tab.key.toLowerCase()).length;

              return (
                <Link key={tab.key} href={tab.href}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.key as SettlementStatusFilter);
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
                      {count}
                    </span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newVal) => {
              setGeoFilter(newVal);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Control Bar: Search Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search settlement number..."
        />
      </div>

      <div id="settlement-table-capture">
        <SettlementTable settlements={paginated} />
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalItems={totalItems}
        pageSizeOptions={[5, 10, 15, 20]}
      />
    </div>
  );
}
