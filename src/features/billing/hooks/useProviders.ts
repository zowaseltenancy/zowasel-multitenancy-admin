"use client";

import { useState } from "react";

import { mockProviders } from "../data/mockProviders";
import { Provider } from "@/types/provider";
import { CreateProviderSchema } from "@/schemas/provider.schema";

export function useProviders() {
  const [providers, setProviders] = useState(mockProviders);

  const toggleProvider = (providerId: string) => {
    setProviders((current) =>
      current.map((item) =>
        item.id === providerId
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );
  };

  const addProvider = (
    values: CreateProviderSchema
  ) => {
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

    setProviders((current) => [
      ...current,
      newProvider,
    ]);

    return newProvider;
  };

  const deleteProvider = (providerId: string) => {
    setProviders((current) =>
      current.filter(
        (item) => item.id !== providerId
      )
    );
  };

  return {
    providers,
    toggleProvider,
    addProvider,
    deleteProvider,
  };
}
