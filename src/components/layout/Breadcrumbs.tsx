"use client";

import { usePathname } from "next/navigation";

import { usePageHeaderValue } from "./PageHeaderContext";

const SEGMENT_LABELS: Record<string, string> = {
  kyb: "KYB",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { title, description } =
    usePageHeaderValue();

  const segment =
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace("-", " ") ?? "Dashboard";

  const fallbackTitle =
    SEGMENT_LABELS[segment.toLowerCase()] ??
    segment;

  const displayTitle = title ?? fallbackTitle;

  const displayDescription =
    description ??
    `Manage ${fallbackTitle.toLowerCase()}.`;

  return (
    <div>
      <h1 className="text-2xl font-bold capitalize text-foreground">
        {displayTitle}
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        {displayDescription}
      </p>
    </div>
  );
}
