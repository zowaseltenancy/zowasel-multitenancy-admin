"use client";

import { useState, memo } from "react";
import { Globe, Check, ChevronDown, X, RefreshCw, Layers } from "lucide-react";
import { Continent, SubRegion, GeographicFilterState } from "@/types/geo";
import { CONTINENTS, SUB_REGIONS, GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountryFlag from "./CountryFlag";
import InteractiveWorldMapOverlay from "./InteractiveWorldMapOverlay";

interface Props {
  value: GeographicFilterState;
  onChange: (value: GeographicFilterState) => void;
  className?: string;
  align?: "start" | "end" | "center";
}

function CompactRegionScopeSelector({ value, onChange, className, align = "end" }: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleContinentSelect = (continent: Continent) => {
    onChange({
      ...value,
      continent,
      subRegion: "all",
      countryCode: "all",
      scope: continent === "all" ? "global" : "continental",
    });
  };

  const handleSubRegionSelect = (subRegion: SubRegion) => {
    onChange({
      ...value,
      subRegion,
      countryCode: "all",
      scope: subRegion === "all" ? (value.continent === "all" ? "global" : "continental") : "regional",
    });
  };

  const handleCountrySelect = (countryCode: string) => {
    onChange({
      ...value,
      countryCode,
      scope: countryCode === "all" ? (value.subRegion === "all" ? "continental" : "regional") : "country",
    });
    setOpen(false);
  };

  const availableSubRegions = SUB_REGIONS[value.continent] || SUB_REGIONS.all;

  const filteredCountries = GLOBAL_COUNTRY_CURRENCIES.filter((c) => {
    const matchesContinent = value.continent === "all" || c.continent === value.continent;
    const matchesSubRegion = value.subRegion === "all" || c.subRegion === value.subRegion;
    const matchesQuery =
      searchQuery.trim() === "" ||
      c.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.countryCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesContinent && matchesSubRegion && matchesQuery;
  });

  // Active Label Calculation for Trigger Button
  const getTriggerLabel = () => {
    if (value.countryCode !== "all") {
      const country = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === value.countryCode);
      if (country) return `${country.countryName} (${country.currencyCode})`;
    }

    if (value.subRegion !== "all") {
      const sub = availableSubRegions.find((s) => s.key === value.subRegion);
      if (sub) return sub.label;
    }

    if (value.continent !== "all") {
      const cont = CONTINENTS.find((c) => c.key === value.continent);
      if (cont) return `${cont.label} Scope`;
    }

    return "Global (All Regions)";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Map Trigger Card with 100% unobscured map view and label bar placed cleanly below */}
      <PopoverTrigger
        title={`Geographic Scope: ${getTriggerLabel()} - Click to filter`}
        aria-label={`Geographic Scope: ${getTriggerLabel()}`}
        className={`group relative w-full sm:max-w-[420px] shrink-0 inline-flex flex-col rounded-2xl border bg-card hover:border-primary/80 cursor-pointer overflow-hidden transition-colors shadow-md hover:shadow-xl ${
          value.scope !== "global"
            ? "border-primary/80 ring-2 ring-primary/20"
            : "border-border/80"
        } ${className || ""}`}
      >
        {/* 1. Full 2D Vector Map Canvas (100% unobscured, zero overlay covering top of map) */}
        <div className="relative w-full aspect-[2/1] overflow-hidden bg-slate-100 dark:bg-[#090d16] [contain:strict]">
          <InteractiveWorldMapOverlay
            value={value}
            mode="trigger"
            showLegend={false}
            className="h-full w-full border-0 shadow-none rounded-none"
          />
        </div>

        {/* 2. Scope Label Bar placed OUTSIDE & BELOW the map */}
        <div className="p-3 bg-card border-t border-border/80 flex items-center justify-between w-full transition-colors group-hover:bg-muted/30">
          <div className="flex items-center gap-2.5 truncate">
            <div className="relative flex items-center justify-center shrink-0">
              <Globe className={`h-4 w-4 transition-colors ${value.scope !== "global" ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              {value.scope !== "global" && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              )}
            </div>

            <div className="flex flex-col text-left truncate">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80 leading-none">
                Region Scope
              </span>
              <span className="text-xs font-extrabold truncate text-foreground mt-0.5">
                {getTriggerLabel()}
              </span>
            </div>
          </div>

          {/* Status Indicators & Chevron */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="flex items-center gap-1">
              {value.continent !== "all" && <span title="Continent Active" className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />}
              {value.subRegion !== "all" && <span title="Sub-Region Active" className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />}
              {value.countryCode !== "all" && <span title="Country Active" className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b] animate-pulse" />}
            </div>
            <span className="text-[10px] font-bold text-primary group-hover:underline hidden sm:inline">
              Filter →
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </div>
      </PopoverTrigger>

      {/* Popover Content Menu (Ultra-Fast 0ms Instant Load! No map rendered inside popover) */}
      <PopoverContent
        align={align}
        side="bottom"
        sideOffset={8}
        collisionAvoidance={{ side: "none" }}
        className="w-[380px] p-0 shadow-2xl border-border bg-card overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-semibold text-xs text-foreground uppercase tracking-wider">Scope Filter Options</span>
          </div>

          {value.scope !== "global" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleContinentSelect("all");
                setOpen(false);
              }}
              className="h-7 px-2 text-[10px] font-semibold text-primary hover:bg-primary/10 cursor-pointer gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset to Global</span>
            </Button>
          )}
        </div>

        {/* Continent Filter Pills */}
        <div className="p-3 space-y-2 border-b border-border">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Continent Filter</div>
          <div className="flex flex-wrap gap-1.5">
            {CONTINENTS.map((c) => {
              const isActive = value.continent === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => handleContinentSelect(c.key)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="mr-1">{c.flag}</span>
                  <span>{c.label.split(" (")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Region Selector */}
        {availableSubRegions.length > 1 && (
          <div className="p-3 space-y-2 border-b border-border">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sub-Region Filter</div>
            <div className="flex flex-wrap gap-1">
              {availableSubRegions.map((sub) => {
                const isActive = value.subRegion === sub.key;
                return (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => handleSubRegionSelect(sub.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/40"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {sub.label.split(" (")[0]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Country Search & Select List */}
        <div className="p-3 space-y-2">
          <div className="relative">
            <Input
              placeholder="Search country or currency code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs pl-2.5 pr-7 bg-muted/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-[220px] overflow-y-auto space-y-0.5 pr-1">
            <button
              type="button"
              onClick={() => handleCountrySelect("all")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                value.countryCode === "all" ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span>All Countries in Scope ({filteredCountries.length})</span>
              </div>
              {value.countryCode === "all" && <Check className="h-3.5 w-3.5" />}
            </button>

            {filteredCountries.map((c) => {
              const isSelected = value.countryCode === c.countryCode;
              return (
                <button
                  key={c.countryCode}
                  type="button"
                  onClick={() => handleCountrySelect(c.countryCode)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30" : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CountryFlag countryCode={c.countryCode} countryName={c.countryName} size="sm" />
                    <span className="truncate">{c.countryName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({c.currencyCode})</span>
                    {c.papssSupported && (
                      <span className="text-[9px] px-1 bg-emerald-500/10 text-emerald-600 rounded font-semibold">PAPSS</span>
                    )}
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default memo(CompactRegionScopeSelector);
