"use client";

import { useMemo, useState } from "react";

import { useTransactions } from "../hooks/useTransactions";
import TransactionTable from "./TransactionTable";
import TransactionFilters, {
  TransactionSort,
} from "./TransactionFilters";
import ExportMenu from "@/components/shared/ExportMenu";
import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import SearchBar from "@/components/shared/SearchBar";

import {
  CustomRange,
  matchesTimeframe,
  toTransactionExportTable,
  TransactionTimeframe,
} from "../utils/transaction";
import { OrganizationType } from "@/types/organization";
import { TransactionStatus } from "@/types/transaction";
import { GeographicFilterState } from "@/types/geo";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

export type TransactionStatusFilter =
  | TransactionStatus
  | "disputed"
  | "all";

interface Props {
  title: string;
  description: string;
  statusFilter: TransactionStatusFilter;
}

export default function TransactionsListView({
  title,
  description,
  statusFilter,
}: Props) {
  const { transactions } = useTransactions();

  const [localStatus, setLocalStatus] =
    useState<TransactionStatusFilter>("all");

  const [timeframe, setTimeframe] =
    useState<TransactionTimeframe>("year");

  const [customRange, setCustomRange] =
    useState<CustomRange>({ start: "", end: "" });

  const [entityType, setEntityType] = useState<
    OrganizationType | "all"
  >("all");

  const [search, setSearch] = useState("");

  const [sort, setSort] =
    useState<TransactionSort>("newest");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const effectiveStatus =
    statusFilter === "all" ? localStatus : statusFilter;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = transactions.filter(
      (transaction) => {
        const matchesStatus =
          effectiveStatus === "all"
            ? true
            : effectiveStatus === "disputed"
              ? transaction.disputed
              : transaction.status === effectiveStatus;

        const matchesTime = matchesTimeframe(
          transaction.createdAt,
          timeframe,
          customRange
        );

        const matchesEntity =
          entityType === "all" ||
          transaction.entityType === entityType;

        const matchesSearch =
          query.length === 0 ||
          transaction.organization
            .toLowerCase()
            .includes(query) ||
          transaction.reference
            .toLowerCase()
            .includes(query);

        // Geographic Filter matching
        let matchesGeo = true;
        if (geoFilter.continent !== "all" || geoFilter.subRegion !== "all" || geoFilter.countryCode !== "all") {
          const countryMatch = GLOBAL_COUNTRY_CURRENCIES.find(
            (c) => c.currencyCode === transaction.currency
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

        return (
          matchesStatus &&
          matchesTime &&
          matchesEntity &&
          matchesSearch &&
          matchesGeo
        );
      }
    );

    const sorted = [...result].sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (sort === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sort === "amount_high") {
        return b.amount - a.amount;
      }

      return a.amount - b.amount;
    });

    return sorted;
  }, [
    transactions,
    effectiveStatus,
    timeframe,
    customRange,
    entityType,
    search,
    sort,
    geoFilter,
  ]);

  const totalItems = filtered.length;
  const pageCount = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Title + Search Bar + Region Scope + Export on Same Line */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search business or reference..."
          />

          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newVal) => {
              setGeoFilter(newVal);
              setPage(1);
            }}
          />

          <ExportMenu
            table={toTransactionExportTable(
              filtered,
              title
            )}
            captureElementId="transaction-table-capture"
          />
        </div>
      </div>

      {/* Unified 1-Line Control Bar */}
      <div className="space-y-4">
        <TransactionFilters
          timeframe={timeframe}
          onTimeframeChange={(value) => {
            setTimeframe(value);
            setPage(1);
          }}
          customRange={customRange}
          onCustomRangeChange={(value) => {
            setCustomRange(value);
            setPage(1);
          }}
          statusFilter={effectiveStatus}
          onStatusFilterChange={(val) => {
            setLocalStatus(val);
            setPage(1);
          }}
          statusEditable={statusFilter === "all"}
          entityType={entityType}
          onEntityTypeChange={(value) => {
            setEntityType(value);
            setPage(1);
          }}
          sort={sort}
          onSortChange={setSort}
        />

        <div id="transaction-table-capture">
          <TransactionTable transactions={paginated} />
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
    </div>
  );
}
