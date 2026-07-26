"use client";

import { useMemo, useState } from "react";

import { useTransactions } from "../hooks/useTransactions";
import TransactionTable from "./TransactionTable";
import TransactionFilters, {
  TransactionSort,
} from "./TransactionFilters";
import ExportMenu from "@/components/shared/ExportMenu";
import Pagination from "@/components/shared/Pagination";

import {
  CustomRange,
  matchesTimeframe,
  toTransactionExportTable,
  TransactionTimeframe,
} from "../utils/transaction";
import { OrganizationType } from "@/types/organization";
import { TransactionStatus } from "@/types/transaction";

const PAGE_SIZE = 6;

export type TransactionStatusFilter =
  | TransactionStatus
  | "disputed"
  | "all";

interface Props {
  title: string;

  description: string;

  statusFilter: TransactionStatusFilter;
}

const ALL_STATUS_OPTIONS: {
  label: string;

  value: TransactionStatusFilter;
}[] = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
  { label: "Disputed", value: "disputed" },
];

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

        return (
          matchesStatus &&
          matchesTime &&
          matchesEntity &&
          matchesSearch
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
  ]);

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {description}
          </p>
        </div>

        <ExportMenu
          table={toTransactionExportTable(
            filtered,
            title
          )}
          captureElementId="transaction-table-capture"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
            entityType={entityType}
            onEntityTypeChange={(value) => {
              setEntityType(value);
              setPage(1);
            }}
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            sort={sort}
            onSortChange={setSort}
          />

          {statusFilter === "all" && (
            <select
              value={localStatus}
              onChange={(event) => {
                setLocalStatus(
                  event.target
                    .value as TransactionStatusFilter
                );
                setPage(1);
              }}
              className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
            >
              {ALL_STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div id="transaction-table-capture">
          <TransactionTable transactions={paginated} />
        </div>

        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
