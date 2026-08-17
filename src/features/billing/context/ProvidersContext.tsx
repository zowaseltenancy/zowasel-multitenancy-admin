"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { mockProviders } from "../data/mockProviders";
import { Provider } from "@/types/provider";
import { CreateProviderSchema } from "@/schemas/provider.schema";

interface ProvidersContextValue {
  providers: Provider[];
  toggleProvider: (providerId: string) => void;
  addProvider: (values: CreateProviderSchema) => Provider;
  updateProvider: (providerId: string, updates: Partial<Provider>) => void;
  deleteProvider: (providerId: string) => void;
}

const ProvidersContext = createContext<ProvidersContextValue | null>(null);

// One shared provider list, not one per page-mount — an edit made on the
// detail page used to vanish the moment you navigated back to the list,
// because each page's own `useProviders()` call held an independent
// `useState(mockProviders)` copy. This context is the single source both
// pages now read from.
export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState(mockProviders);

  const toggleProvider = (providerId: string) => {
    setProviders((current) =>
      current.map((item) => (item.id === providerId ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const addProvider = (values: CreateProviderSchema) => {
    const slug = values.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newProvider: Provider = {
      id: slug,
      name: values.name,
      slug,
      description: values.description,
      category: values.category,
      environment: values.environment,
      health: "healthy",
      isActive: false,
      credentials: {
        publicKey: values.publicKey || undefined,
        secretKey: values.secretKey || undefined,
        webhookSecret: values.webhookSecret || undefined,
        apiKey: values.apiKey || undefined,
      },
      supportedCurrencies: values.supportedCurrencies
        .split(",")
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean),
      lastHealthCheck: "just now",
      responseTime: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProviders((current) => [...current, newProvider]);
    return newProvider;
  };

  const updateProvider = (providerId: string, updates: Partial<Provider>) => {
    setProviders((current) =>
      current.map((item) =>
        item.id === providerId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const deleteProvider = (providerId: string) => {
    setProviders((current) => current.filter((item) => item.id !== providerId));
  };

  return (
    <ProvidersContext.Provider value={{ providers, toggleProvider, addProvider, updateProvider, deleteProvider }}>
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error("useProviders must be used within a ProvidersProvider");
  return ctx;
}
