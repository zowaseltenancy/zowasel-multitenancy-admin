"use client";

import { useMemo, useState, useCallback, memo } from "react";
import { Continent, SubRegion, GeographicFilterState } from "@/types/geo";
import { GLOBAL_COUNTRY_CURRENCIES, CONTINENTS } from "@/data/geoData";
import worldIsoDataRaw from "@/data/worldIsoPaths.json";

interface WorldPathItem {
  iso2: string;
  iso3?: string;
  name: string;
  d: string;
}

const WORLD_ISO_PATHS = worldIsoDataRaw as WorldPathItem[];

interface InteractiveWorldMapOverlayProps {
  value: GeographicFilterState;
  onSelectCountry?: (countryCode: string) => void;
  onSelectSubRegion?: (subRegion: SubRegion) => void;
  onSelectContinent?: (continent: Continent) => void;
  className?: string;
  showLegend?: boolean;
  mode?: "trigger" | "compact" | "expanded";
}

// Pre-indexed map for instant O(1) metadata lookup
const METADATA_MAP = new Map<string, (typeof GLOBAL_COUNTRY_CURRENCIES)[0]>();
GLOBAL_COUNTRY_CURRENCIES.forEach((c) => {
  METADATA_MAP.set(c.countryCode, c);
});

// Ultra-fast Memoized Country Path Component
const MemoizedCountryPath = memo(function CountryPath({
  item,
  isContinentMatch,
  isSubRegionMatch,
  isCountryMatch,
  isHovered,
  isTriggerMode,
  onHover,
  onLeave,
  onClick,
}: {
  item: WorldPathItem;
  isContinentMatch: boolean;
  isSubRegionMatch: boolean;
  isCountryMatch: boolean;
  isHovered: boolean;
  isTriggerMode: boolean;
  onHover?: (iso2: string, name: string) => void;
  onLeave?: () => void;
  onClick?: (iso2: string) => void;
}) {
  let stroke = "rgba(148, 163, 184, 0.45)";
  let strokeWidth = 0.5;
  let filter = "";
  let fillClass = "fill-slate-200/90 dark:fill-slate-800/90";

  if (isContinentMatch) {
    fillClass = "fill-blue-500/40 dark:fill-blue-500/50";
    stroke = "#3b82f6";
    strokeWidth = 1.2;
  }

  if (isSubRegionMatch) {
    fillClass = "fill-emerald-500/60 dark:fill-emerald-500/70";
    stroke = "#10b981";
    strokeWidth = 1.6;
    if (!isTriggerMode) filter = "url(#green-glow-opt)";
  }

  if (isCountryMatch) {
    fillClass = "fill-amber-500/90 dark:fill-amber-500/95";
    stroke = "#f59e0b";
    strokeWidth = 2.4;
    if (!isTriggerMode) filter = "url(#gold-glow-opt)";
  }

  return (
    <path
      d={item.d}
      stroke={isHovered ? "#3b82f6" : stroke}
      strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      filter={filter}
      className={`${fillClass} ${!isTriggerMode ? "transition-colors duration-75" : ""} ${isHovered ? "fill-primary/60" : ""}`}
      onMouseEnter={!isTriggerMode && onHover ? () => onHover(item.iso2, item.name) : undefined}
      onMouseLeave={!isTriggerMode && onLeave ? onLeave : undefined}
      onClick={!isTriggerMode && onClick ? () => onClick(item.iso2) : undefined}
    />
  );
});

// Entire Memoized Paths Layer (Zero React Reconciliation during container layout changes)
const MemoizedSvgPathsGroup = memo(function SvgPathsGroup({
  continent,
  subRegion,
  countryCode,
  hoveredIso2,
  isTriggerMode,
  onHover,
  onLeave,
  onClick,
}: {
  continent: string;
  subRegion: string;
  countryCode: string;
  hoveredIso2: string | undefined;
  isTriggerMode: boolean;
  onHover?: (iso2: string, name: string) => void;
  onLeave?: () => void;
  onClick?: (iso2: string) => void;
}) {
  return (
    <g id="world-map-paths-group">
      {WORLD_ISO_PATHS.map((item, index) => {
        const meta = METADATA_MAP.get(item.iso2);
        const isContinentMatch = continent !== "all" && meta?.continent === continent;
        const isSubRegionMatch = subRegion !== "all" && meta?.subRegion === subRegion;
        const isCountryMatch = countryCode !== "all" && item.iso2 === countryCode;
        const isHovered = hoveredIso2 === item.iso2;

        return (
          <MemoizedCountryPath
            key={`${item.iso2}-${index}`}
            item={item}
            isContinentMatch={isContinentMatch}
            isSubRegionMatch={isSubRegionMatch}
            isCountryMatch={isCountryMatch}
            isHovered={isHovered}
            isTriggerMode={isTriggerMode}
            onHover={onHover}
            onLeave={onLeave}
            onClick={onClick}
          />
        );
      })}
    </g>
  );
});

function InteractiveWorldMapOverlay({
  value,
  onSelectCountry,
  onSelectSubRegion,
  onSelectContinent,
  className = "",
  showLegend = true,
  mode = "compact",
}: InteractiveWorldMapOverlayProps) {
  const [hoveredCountry, setHoveredCountry] = useState<{ iso2: string; name: string; continent?: string; subRegion?: string } | null>(null);

  const TIER_COLORS = {
    continent: {
      label: "Continent Highlight",
      badgeBg: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40",
    },
    subRegion: {
      label: "Sub-Region Highlight",
      badgeBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40",
    },
    country: {
      label: "Selected Country Highlight",
      badgeBg: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40",
    },
  };

  const selectedCountryInfo = useMemo(() => {
    return GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === value.countryCode);
  }, [value.countryCode]);

  const handleHover = useCallback((iso2: string, name: string) => {
    const meta = METADATA_MAP.get(iso2);
    setHoveredCountry({
      iso2,
      name,
      continent: meta?.continent,
      subRegion: meta?.subRegion,
    });
  }, []);

  const handleLeave = useCallback(() => {
    setHoveredCountry(null);
  }, []);

  const handleClick = useCallback((iso2: string) => {
    const meta = METADATA_MAP.get(iso2);
    if (meta) {
      if (onSelectCountry) onSelectCountry(meta.countryCode);
      if (onSelectSubRegion) onSelectSubRegion(meta.subRegion);
      if (onSelectContinent) onSelectContinent(meta.continent);
    }
  }, [onSelectCountry, onSelectSubRegion, onSelectContinent]);

  const heightClass =
    mode === "trigger"
      ? "h-full w-full"
      : mode === "compact"
      ? "h-44 sm:h-48"
      : "h-72 sm:h-80";

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-border/60 bg-slate-100 dark:bg-[#090d16] shadow-xs transition-colors transform-gpu [contain:paint_layout] ${className}`}>
      {/* 2:1 Projection Vector Canvas */}
      <div className={`relative w-full overflow-hidden ${heightClass}`}>
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full cursor-pointer select-none"
          shapeRendering={mode === "trigger" ? "optimizeSpeed" : "geometricPrecision"}
        >
          {mode !== "trigger" && (
            <defs>
              <filter id="gold-glow-opt" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="green-glow-opt" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          )}

          {/* Ocean Backdrop */}
          <rect width="1000" height="500" className="fill-slate-100 dark:fill-[#090d16] transition-colors" />

          {/* Render Ultra-Fast Memoized SVG Paths Group */}
          <MemoizedSvgPathsGroup
            continent={value.continent}
            subRegion={value.subRegion}
            countryCode={value.countryCode}
            hoveredIso2={hoveredCountry?.iso2}
            isTriggerMode={mode === "trigger"}
            onHover={handleHover}
            onLeave={handleLeave}
            onClick={handleClick}
          />
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredCountry && mode !== "trigger" && (
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 rounded-lg bg-popover/95 px-2.5 py-1 backdrop-blur border border-border text-xs shadow-xl animate-in fade-in zoom-in-95 pointer-events-none">
            <span className="font-bold text-foreground text-[11px]">{hoveredCountry.name}</span>
            <span className="text-[10px] text-muted-foreground font-mono">({hoveredCountry.iso2})</span>
            {hoveredCountry.subRegion && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium uppercase tracking-wider">
                {hoveredCountry.subRegion.replace("_", " ")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Interactive 3-Tier Legend Bar */}
      {showLegend && mode !== "trigger" && (
        <div className="p-2.5 bg-card border-t border-border text-xs flex flex-wrap items-center justify-between gap-1.5 transition-colors">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Color 1: Continent */}
            <div
              onClick={() => onSelectContinent && onSelectContinent(value.continent)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                value.continent !== "all"
                  ? TIER_COLORS.continent.badgeBg
                  : "bg-muted/50 text-muted-foreground border-border"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
              <span>
                Continent:{" "}
                {value.continent === "all"
                  ? "Global"
                  : CONTINENTS.find((c) => c.key === value.continent)?.label.split(" (")[0]}
              </span>
            </div>

            {/* Color 2: Sub-Region */}
            <div
              onClick={() => onSelectSubRegion && onSelectSubRegion(value.subRegion)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                value.subRegion !== "all"
                  ? TIER_COLORS.subRegion.badgeBg
                  : "bg-muted/50 text-muted-foreground border-border"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <span>
                Sub-Region:{" "}
                {value.subRegion === "all"
                  ? "All"
                  : value.subRegion.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </div>

            {/* Color 3: Country */}
            <div
              onClick={() => onSelectCountry && onSelectCountry(value.countryCode)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                value.countryCode !== "all"
                  ? TIER_COLORS.country.badgeBg
                  : "bg-muted/50 text-muted-foreground border-border"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
              <span>
                Country: {selectedCountryInfo ? selectedCountryInfo.countryName : "All Scope"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(InteractiveWorldMapOverlay);
