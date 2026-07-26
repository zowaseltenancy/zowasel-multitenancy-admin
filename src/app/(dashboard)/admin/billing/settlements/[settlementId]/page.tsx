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
import { settlementService } from "@/features/billing/services/settlement.service";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";

interface Props {
  params: Promise<{
    settlementId: string;
  }>;
}

export default async function SettlementDetailsPage({
  params,
}: Props) {
  const { settlementId } = await params;

  const settlement =
    settlementService.getSettlementById(
      settlementId
    );

  if (!settlement) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/billing/settlements"
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

        <SettlementStatusBadge
          status={settlement.status}
        />
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
