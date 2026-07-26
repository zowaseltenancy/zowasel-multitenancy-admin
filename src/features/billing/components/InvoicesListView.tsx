"use client";

import { useMemo, useState } from "react";

import { useInvoices } from "../hooks/useInvoices";
import InvoiceTable from "./InvoiceTable";
import SearchBar from "@/components/shared/SearchBar";
import ExportMenu from "@/components/shared/ExportMenu";
import Pagination from "@/components/shared/Pagination";
import { toInvoiceExportTable } from "../utils/invoice";
import { InvoiceStatus } from "@/types/invoice";

const PAGE_SIZE = 6;

export type InvoiceStatusFilter =
  | InvoiceStatus
  | "all";

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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesStatus =
        statusFilter === "all" ||
        invoice.status === statusFilter;

      const matchesSearch =
        query.length === 0 ||
        invoice.organization
          .toLowerCase()
          .includes(query) ||
        invoice.invoiceNumber
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, search]);

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
          table={toInvoiceExportTable(filtered, title)}
          captureElementId="invoice-table-capture"
        />
      </div>

      <div className="flex justify-end">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by business or invoice number..."
        />
      </div>

      <div id="invoice-table-capture">
        <InvoiceTable invoices={paginated} />
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
