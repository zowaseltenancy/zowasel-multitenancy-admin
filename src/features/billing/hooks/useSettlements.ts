"use client";

import { useState } from "react";

import { mockSettlements } from "../data/mockSettlements";

export function useSettlements() {
  const [settlements] = useState(mockSettlements);

  return {
    settlements,
  };
}
