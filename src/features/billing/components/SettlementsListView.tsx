"use client";

import { useMemo, useState } from "react";

import { useSettlements } from "../hooks/useSettlements";
import SettlementTable from "./SettlementTable";
import SearchBar from "@/components/shared/SearchBar";
import ExportMenu from "@/components/shared/ExportMenu";
import Pagination from "@/components/shared/Pagination";
import { toSettlementExportTable } from "../utils/settlement";
import { SettlementStatus } from "@/types/settlement";

const PAGE_SIZE = 6;

export type SettlementStatusFilter =
  | SettlementStatus
  | "all";

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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return settlements.filter((settlement) => {
      const matchesStatus =
        statusFilter === "all" ||
        settlement.status === statusFilter;

      const matchesSearch =
        query.length === 0 ||
        settlement.organization
          .toLowerCase()
          .includes(query) ||
        settlement.settlementNumber
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [settlements, statusFilter, search]);

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
          <h1 className="text-3xl font-semibold">
            {title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {description}
          </p>
        </div>

        <ExportMenu
          table={toSettlementExportTable(
            filtered,
            title
          )}
          captureElementId="settlement-table-capture"
        />
      </div>

      <div className="flex justify-end">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by business or settlement number..."
        />
      </div>

      <div id="settlement-table-capture">
        <SettlementTable settlements={paginated} />
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
