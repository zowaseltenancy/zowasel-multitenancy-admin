"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Globe, ArrowRight, CreditCard, ArrowUpRight, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeographicFilterState } from "@/types/geo";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import HierarchicalRegionFilter from "@/components/shared/HierarchicalRegionFilter";
import Pagination from "@/components/shared/Pagination";
import CountryFlag from "@/components/shared/CountryFlag";
import CurrencyMarkupConfig from "@/features/billing/components/CurrencyMarkupConfig";
import { useCurrencies } from "@/features/billing/hooks/useCurrencies";

export default function HierarchicalCurrencyMatrix() {
  const { markupPercentage: globalMarkup, setMarkupPercentage: setGlobalMarkup } = useCurrencies();

  const [rateMode, setRateMode] = useState<"pay_in" | "pay_out">("pay_in");

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dynamic regional markup state across sub-regions
  const [regionalMarkups, setRegionalMarkups] = useState<Record<string, number>>({
    west_africa: 2.0,
    east_africa: 2.5,
    north_africa: 1.8,
    southern_africa: 1.5,
    central_africa: 2.2,
    caribbean_papss: 2.0,
    north_america: 0.5,
    south_america: 2.0,
    central_america: 2.0,
    caribbean: 2.0,
    western_europe: 0.8,
    eastern_europe: 1.2,
    northern_europe: 0.8,
    southern_europe: 1.0,
    east_asia: 1.0,
    south_asia: 1.5,
    southeast_asia: 1.4,
    middle_east: 1.0,
    central_asia: 1.8,
    australasia: 0.8,
    pacific_islands: 2.0,
    antarctica: 0.0,
  });

  // Per-country regional markup toggle state (default: true)
  const [applyRegionalMarkup, setApplyRegionalMarkup] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    GLOBAL_COUNTRY_CURRENCIES.forEach((c) => {
      initial[c.countryCode] = c.useRegionalMarkup ?? true;
    });
    return initial;
  });

  const handleGeoFilterChange = (newFilter: GeographicFilterState) => {
    setGeoFilter(newFilter);
    setPage(1);
  };

  const handleRegionalMarkupChange = (key: string, val: number) => {
    setRegionalMarkups((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const toggleRegionalMarkup = (code: string, countryName: string) => {
    setApplyRegionalMarkup((prev) => {
      const nextState = !prev[code];
      toast.info(
        nextState
          ? `Regional markup enabled for ${countryName}`
          : `Regional markup disabled for ${countryName}`
      );
      return {
        ...prev,
        [code]: nextState,
      };
    });
  };

  const filteredCountries = GLOBAL_COUNTRY_CURRENCIES.filter((c) => {
    const matchesContinent = geoFilter.continent === "all" || c.continent === geoFilter.continent;
    const matchesSubRegion = geoFilter.subRegion === "all" || c.subRegion === geoFilter.subRegion;
    const matchesCountry = geoFilter.countryCode === "all" || c.countryCode === geoFilter.countryCode;
    return matchesContinent && matchesSubRegion && matchesCountry;
  });

  // Pagination calculation
  const totalItems = filteredCountries.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedCountries = filteredCountries.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Top Layout: Left Continental Scope Filter + Right Quick Markup Action Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Side: Continental Scope Filter */}
        <div className="lg:col-span-8">
          <HierarchicalRegionFilter value={geoFilter} onChange={handleGeoFilterChange} />
        </div>

        {/* Right Side: Quick Action Markup Buttons Card */}
        <div className="lg:col-span-4 p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Exchange Rate Markup Actions
            </div>
            <p className="text-xs text-muted-foreground">
              Set global fallback rates or configure regional markups by continent.
            </p>
          </div>

          <CurrencyMarkupConfig
            globalMarkup={globalMarkup}
            onGlobalMarkupChange={setGlobalMarkup}
            regionalMarkups={regionalMarkups}
            onRegionalMarkupChange={handleRegionalMarkupChange}
          />
        </div>
      </div>

      {/* RVE-055: Side-by-Side Pay-in / Pay-out Rate View Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setRateMode("pay_in")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            rateMode === "pay_in"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Pay-in Exchange Rates</span>
          <Badge variant="outline" className={`text-[10px] ${rateMode === "pay_in" ? "bg-white/20 text-white border-none" : "bg-background"}`}>
            Collections
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setRateMode("pay_out")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            rateMode === "pay_out"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ArrowUpRight className="h-4 w-4" />
          <span>Pay-out Exchange Rates</span>
          <Badge variant="outline" className={`text-[10px] ${rateMode === "pay_out" ? "bg-white/20 text-white border-none" : "bg-background"}`}>
            Settlements
          </Badge>
        </button>
      </div>

      {/* Hierarchical Country Currency Table */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                {rateMode === "pay_in" ? "Pay-in" : "Pay-out"} Country Rates ({filteredCountries.length})
              </CardTitle>
              <CardDescription>
                Overview of provider base rates, regional markup toggles, and final adjusted {rateMode === "pay_in" ? "pay-in" : "pay-out"} rates per country.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-3 min-w-[210px]">Country</th>
                  <th className="px-4 py-3">Official Currency</th>
                  <th className="px-4 py-3">Provider Base Rate ({rateMode === "pay_in" ? "Pay-in" : "Pay-out"})</th>
                  <th className="px-4 py-3">Individual Markup</th>
                  <th className="px-4 py-3">Regional Markup</th>
                  <th className="px-4 py-3">Adjusted Zowasel Rate</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCountries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No country currencies found matching the selected geographic filter.
                    </td>
                  </tr>
                ) : (
                  paginatedCountries.map((c) => {
                    const indMarkup = c.customMarkupPercentage ?? c.markupPercentage;
                    const isRegMarkupActive = applyRegionalMarkup[c.countryCode] ?? true;
                    // Reactively lookup regional markup from state
                    const regRate = isRegMarkupActive ? (regionalMarkups[c.subRegion] ?? 1.5) : 0;
                    const totalMarkupPercentage = indMarkup + regRate;
                    
                    // Pay-in uses standard base rate, Pay-out applies slight payout buffer factor
                    const baseRate = rateMode === "pay_in" ? c.baseRateToUSD : c.baseRateToUSD * 0.992;
                    const finalRate = baseRate * (1 + totalMarkupPercentage / 100);

                    return (
                      <tr key={c.countryCode} className="hover:bg-muted/30 transition-colors group">
                        {/* Country Cell with Subtle Gradient Flag Watermark */}
                        <td className="relative px-4 py-3.5 overflow-hidden">
                          {/* Real Flag Image gradient background watermark */}
                          <div className="absolute inset-y-0 right-0 w-3/4 pointer-events-none flex items-center justify-end pr-1 overflow-hidden opacity-20 group-hover:opacity-35 transition-opacity">
                            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/75 to-transparent z-10" />
                            <img
                              src={`https://flagcdn.com/w160/${c.countryCode.toLowerCase()}.png`}
                              alt=""
                              className="h-16 w-24 object-cover rounded filter blur-[1px] transform translate-x-4 scale-125 select-none"
                              loading="lazy"
                            />
                          </div>

                          {/* Country Label Content */}
                          <div className="relative z-20 flex items-center gap-2.5">
                            <CountryFlag countryCode={c.countryCode} countryName={c.countryName} size="md" className="rounded shadow-xs border border-border/60" />
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {c.countryName}
                                {c.isDefaultPlatformCurrency && (
                                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">{c.countryCode} • {c.subRegionName}</div>
                            </div>
                          </div>
                        </td>

                        {/* Official Currency */}
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-foreground">
                            {c.currencyCode} ({c.currencySymbol})
                          </div>
                          <div className="text-xs text-muted-foreground">{c.currencyName}</div>
                        </td>

                        {/* Base Rate */}
                        <td className="px-4 py-3.5 font-mono text-xs">
                          1 USD = {c.currencySymbol} {baseRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>

                        {/* Read-Only Individual Country Markup Display */}
                        <td className="px-4 py-3.5">
                          <Badge variant="outline" className="bg-muted font-semibold text-xs text-foreground font-mono">
                            +{indMarkup}%
                          </Badge>
                        </td>

                        {/* Optional Regional Markup Toggle */}
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => toggleRegionalMarkup(c.countryCode, c.countryName)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isRegMarkupActive
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20"
                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                            }`}
                            title="Click to toggle regional markup addition"
                          >
                            <span>{isRegMarkupActive ? `+${regRate}% Reg.` : "Ignored"}</span>
                            <Badge variant="outline" className={`text-[9px] px-1 py-0 ${isRegMarkupActive ? "bg-amber-500 text-white border-none" : "bg-muted-foreground/20"}`}>
                              {isRegMarkupActive ? "ON" : "OFF"}
                            </Badge>
                          </button>
                        </td>

                        {/* Adjusted Final Rate */}
                        <td className="px-4 py-3.5 font-bold text-primary font-mono text-xs">
                          <div className="flex flex-col">
                            <span>1 USD = {c.currencySymbol} {finalRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-[10px] text-muted-foreground font-sans font-normal">
                              (Zowasel {rateMode === "pay_in" ? "Pay-in" : "Pay-out"}: +{totalMarkupPercentage.toFixed(1)}%)
                            </span>
                          </div>
                        </td>

                        {/* View Details Action Button */}
                        <td className="px-4 py-3.5 text-right">
                          <Link href={`/admin/billing/currency/${c.countryCode.toLowerCase()}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground">
                              <span>View Details</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
        </CardContent>
      </Card>
    </div>
  );
}
