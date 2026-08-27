"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sprout, Store, CreditCard, Layers, ArrowLeft, Filter } from "lucide-react";
import { useSubscriptions } from "../hooks/useSubscriptions";
import SubscriptionGrid from "./SubscriptionGrid";
import SearchBar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { SubscriptionStatus } from "@/types/subscription";
import { GeographicFilterState } from "@/types/geo";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

export type SubscriptionStatusFilter = SubscriptionStatus | "all";

interface Props {
  title: string;
  description: string;
  statusFilter: SubscriptionStatusFilter;
}

const PRODUCT_TABS = [
  { key: "all", label: "All Platforms", icon: Layers },
  { key: "croppilot", label: "CropPilot", icon: Sprout },
  { key: "marketplace", label: "Marketplace", icon: Store },
  { key: "acess", label: "ACESS", icon: CreditCard },
] as const;

function SubscriptionsListViewContent({
  title,
  description,
  statusFilter,
}: Props) {
  const searchParams = useSearchParams();
  const initialProduct = searchParams?.get("product") || "all";

  const { subscriptions } = useSubscriptions();
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProduct);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activeTab, setActiveTab] = useState<SubscriptionStatusFilter>(statusFilter);

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  useEffect(() => {
    const p = searchParams?.get("product");
    if (p) {
      setSelectedProduct(p);
    }
  }, [searchParams]);

  // Product-filtered subset for counts
  const productScopedSubscriptions = useMemo(() => {
    if (selectedProduct === "all") return subscriptions;
    return subscriptions.filter((s) => {
      if (s.productId) return s.productId === selectedProduct;
      const lower = s.product.toLowerCase();
      if (selectedProduct === "croppilot") return lower.includes("crop") || lower.includes("carbon");
      if (selectedProduct === "marketplace") return lower.includes("market") || lower.includes("trade");
      if (selectedProduct === "acess") return lower.includes("acess") || lower.includes("credit");
      return true;
    });
  }, [subscriptions, selectedProduct]);

  const activeCount = productScopedSubscriptions.filter((s) => s.status === "Active").length;
  const trialCount = productScopedSubscriptions.filter((s) => s.status === "Trial").length;
  const pastDueCount = productScopedSubscriptions.filter((s) => s.status === "Past Due").length;
  const cancelledCount = productScopedSubscriptions.filter((s) => s.status === "Cancelled").length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return productScopedSubscriptions.filter((sub) => {
      const matchesStatus =
        activeTab === "all" || sub.status.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        sub.organization.toLowerCase().includes(query) ||
        sub.product.toLowerCase().includes(query);

      // Geographic Region Filter matching
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
  }, [productScopedSubscriptions, activeTab, search, geoFilter]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const STATUS_TABS = [
    { key: "all", label: "All Statuses", count: productScopedSubscriptions.length },
    { key: "Active", label: "Active", count: activeCount },
    { key: "Trial", label: "Trial", count: trialCount },
    { key: "Past Due", label: "Past Due", count: pastDueCount },
    { key: "Cancelled", label: "Cancelled", count: cancelledCount },
  ] as const;

  const currentProductLabel = PRODUCT_TABS.find((p) => p.key === selectedProduct)?.label || "All Platforms";

  return (
    <div className="space-y-6">
      {/* Top Section Grid: Title + Breadcrumbs + Platform Selector + Map Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            <Link
              href="/admin/billing/subscriptions"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Subscriptions Overview
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {selectedProduct === "all" ? title : `${currentProductLabel} Subscriptions`}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              {selectedProduct === "all"
                ? description
                : `Active and historical subscriptions for the ${currentProductLabel} platform suite.`}
            </p>
          </div>

          {/* Level 1: Platform Filter Pills */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Filter className="h-3 w-3 text-primary" />
              <span>Platform Suite:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {PRODUCT_TABS.map((prod) => {
                const Icon = prod.icon;
                const isSelected = selectedProduct === prod.key;
                const prodCount =
                  prod.key === "all"
                    ? subscriptions.length
                    : subscriptions.filter((s) => {
                        if (s.productId) return s.productId === prod.key;
                        const lower = s.product.toLowerCase();
                        if (prod.key === "croppilot") return lower.includes("crop") || lower.includes("carbon");
                        if (prod.key === "marketplace") return lower.includes("market") || lower.includes("trade");
                        if (prod.key === "acess") return lower.includes("acess") || lower.includes("credit");
                        return true;
                      }).length;

                return (
                  <button
                    key={prod.key}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod.key);
                      setPage(1);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm font-bold"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{prod.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-background text-muted-foreground border"
                      }`}
                    >
                      {prodCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 2: Status Filter Tabs (Scoped to Selected Product) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab.toLowerCase() === tab.key.toLowerCase();

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key as SubscriptionStatusFilter);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-foreground text-background shadow-xs font-bold"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-background/20 text-background"
                        : "bg-background text-muted-foreground border"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
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
          placeholder="Search by business, tenant organization, or product tier..."
        />
      </div>

      {/* Subscriptions Grid & Pagination (3-column grid friendly: 3, 6, 9, 12) */}
      <section className="space-y-4">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-xs font-semibold text-muted-foreground border rounded-2xl bg-card">
            No subscriptions found matching the selected platform and status criteria.
          </div>
        ) : (
          <SubscriptionGrid subscriptions={paginated} />
        )}

        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={totalItems}
          pageSizeOptions={[3, 6, 9, 12]}
        />
      </section>
    </div>
  );
}

// useSearchParams() opts the tree into client-side rendering, which Next
// requires a Suspense boundary around — without one the production build fails
// while prerendering every page that renders this view.
export default function SubscriptionsListView(props: Parameters<typeof SubscriptionsListViewContent>[0]) {
  return (
    <Suspense fallback={null}>
      <SubscriptionsListViewContent {...props} />
    </Suspense>
  );
}
