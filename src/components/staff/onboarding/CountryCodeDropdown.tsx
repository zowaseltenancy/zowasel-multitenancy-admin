'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { COUNTRY_DIAL_CODES } from './onboardingConstants';

export interface CountryCodeDropdownProps {
  value: string;
  onChange: (code: string) => void;
}

export function CountryCodeDropdown({ value, onChange }: CountryCodeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => {
    return COUNTRY_DIAL_CODES.find((c) => c.code === value) || COUNTRY_DIAL_CODES[0];
  }, [value]);

  const filtered = useMemo(() => {
    if (!search) return COUNTRY_DIAL_CODES;
    const s = search.toLowerCase();
    return COUNTRY_DIAL_CODES.filter(
      (c) =>
        c.country.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s)
    );
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-11 px-3 sm:px-3.5 flex items-center gap-2 border border-border/80 rounded-xl bg-background hover:bg-muted/50 text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#44883C]"
        title="Select Country Code"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-mono text-sm">{selected.code}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180 text-[#44883C]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-64 max-h-56 overflow-hidden bg-popover text-popover-foreground border border-border/80 rounded-xl shadow-lg animate-in fade-in-50 zoom-in-95 duration-150 flex flex-col">
          <div className="p-1.5 border-b border-border/60 bg-popover">
            <div className="relative flex items-center">
              <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="h-7 text-xs pl-7 bg-background"
                autoFocus
              />
            </div>
          </div>
          <div className="p-1 overflow-y-auto max-h-44">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <button
                  key={`${c.country}-${c.code}`}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    c.code === selected.code && c.country === selected.country
                      ? 'bg-[#44883C]/10 text-[#44883C] font-bold'
                      : 'hover:bg-muted text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm leading-none">{c.flag}</span>
                    <span className="truncate">{c.country}</span>
                  </div>
                  <span className="font-mono text-muted-foreground text-[11px] shrink-0 ml-2">
                    {c.code}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-muted-foreground italic">No matching country code</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
