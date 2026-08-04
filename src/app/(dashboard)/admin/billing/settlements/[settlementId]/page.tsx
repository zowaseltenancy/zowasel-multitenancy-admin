import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SettlementStatusBadge from "@/features/billing/components/SettlementStatusBadge";
import ExportMenu from "@/components/shared/ExportMenu";
import { settlementService } from "@/features/billing/services/settlement.service";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { ExportTable } from "@/lib/export";

interface Props {
  params: Promise<{
    settlementId: string;
  }>;
}

export default async function SettlementDetailsPage({
  params,
}: Props) {
  const { settlementId } = await params;

  const settlement = settlementService.getSettlementById(settlementId);

  if (!settlement) {
    notFound();
  }

  const exportTableData: ExportTable = {
    title: `Settlement Record - ${settlement.settlementNumber}`,
    headers: ["Field", "Value"],
    rows: [
      ["Settlement Number", settlement.settlementNumber],
      ["Organization", settlement.organization],
      ["Entity Type", ORGANIZATION_TYPE_LABELS[settlement.entityType]],
      ["Amount", `${settlement.currency} ${settlement.amount.toLocaleString()}`],
      ["Payout Method", settlement.payoutMethod],
      ["Provider", settlement.provider],
      ["Status", settlement.status],
      ["Scheduled At", new Date(settlement.scheduledAt).toLocaleDateString()],
      ["Completed At", settlement.completedAt ? new Date(settlement.completedAt).toLocaleDateString() : "Pending"],
    ],
  };

  return (
    <div className="space-y-6" id="settlement-detail-capture">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/billing/settlements/all"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settlements
          </Link>

          <h1 className="text-3xl font-semibold">
            {settlement.settlementNumber}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {settlement.organization}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportMenu
            table={exportTableData}
            captureElementId="settlement-detail-capture"
          />
          <SettlementStatusBadge status={settlement.status} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Settlement Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Entity Type
            </p>
            <p className="mt-2 font-medium">
              {
                ORGANIZATION_TYPE_LABELS[
                  settlement.entityType
                ]
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Amount
            </p>
            <p className="mt-2 font-medium">
              {settlement.currency}{" "}
              {settlement.amount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Payout Method
            </p>
            <p className="mt-2 font-medium">
              {settlement.payoutMethod}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Provider
            </p>
            <p className="mt-2 font-medium">
              {settlement.provider}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Scheduled
            </p>
            <p className="mt-2 font-medium">
              {new Date(
                settlement.scheduledAt
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Completed
            </p>
            <p className="mt-2 font-medium">
              {settlement.completedAt
                ? new Date(
                    settlement.completedAt
                  ).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
