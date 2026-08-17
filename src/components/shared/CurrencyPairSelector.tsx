"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ArrowLeftRight, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WORLD_CURRENCIES, findCurrency } from "@/constants/currencies";

interface SinglePickerProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
}

function CurrencyPicker({ label, value, onChange }: SinglePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const current = findCurrency(value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WORLD_CURRENCIES;
    return WORLD_CURRENCIES.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="w-full flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs font-bold text-foreground cursor-pointer"
            >
              <span>
                {current.code} — {current.name} ({current.symbol})
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          }
        />
        <PopoverContent className="w-72 p-0" align="start">
          <div className="border-b p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search currency or code..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground">No currency matches.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold hover:bg-muted/50 cursor-pointer ${
                    c.code === value ? "bg-primary/5 text-primary" : "text-foreground"
                  }`}
                >
                  <span>
                    {c.code} — {c.name}
                  </span>
                  <span className="text-muted-foreground">{c.symbol}</span>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface Props {
  base: string;
  compare: string;
  onChange: (base: string, compare: string) => void;
}

export default function CurrencyPairSelector({ base, compare, onChange }: Props) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
      <CurrencyPicker label="Base Currency" value={base} onChange={(code) => onChange(code, compare)} />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="mb-0.5 h-9 w-9 shrink-0"
        onClick={() => onChange(compare, base)}
        title="Swap currencies"
      >
        <ArrowLeftRight className="h-4 w-4" />
      </Button>
      <CurrencyPicker label="Compare Against" value={compare} onChange={(code) => onChange(base, code)} />
    </div>
  );
}
