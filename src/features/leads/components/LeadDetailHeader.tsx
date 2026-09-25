"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Compass, Trash2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import LeadStatusBadge from "./LeadStatusBadge";
import { Lead } from "@/types/lead";
import { Convertibility } from "../utils/convertibility";
import { LEAD_INTENDED_TYPE_LABELS, LEAD_SOURCE_LABELS } from "@/constants/lead";

interface Props {
  lead: Lead;
  canAct: boolean;
  /**
   * Whether this lead can actually be converted, and if not, why — the same
   * verdict the pipeline table and the server apply. See convertibilityOf.
   */
  convertibility: Convertibility;
  onConvert: () => void;
  onMarkLost: () => void;
  onRemove: () => void;
}

export default function LeadDetailHeader({
  lead,
  canAct,
  convertibility,
  onConvert,
  onMarkLost,
  onRemove,
}: Props) {
  return (
    <div>
      <Link
        href="/admin/leads/pipeline"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Leads Pipeline
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.businessName}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
            <span>{LEAD_INTENDED_TYPE_LABELS[lead.intendedType]} lead</span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 text-foreground/80">
              <Compass className="h-3.5 w-3.5 text-indigo-500" />
              sourced via {LEAD_SOURCE_LABELS[lead.source]}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canAct && (
            <>
              <Button
                variant="outline"
                className="gap-1.5 hover:text-rose-600 hover:border-rose-300"
                onClick={onMarkLost}
              >
                <XCircle className="h-3.5 w-3.5 text-rose-500" />
                Mark Lost
              </Button>
              {/* An action, not a link. Converting provisions a business and
                  emails its owner a single-use link — a write, and one the
                  server refuses unless the deal is won and the lead carries an
                  email address. Navigating to /convert first said nothing
                  about whether this lead qualified, and that route is a
                  redirect back to this page now, so the link would have
                  bounced straight back having done nothing. */}
              <Button
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!convertibility.canConvert}
                title={convertibility.reason ?? "Convert this lead into a business"}
                onClick={onConvert}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Convert to Customer
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
