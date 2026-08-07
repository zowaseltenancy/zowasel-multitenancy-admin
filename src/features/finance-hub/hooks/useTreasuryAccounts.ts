"use client";

import { useState } from "react";
import { mockTreasuryAccounts } from "../data/mockTreasuryAccounts";
import { useActingFinanceOfficer } from "../context/FinanceOfficerContext";
import { convertToUSD } from "../utils/currency";

// Reporting-currency (USD) figures are always a computed rollup on top of
// each account's native balance + its own FX rate — never a single blended
// number stored on its own, and never a display-only conversion toggle.
export function useTreasuryAccounts() {
  const [allAccounts, setAllAccounts] = useState(mockTreasuryAccounts);
  const { isCountryInScope } = useActingFinanceOfficer();

  const accounts = allAccounts.filter((a) => isCountryInScope(a.countryCode));

  const totalUSD = accounts.reduce((sum, a) => sum + a.nativeBalance / a.fxRateToUSD, 0);

  // Moving money between Zowasel's own accounts — distinct from reconciling
  // against an external bank statement. Restricted at the UI layer (see
  // TRANSFER_CAPABLE_LEVELS) to Continental/Global, since cross-entity
  // movement is a heavier operation than routine approval in real treasury
  // practice, not just another maker-checker tier.
  const transferBetweenAccounts = (fromId: string, toId: string, fromAmount: number) => {
    const from = allAccounts.find((a) => a.id === fromId);
    const to = allAccounts.find((a) => a.id === toId);
    if (!from || !to || fromAmount <= 0 || fromAmount > from.nativeBalance) return null;

    const usdMoved = convertToUSD(fromAmount, from.currencyCode);
    const toAmount = usdMoved * to.fxRateToUSD;

    setAllAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromId) return { ...a, nativeBalance: a.nativeBalance - fromAmount };
        if (a.id === toId) return { ...a, nativeBalance: a.nativeBalance + toAmount };
        return a;
      })
    );

    return { fromAmount, toAmount, usdMoved };
  };

  return { accounts, totalUSD, transferBetweenAccounts };
}
