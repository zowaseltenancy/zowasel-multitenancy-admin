"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CampaignRecipient } from "../utils/recipients";

interface Props {
  recipients: CampaignRecipient[];
}

const PAGE_SIZES = [10, 25, 50, 100];

export default function RecipientListView({ recipients }: Props) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recipients;
    return recipients.filter(
      (r) => r.name.toLowerCase().includes(q) || r.organization.toLowerCase().includes(q) || r.contact.toLowerCase().includes(q)
    );
  }, [recipients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize);

  if (recipients.length === 0) {
    return null;
  }

  return (
    <Card className="border shadow-2xs">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold">Recipient List</CardTitle>
            <CardDescription className="text-xs">
              {recipients.length.toLocaleString()} recipients on this send — searchable and paginated, not one long dump.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search name, org, contact..."
                className="h-8 w-56 pl-8 text-xs"
              />
            </div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="h-8 rounded-md border bg-background px-2 text-xs font-semibold"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y text-xs font-semibold max-h-[420px] overflow-y-auto">
          {pageRows.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3">
              <div>
                <p className="font-bold text-foreground">{r.name}</p>
                <p className="text-[11px] font-normal text-muted-foreground">{r.organization}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[11px] text-muted-foreground">{r.contact}</p>
                <span
                  className={
                    r.status === "Delivered"
                      ? "inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 mt-0.5"
                      : "inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 mt-0.5"
                  }
                >
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t p-3 text-xs font-semibold text-muted-foreground">
          <span>
            Page {clampedPage + 1} of {totalPages} &bull; {filtered.length.toLocaleString()} matching
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={clampedPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={clampedPage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
