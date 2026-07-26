"use client";

import { useState } from "react";

import { mockCurrencies } from "../data/mockCurrencies";

export function useCurrencies() {
  const [currencies] = useState(mockCurrencies);

  const [markupPercentage, setMarkupPercentage] =
    useState(1.5);

  return {
    currencies,
    markupPercentage,
    setMarkupPercentage,
  };
}
