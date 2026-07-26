import { Settlement } from "@/types/settlement";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { ExportTable } from "@/lib/export";

export function toSettlementExportTable(
  settlements: Settlement[],
  title = "Settlements"
): ExportTable {
  return {
    title,
    headers: [
      "Settlement",
      "Organization",
      "Entity Type",
      "Amount",
      "Currency",
      "Payout Method",
      "Provider",
      "Status",
      "Scheduled",
      "Completed",
    ],
    rows: settlements.map((settlement) => [
      settlement.settlementNumber,
      settlement.organization,
      ORGANIZATION_TYPE_LABELS[settlement.entityType],
      settlement.amount,
      settlement.currency,
      settlement.payoutMethod,
      settlement.provider,
      settlement.status,
      new Date(
        settlement.scheduledAt
      ).toLocaleDateString(),
      settlement.completedAt
        ? new Date(
            settlement.completedAt
          ).toLocaleDateString()
        : "—",
    ]),
  };
}
