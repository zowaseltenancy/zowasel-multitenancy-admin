"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useInvoices } from "../hooks/useInvoices";
import InvoiceTable from "./InvoiceTable";
import SearchBar from "@/components/shared/SearchBar";
import ExportMenu from "@/components/shared/ExportMenu";
import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { toInvoiceExportTable } from "../utils/invoice";
import { InvoiceStatus } from "@/types/invoice";
import { GeographicFilterState } from "@/types/geo";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

export type InvoiceStatusFilter = InvoiceStatus | "all";

interface Props {
  title: string;
  description: string;
  statusFilter: InvoiceStatusFilter;
}

export default function InvoicesListView({
  title,
  description,
  statusFilter,
}: Props) {
  const { invoices } = useInvoices();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<InvoiceStatusFilter>(statusFilter);

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesStatus =
        activeTab === "all" || invoice.status.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        invoice.organization.toLowerCase().includes(query) ||
        invoice.invoiceNumber.toLowerCase().includes(query);

      // Geographic Region Filter matching
      let matchesGeo = true;
      if (geoFilter.continent !== "all" || geoFilter.subRegion !== "all" || geoFilter.countryCode !== "all") {
        const countryMatch = GLOBAL_COUNTRY_CURRENCIES.find(
          (c) => c.currencyCode === invoice.currency
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
  }, [invoices, activeTab, search, geoFilter]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const STATUS_TABS = [
    { key: "all", label: "All Invoices", href: "/admin/billing/invoices/all" },
    { key: "Paid", label: "Paid", href: "/admin/billing/invoices/paid" },
    { key: "Pending", label: "Pending", href: "/admin/billing/invoices/pending" },
    { key: "Overdue", label: "Overdue", href: "/admin/billing/invoices/overdue" },
    { key: "Void", label: "Void", href: "/admin/billing/invoices/void" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <ExportMenu
          table={toInvoiceExportTable(filtered, title)}
          captureElementId="invoice-table-capture"
        />
      </div>

      {/* Sleek 1-Line Control Bar: Status Tabs + Compact Region Scope Popover + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab.toLowerCase() === tab.key.toLowerCase();
            const count =
              tab.key === "all"
                ? invoices.length
                : invoices.filter((i) => i.status.toLowerCase() === tab.key.toLowerCase()).length;

            return (
              <Link key={tab.key} href={tab.href}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key as InvoiceStatusFilter);
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

        <div className="flex items-center gap-2">
          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newVal) => {
              setGeoFilter(newVal);
              setPage(1);
            }}
          />

          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search invoice number..."
          />
        </div>
      </div>

      <div id="invoice-table-capture">
        <InvoiceTable invoices={paginated} />
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
