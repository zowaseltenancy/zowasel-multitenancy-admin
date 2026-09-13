"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import KybStatusBadge from "@/components/shared/KybStatusBadge";
import { KYB_DOCUMENT_LABELS } from "@/constants/kyb";
import { Organization } from "@/types/organization";

import KybRejectDialog from "./KybRejectDialog";

interface Props {
  organization: Organization;

  onApprove: (organizationId: string) => void;

  onReject: (
    organizationId: string,
    reason: string
  ) => void;

  onMarkPending?: (organizationId: string) => void;
}

export default function OrganizationKybTab({
  organization,
  onApprove,
  onReject,
  onMarkPending,
}: Props) {
  const [rejectOpen, setRejectOpen] = useState(false);

  const isPending = organization.kybStatus === "pending";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            KYB Status
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <KybStatusBadge
                status={organization.kybStatus}
              />

              {organization.kybSubmittedAt && (
                <p className="text-sm text-muted-foreground">
                  Submitted{" "}
                  {new Date(
                    organization.kybSubmittedAt
                  ).toLocaleString()}
                </p>
              )}

              {organization.kybApprovedAt && (
                <p className="text-sm text-muted-foreground">
                  Approved{" "}
                  {new Date(
                    organization.kybApprovedAt
                  ).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {!isPending && onMarkPending && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onMarkPending(organization.id);
                    toast.success(
                      `${organization.name}'s KYB status moved to Pending.`
                    );
                  }}
                >
                  Mark as Pending
                </Button>
              )}

              {(isPending || organization.kybStatus === "approved") && (
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
              )}

              {(isPending || organization.kybStatus === "rejected" || organization.kybStatus === "not_submitted") && (
                <Button
                  onClick={() => {
                    onApprove(organization.id);
                    toast.success(
                      `${organization.name}'s KYB has been approved.`
                    );
                  }}
                >
                  Approve
                </Button>
              )}
            </div>
          </div>

          {organization.kybRejectionReason && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              <p className="font-medium">
                Rejection reason
              </p>

              <p className="mt-1">
                {organization.kybRejectionReason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Submitted Documents
          </CardTitle>
        </CardHeader>

        <CardContent>
          {organization.kybDocuments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents submitted yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {organization.kybDocuments.map(
                (document) => (
                  <div
                    key={document.id ?? `${document.type}:${document.url}`}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                      >
                        <Image
                          src={document.url}
                          alt={
                            KYB_DOCUMENT_LABELS[
                              document.type
                            ]
                          }
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </a>

                      <div>
                        <p className="font-medium">
                          {
                            KYB_DOCUMENT_LABELS[
                              document.type
                            ]
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {document.uploadedAt
                            ? `Uploaded ${new Date(
                                document.uploadedAt
                              ).toLocaleDateString()}`
                            : "Upload date not recorded"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm capitalize text-muted-foreground">
                        {document.status}
                      </span>

                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View full size
                      </a>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <KybRejectDialog
        open={rejectOpen}
        organizationName={organization.name}
        onClose={() => setRejectOpen(false)}
        onConfirm={(reason) => {
          onReject(organization.id, reason);

          toast.success(
            `${organization.name}'s KYB has been rejected.`
          );

          setRejectOpen(false);
        }}
      />
    </div>
  );
}
