import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Settlement } from "@/types/settlement";
import SettlementStatusBadge from "./SettlementStatusBadge";

interface Props {
  settlements: Settlement[];
}

export default function SettlementTable({
  settlements,
}: Props) {
  if (settlements.length === 0) {
    return (
      <Card className="flex min-h-[160px] items-center justify-center p-6 text-sm text-muted-foreground">
        No settlements match this filter.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr className="text-left">
              <th className="px-6 py-4 font-medium">Settlement</th>
              <th className="px-6 py-4 font-medium">Organization</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Payout Method</th>
              <th className="px-6 py-4 font-medium">Provider</th>
              <th className="px-6 py-4 font-medium">Scheduled</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {settlements.map((settlement) => (
              <tr
                key={settlement.id}
                className="border-b transition-colors hover:bg-muted/40"
              >
                <td className="px-6 py-4 font-medium">
                  {settlement.settlementNumber}
                </td>

                <td className="px-6 py-4">
                  {settlement.organization}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {settlement.currency}{" "}
                  {settlement.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {settlement.payoutMethod}
                </td>

                <td className="px-6 py-4">
                  {settlement.provider}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(
                    settlement.scheduledAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <SettlementStatusBadge
                    status={settlement.status}
                  />
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/billing/settlements/${settlement.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
                  >
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
