import { Lead } from "@/types/lead";

/**
 * Whether a lead can be converted, and if not, why.
 *
 * One place, because the answer is the server's and three screens ask it: the
 * pipeline table, the lead detail page and the conversion sheet. They used to
 * each guess — offering Convert for any lead that was not already converted —
 * and POST /admin/leads/{id}/convert then refused most of them with a 409 the
 * operator could do nothing about from the screen they were on.
 *
 * The rules mirror LeadsService.convert exactly:
 *
 *   * the stage must be CLOSED_WON — a deal has to be won before it becomes a
 *     business; QUALIFIED, PROPOSAL and NEGOTIATION are not won,
 *   * the lead must not already be converted — conversion is once per lead,
 *     and the tenant it produced is the attribution record,
 *   * there must be an email address — it is the only channel the owner's
 *     onboarding link can reach, and the endpoint rejects a lead without one.
 *
 * The conversion form can supply an owner email the lead itself lacks, which
 * is why `reason` names the fix rather than simply disabling the action.
 */
export interface Convertibility {
  canConvert: boolean;
  /** Present when canConvert is false: what stands in the way, in one line. */
  reason?: string;
}

export const CONVERTIBLE_STAGE = "CLOSED_WON";

export function convertibilityOf(lead: Lead): Convertibility {
  if (lead.convertedOrganizationId || lead.status === "converted") {
    return { canConvert: false, reason: "This lead has already been converted." };
  }

  if (lead.status === "lost") {
    return { canConvert: false, reason: "A lost lead cannot be converted." };
  }

  if (lead.stage && lead.stage !== CONVERTIBLE_STAGE) {
    return {
      canConvert: false,
      reason: `Only a won deal can be converted. Move this lead to Closed Won first — it is at ${humanizeStage(lead.stage)}.`,
    };
  }

  if (!lead.email?.trim()) {
    return {
      canConvert: false,
      reason: "This lead has no email address, so the owner cannot be sent an onboarding link.",
    };
  }

  return { canConvert: true };
}

/** "CLOSED_WON" → "Closed Won". */
export function humanizeStage(stage: string): string {
  return stage
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
