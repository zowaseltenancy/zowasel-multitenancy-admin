"use client";

import { useState } from "react";

import { mockProviders } from "../data/mockProviders";

export function useProviders() {
  const [providers, setProviders] = useState(mockProviders);

  const activateProvider = (providerId: string) => {
    setProviders((current) => {
      const provider = current.find(
        (item) => item.id === providerId
      );

      if (!provider) return current;

      return current.map((item) => {
        if (item.category !== provider.category) {
          return item;
        }

        return {
          ...item,
          isActive: item.id === providerId,
        };
      });
    });
  };

  return {
    providers,
    activateProvider,
  };
}