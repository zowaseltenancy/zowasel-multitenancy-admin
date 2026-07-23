"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const current =
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace("-", " ") ?? "Dashboard";

  return (
    <div>
      <h1 className="text-2xl font-bold capitalize text-foreground">
        {current}
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Manage {current.toLowerCase()}.
      </p>
    </div>
  );
}