"use client";

import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import LeadTable from "./LeadTable";
import ConvertLeadDialog from "./ConvertLeadDialog";
import AddLeadDialog from "./AddLeadDialog";
import RemoveLeadDialog from "./RemoveLeadDialog";
import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { useLeads } from "../hooks/useLeads";
import { ConvertLeadValues, useLeadConversion } from "../hooks/useLeadConversion";
import { LEAD_STATUS_LABELS } from "@/constants/lead";
import { Lead, LeadStatus } from "@/types/lead";
import { GeographicFilterState } from "@/types/geo";

const STATUS_FILTERS: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All Leads", value: "all" },
  { label: LEAD_STATUS_LABELS.incomplete, value: "incomplete" },
  { label: LEAD_STATUS_LABELS.ready_to_convert, value: "ready_to_convert" },
  { label: LEAD_STATUS_LABELS.converted, value: "converted" },
  { label: LEAD_STATUS_LABELS.lost, value: "lost" },
];

interface Props {
  initialStatus?: LeadStatus | "all";
}

export default function LeadsListView({ initialStatus = "all" }: Props) {
  const { leads, addLead, markLost, removeLead, isCreating } = useLeads();
  const { convert } = useLeadConversion();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">(initialStatus);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [convertTarget, setConvertTarget] = useState<Lead | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Lead | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        lead.businessName.toLowerCase().includes(query) ||
        lead.contactName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

      const matchesContinent =
        geoFilter.continent === "all" || lead.continent === geoFilter.continent;
      const matchesSubRegion =
        geoFilter.subRegion === "all" || lead.subRegion === geoFilter.subRegion;
      const matchesCountry =
        geoFilter.countryCode === "all" || lead.countryCode === geoFilter.countryCode;

      return matchesSearch && matchesStatus && matchesContinent && matchesSubRegion && matchesCountry;
    });
  }, [leads, search, statusFilter, geoFilter]);

  const totalItems = filteredLeads.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

  const handleConfirmConvert = (values?: ConvertLeadValues) => {
    if (!convertTarget) return;
    convert(convertTarget, values);
    setConvertTarget(null);
  };

  const handleMarkLost = (lead: Lead) => {
    markLost(lead.id);
    toast.info(`${lead.businessName} marked as lost.`);
  };

  const handleConfirmRemove = () => {
    if (!removeTarget) return;
    removeLead(removeTarget.id);
    toast.success(`${removeTarget.businessName} removed from the pipeline.`);
    setRemoveTarget(null);
  };

  return (
    <div className="space-y-6">
      <ConvertLeadDialog
        lead={convertTarget}
        onClose={() => setConvertTarget(null)}
        onConfirm={handleConfirmConvert}
      />
      <RemoveLeadDialog
        lead={removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemove}
      />
      <AddLeadDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        isSubmitting={isCreating}
        onCreate={(values) => {
          // POSTs to /admin/leads; the dialog closes only once the server has
          // accepted it, and the toast comes from the mutation rather than
          // being fired optimistically.
          addLead(values, { onSuccess: () => setAddOpen(false) });
        }}
      />

      {/* Top Section Grid: Title + Status Pills on Left, Map Selector at Top Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Leads Pipeline</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track and convert potential tenant leads across operating regions.
              </p>
            </div>
            <Button className="gap-1.5 shrink-0" onClick={() => setAddOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setStatusFilter(option.value);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  statusFilter === option.value
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newFilter) => {
              setGeoFilter(newFilter);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Search Bar row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads by business, contact, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {paginatedLeads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No leads match these filters.</p>
          </CardContent>
        </Card>
      ) : (
        <LeadTable
          leads={paginatedLeads}
          onConvert={setConvertTarget}
          onMarkLost={handleMarkLost}
          onRemove={setRemoveTarget}
        />
      )}

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
