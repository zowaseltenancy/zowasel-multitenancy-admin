"use client";

import { useState } from "react";

interface Props {
  countryCode: string;
  countryName?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function CountryFlag({
  countryCode,
  countryName = "",
  className = "",
  size = "md",
}: Props) {
  const [error, setError] = useState(false);

  const code = countryCode ? countryCode.toLowerCase() : "";
  const flagUrl = `https://flagcdn.com/w80/${code}.png`;

  const sizeClasses = {
    sm: "h-3.5 w-5 rounded-[2px]",
    md: "h-4.5 w-6 rounded shadow-xs",
    lg: "h-6 w-9 rounded shadow-sm",
    xl: "h-10 w-16 rounded-md shadow-md",
  };

  if (error || !countryCode) {
    return (
      <span className={`inline-flex items-center justify-center font-bold text-[10px] bg-muted text-muted-foreground uppercase px-1 rounded ${className}`}>
        {countryCode}
      </span>
    );
  }

  return (
    <img
      src={flagUrl}
      alt={countryName || countryCode}
      onError={() => setError(true)}
      className={`object-cover border border-black/10 shrink-0 ${sizeClasses[size]} ${className}`}
      loading="lazy"
    />
  );
}
