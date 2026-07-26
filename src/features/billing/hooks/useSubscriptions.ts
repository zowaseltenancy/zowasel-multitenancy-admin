"use client";

import { useState } from "react";

import { mockSubscriptions } from "../data/mockSubscriptions";

export function useSubscriptions() {
  const [subscriptions] = useState(mockSubscriptions);

  return {
    subscriptions,
  };
}
