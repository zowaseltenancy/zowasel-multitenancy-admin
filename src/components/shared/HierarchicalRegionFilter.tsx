"use client";

import { useState } from "react";
import { Globe, MapPin, Layers, Sparkles } from "lucide-react";
import { Continent, SubRegion, GeographicFilterState } from "@/types/geo";
import { CONTINENTS, SUB_REGIONS, GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

interface Props {
  value: GeographicFilterState;
  onChange: (value: GeographicFilterState) => void;
  className?: string;
}

export default function HierarchicalRegionFilter({ value, onChange, className }: Props) {
  const handleContinentChange = (continent: Continent) => {
    onChange({
      ...value,
      continent,
      subRegion: "all",
      countryCode: "all",
      scope: continent === "all" ? "global" : "continental",
    });
  };

  const handleSubRegionChange = (subRegion: SubRegion) => {
    onChange({
      ...value,
      subRegion,
      countryCode: "all",
      scope: subRegion === "all" ? (value.continent === "all" ? "global" : "continental") : "regional",
    });
  };

  const handleCountryChange = (countryCode: string) => {
    onChange({
      ...value,
      countryCode,
      scope: countryCode === "all" ? (value.subRegion === "all" ? "continental" : "regional") : "country",
    });
  };

  const availableSubRegions = SUB_REGIONS[value.continent] || SUB_REGIONS.all;

  const availableCountries = GLOBAL_COUNTRY_CURRENCIES.filter((c) => {
    const matchesContinent = value.continent === "all" || c.continent === value.continent;
    const matchesSubRegion = value.subRegion === "all" || c.subRegion === value.subRegion;
    return matchesContinent && matchesSubRegion;
  });

  return (
    <div className={`p-4 rounded-2xl border border-border bg-card shadow-sm space-y-4 ${className || ""}`}>
      {/* Tier 1: Continent Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-primary" /> 1. Continental Scope
          </label>
          <span className="text-xs text-muted-foreground font-medium">
            {availableCountries.length} countries mapped
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CONTINENTS.map((c) => {
            const isActive = value.continent === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => handleContinentChange(c.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 2 & Tier 3: Sub-Region & Country Cascading Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border">
        {/* Sub-Region Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-primary" /> 2. Sub-Region / PAPSS Network
          </label>
          <select
            value={value.subRegion}
            onChange={(e) => handleSubRegionChange(e.target.value as SubRegion)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium outline-none focus-visible:border-primary"
          >
            {availableSubRegions.map((sr) => (
              <option key={sr.key} value={sr.key}>
                {sr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Country Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" /> 3. Country & Currency
          </label>
          <select
            value={value.countryCode}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium outline-none focus-visible:border-primary"
          >
            <option value="all">All Mapped Countries ({availableCountries.length})</option>
            {availableCountries.map((c) => (
              <option key={c.countryCode} value={c.countryCode}>
                {c.flag} {c.countryName} ({c.currencyCode} {c.currencySymbol}) {c.papssSupported ? "• PAPSS" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Scope Summary Chip */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-semibold text-foreground capitalize">
            Filter Scope: {value.scope.toUpperCase()}
          </span>
          <span>•</span>
          <span>
            {value.continent.toUpperCase()} / {value.subRegion.replace("_", " ").toUpperCase()}
          </span>
        </div>
        {value.subRegion === "caribbean" && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-[10px]">
            ⚡ PAPSS Caribbean Network Active
          </span>
        )}
      </div>
    </div>
  );
}
