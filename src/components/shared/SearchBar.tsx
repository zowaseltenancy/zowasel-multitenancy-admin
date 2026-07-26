"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Props {
  value: string;

  onChange: (value: string) => void;

  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="relative max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
