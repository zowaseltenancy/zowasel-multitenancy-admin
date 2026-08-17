"use client";

import { ProvidersProvider } from "@/features/billing/context/ProvidersContext";

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return <ProvidersProvider>{children}</ProvidersProvider>;
}
