import { mockSettlements } from "../data/mockSettlements";
import { Settlement } from "@/types/settlement";

export const settlementService = {
  getSettlements(): Settlement[] {
    return mockSettlements;
  },

  getSettlementById(
    id: string
  ): Settlement | undefined {
    return mockSettlements.find(
      (settlement) => settlement.id === id
    );
  },
};
