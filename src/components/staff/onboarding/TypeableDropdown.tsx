'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface TypeableDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  id: string;
  error?: string;
}

export function TypeableDropdown({
  value,
  onChange,
  options,
  placeholder,
  id,
  error,
}: TypeableDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!value) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(value.toLowerCase())
    );
  }, [options, value]);

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
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          id={id}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="h-11 text-sm rounded-xl pr-10 text-slate-900 dark:text-slate-100 bg-background"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-3 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? 'rotate-180 text-[#44883C]' : ''
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-popover text-popover-foreground border border-border/80 rounded-xl shadow-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 max-h-48 overflow-y-auto">
          <div className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    value?.toLowerCase() === option.toLowerCase()
                      ? 'bg-[#00A651]/10 text-[#00A651] font-bold'
                      : 'hover:bg-muted text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>{option}</span>
                  {value?.toLowerCase() === option.toLowerCase() && (
                    <Check className="h-3.5 w-3.5 text-[#00A651]" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-muted-foreground italic">
                Press Enter or keep typing for "{value}"
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
    </div>
  );
}
