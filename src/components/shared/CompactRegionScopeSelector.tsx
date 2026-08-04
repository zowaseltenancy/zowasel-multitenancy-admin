"use client";

import { useState } from "react";
import { Globe, MapPin, Layers, Check, ChevronDown, Search, X } from "lucide-react";
import { Continent, SubRegion, GeographicFilterState } from "@/types/geo";
import { CONTINENTS, SUB_REGIONS, GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountryFlag from "./CountryFlag";

interface Props {
  value: GeographicFilterState;
  onChange: (value: GeographicFilterState) => void;
  className?: string;
  align?: "start" | "end" | "center";
}

export default function CompactRegionScopeSelector({ value, onChange, className, align = "end" }: Props) {
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

  const selectedCountry = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === value.countryCode);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`h-9 inline-flex items-center gap-2 px-3 text-xs font-semibold rounded-xl border bg-card hover:bg-muted cursor-pointer shrink-0 transition-colors border-border ${
          value.scope !== "global" ? "border-primary text-primary bg-primary/5" : ""
        } ${className || ""}`}
      >
        {selectedCountry ? (
          <CountryFlag countryCode={selectedCountry.countryCode} countryName={selectedCountry.countryName} size="sm" />
        ) : (
          <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
        )}

        <span className="truncate max-w-[170px]">{getTriggerLabel()}</span>

        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70" />
      </PopoverTrigger>

      <PopoverContent align={align} side="bottom" sideOffset={6} className="w-[360px] p-0 shadow-2xl border-border bg-card">
        {/* Header & Quick Clear */}
        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="font-semibold text-xs text-foreground uppercase tracking-wider">Geographic Region Scope</span>
          </div>

          {value.scope !== "global" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleContinentSelect("all");
                setOpen(false);
              }}
              className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset to Global
            </Button>
          )}
        </div>

        {/* Continental Pills */}
        <div className="p-3 space-y-2 border-b border-border">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Continent</div>
          <div className="flex flex-wrap gap-1.5">
            {CONTINENTS.map((c) => {
              const isActive = value.continent === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => handleContinentSelect(c.key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="mr-1">{c.flag}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Region Selector Dropdown */}
        <div className="p-3 space-y-2 border-b border-border bg-muted/10">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Layers className="h-3 w-3 text-primary" /> Sub-Region Scope
          </div>
          <select
            value={value.subRegion}
            onChange={(e) => handleSubRegionSelect(e.target.value as SubRegion)}
            className="w-full h-8 rounded-lg border border-input bg-card px-2.5 text-xs font-medium outline-none focus-visible:border-primary cursor-pointer"
          >
            {availableSubRegions.map((sr) => (
              <option key={sr.key} value={sr.key}>
                {sr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Country Search & List */}
        <div className="p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search country or currency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-card"
            />
          </div>

          {/* Country Selection List */}
          <div className="max-h-[180px] overflow-y-auto space-y-1 pr-1">
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
                    isSelected ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
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
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
