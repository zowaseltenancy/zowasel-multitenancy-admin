"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Percent, Globe, Layers, Save, Sliders, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegionalMarkupItem {
  key: string;
  name: string;
  subRegionCode: string;
  flag: string;
  markup: number;
}

interface ContinentGroup {
  continentName: string;
  flag: string;
  regions: RegionalMarkupItem[];
}

interface Props {
  globalMarkup: number;
  onGlobalMarkupChange: (val: number) => void;
  regionalMarkups: Record<string, number>;
  onRegionalMarkupChange: (key: string, val: number) => void;
}

export default function CurrencyMarkupConfig({
  globalMarkup,
  onGlobalMarkupChange,
  regionalMarkups,
  onRegionalMarkupChange,
}: Props) {
  const [globalInput, setGlobalInput] = useState(globalMarkup.toString());
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [isRegionalOpen, setIsRegionalOpen] = useState(false);

  const CONTINENT_GROUPS: ContinentGroup[] = [
    {
      continentName: "Africa (54 Countries & PAPSS Partners)",
      flag: "🌍",
      regions: [
        { key: "west_africa", name: "West Africa", subRegionCode: "16 Nations", flag: "🇳🇬", markup: regionalMarkups.west_africa ?? 2.0 },
        { key: "east_africa", name: "East Africa", subRegionCode: "16 Nations", flag: "🇰🇪", markup: regionalMarkups.east_africa ?? 2.5 },
        { key: "north_africa", name: "North Africa", subRegionCode: "6 Nations", flag: "🇪🇬", markup: regionalMarkups.north_africa ?? 1.8 },
        { key: "southern_africa", name: "Southern Africa", subRegionCode: "8 Nations", flag: "🇿🇦", markup: regionalMarkups.southern_africa ?? 1.5 },
        { key: "central_africa", name: "Central Africa", subRegionCode: "8 Nations", flag: "🇨🇲", markup: regionalMarkups.central_africa ?? 2.2 },
        { key: "caribbean_papss", name: "Caribbean (PAPSS Network)", subRegionCode: "PAPSS Partner", flag: "🇯🇲", markup: regionalMarkups.caribbean_papss ?? 2.0 },
      ],
    },
    {
      continentName: "Americas (35 Sovereign Nations)",
      flag: "🌎",
      regions: [
        { key: "north_america", name: "North America", subRegionCode: "US, CA, MX", flag: "🇺🇸", markup: regionalMarkups.north_america ?? 0.5 },
        { key: "south_america", name: "South America", subRegionCode: "12 Nations", flag: "🇧🇷", markup: regionalMarkups.south_america ?? 2.0 },
        { key: "central_america", name: "Central America", subRegionCode: "7 Nations", flag: "🇨🇷", markup: regionalMarkups.central_america ?? 2.0 },
        { key: "caribbean", name: "Caribbean Region", subRegionCode: "13 Island Nations", flag: "🇧🇸", markup: regionalMarkups.caribbean ?? 2.0 },
      ],
    },
    {
      continentName: "Europe (44 Sovereign Nations)",
      flag: "🌍",
      regions: [
        { key: "western_europe", name: "Western Europe", subRegionCode: "UK, DE, FR, CH", flag: "🇬🇧", markup: regionalMarkups.western_europe ?? 0.8 },
        { key: "eastern_europe", name: "Eastern Europe", subRegionCode: "PL, CZ, HU, UA", flag: "🇵🇱", markup: regionalMarkups.eastern_europe ?? 1.2 },
        { key: "northern_europe", name: "Northern Europe", subRegionCode: "SE, NO, DK, FI", flag: "🇸🇪", markup: regionalMarkups.northern_europe ?? 0.8 },
        { key: "southern_europe", name: "Southern Europe", subRegionCode: "ES, IT, GR, VA", flag: "🇪🇸", markup: regionalMarkups.southern_europe ?? 1.0 },
      ],
    },
    {
      continentName: "Asia (49 Sovereign Nations)",
      flag: "🌏",
      regions: [
        { key: "east_asia", name: "East Asia", subRegionCode: "CN, JP, KR, TW", flag: "🇨🇳", markup: regionalMarkups.east_asia ?? 1.0 },
        { key: "south_asia", name: "South Asia", subRegionCode: "IN, PK, BD, LK", flag: "🇮🇳", markup: regionalMarkups.south_asia ?? 1.5 },
        { key: "southeast_asia", name: "Southeast Asia", subRegionCode: "SG, ID, MY, TH", flag: "🇸🇬", markup: regionalMarkups.southeast_asia ?? 1.4 },
        { key: "middle_east", name: "Middle East / West Asia", subRegionCode: "AE, SA, QA, TR", flag: "🇦🇪", markup: regionalMarkups.middle_east ?? 1.0 },
        { key: "central_asia", name: "Central Asia", subRegionCode: "KZ, UZ, TM", flag: "🇰🇿", markup: regionalMarkups.central_asia ?? 1.8 },
      ],
    },
    {
      continentName: "Oceania & Polar Territory (15 + Antarctica 🇦🇶)",
      flag: "🇦🇶",
      regions: [
        { key: "australasia", name: "Australasia", subRegionCode: "AU, NZ", flag: "🇦🇺", markup: regionalMarkups.australasia ?? 0.8 },
        { key: "pacific_islands", name: "Pacific Islands", subRegionCode: "FJ, PG, WS, TO", flag: "🇫🇯", markup: regionalMarkups.pacific_islands ?? 2.0 },
        { key: "antarctica", name: "Antarctica Territory", subRegionCode: "AQ - USD Specie", flag: "🇦🇶", markup: regionalMarkups.antarctica ?? 0.0 },
      ],
    },
  ];

  const handleSaveGlobal = () => {
    const val = Number(globalInput);
    if (!Number.isNaN(val)) {
      onGlobalMarkupChange(val);
      toast.success(`Global fallback markup rate updated to ${val}%! Table rates updated.`);
      setIsGlobalOpen(false);
    }
  };

  const handleSaveRegion = (key: string, regionName: string, value: number) => {
    onRegionalMarkupChange(key, value);
    toast.success(`${regionName} regional markup updated to +${value}%! Table rates recalculated.`);
  };

  return (
    <div className="flex flex-col gap-2.5 w-full pt-1">
      {/* 1. Global Fallback Rate Button & Dialog */}
      <Dialog open={isGlobalOpen} onOpenChange={setIsGlobalOpen}>
        <DialogTrigger render={
          <Button variant="outline" className="w-full h-10 px-3.5 flex items-center justify-between text-xs font-semibold cursor-pointer border-border bg-card hover:bg-muted/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <span>Set Global Fallback</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-xs font-bold">
                {globalMarkup}%
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </Button>
        } />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Global Fallback Exchange Rate Markup
            </DialogTitle>
            <DialogDescription>
              Configure default exchange rate markup applied worldwide when no regional or country-specific rate override is active.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
              <label className="text-xs font-semibold text-foreground block">Global Fallback Markup Percentage</label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={globalInput}
                  onChange={(e) => setGlobalInput(e.target.value)}
                  className="pr-8 text-right font-mono font-semibold"
                />
                <Percent className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <p className="text-[11px] text-muted-foreground">Default rate applied to base interbank exchange rates.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsGlobalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveGlobal} className="gap-1 cursor-pointer">
              <Save className="h-3.5 w-3.5" /> Save Global Rate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Regional Markups Button & Modal (Grouped by Continent) */}
      <Dialog open={isRegionalOpen} onOpenChange={setIsRegionalOpen}>
        <DialogTrigger render={
          <Button className="w-full h-10 px-3.5 flex items-center justify-between text-xs font-semibold cursor-pointer shadow-xs">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 shrink-0" />
              <span>Set Regional Markups</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] opacity-80 font-normal">By Continent</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-80" />
            </div>
          </Button>
        } />
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> Regional Markups Classified By Continent
            </DialogTitle>
            <DialogDescription>
              Configure sub-region markup rates across all 5 continents. Table rates update instantly when saved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {CONTINENT_GROUPS.map((group) => (
              <div key={group.continentName} className="space-y-2.5">
                {/* Small Heading per Continent */}
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-1 border-b border-border">
                  <span>{group.flag}</span>
                  <span className="text-foreground font-semibold">{group.continentName}</span>
                </div>

                {/* Sub-Regions Grid under this Continent */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {group.regions.map((r) => {
                    const val = regionalMarkups[r.key] ?? r.markup;
                    return (
                      <div key={r.key} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-2 shadow-2xs hover:border-primary/40 transition-colors">
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            <span>{r.flag}</span>
                            <span>{r.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">{r.subRegionCode}</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="relative w-20">
                            <Input
                              type="number"
                              min={0}
                              max={20}
                              step={0.1}
                              value={val}
                              onChange={(e) => onRegionalMarkupChange(r.key, Number(e.target.value))}
                              className="pr-6 h-8 text-right text-xs font-mono font-semibold"
                            />
                            <Percent className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveRegion(r.key, r.name, val)}
                            className="h-8 px-2 text-[11px] gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Save className="h-3 w-3" /> Save
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsRegionalOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
