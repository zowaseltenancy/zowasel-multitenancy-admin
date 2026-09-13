"use client";

import { useLeads } from "./useLeads";
import { Lead } from "@/types/lead";
import { ConvertLeadRequest } from "../api/leads.types";

/**
 * What the convert form can override.
 *
 * Everything here is optional — the endpoint falls back to the lead's own
 * details for anything omitted. Four fields the earlier shape carried are
 * deliberately absent:
 *
 * - `ownerPassword` — an admin must not choose, see or hold a customer's
 *   password. The endpoint creates the account with a hash of a secret that is
 *   generated, hashed and immediately discarded, then emails the owner a
 *   single-use link so they set their own.
 * - `kybStatus` — earned through review (PATCH /kyb/{tenantId}/review), not
 *   typed in at conversion. A business that starts life "approved" has been
 *   verified by nobody.
 * - `initialPlan` — owned by billing, which publishes subscription events that
 *   the read model projects. Setting it here would invent a subscription.
 * - `sendActivationEmail` — the invitation is the only credential the owner
 *   has, so it is unconditional. A toggle that suppresses it produces an
 *   account nobody can sign in to.
 */
export interface ConvertLeadValues {
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  dateOfBirth?: string;
  country?: string;
  countryCode?: string;
  businessName?: string;
  intendedType?: string;
  notes?: string;
}

/**
 * A single name field has to become firstName/lastName, because that is what
 * the account model stores. First token is the given name, the remainder the
 * family name — imperfect for names that do not follow that order, which is
 * why the owner can correct it during onboarding.
 */
function splitName(full?: string): { firstName?: string; lastName?: string } {
  const trimmed = full?.trim();
  if (!trimmed) return {};
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

/** Drops undefined keys so `.strict()` on the server sees only real values. */
function compact<T extends object>(input: T): Partial<T> | undefined {
  const entries = Object.entries(input).filter(([, v]) => v !== undefined && v !== "");
  return entries.length ? (Object.fromEntries(entries) as Partial<T>) : undefined;
}

// Single source of truth for "convert a lead into a real organization" — used
// by the Leads directory, the Lead Detail page and the convert form, so the
// logic never drifts between them.
//
// This used to fabricate the organization client-side: it minted an id like
// `biz_1724…`, handed it to a local `addOrganization` (which had no endpoint
// behind it and only showed a toast), then sent that fake id to the convert
// endpoint — where it failed uuid validation, so nothing was ever converted.
//
// The server owns provisioning now. POST /admin/leads/{id}/convert with no
// tenantId creates the tenant, creates or links the owner's account with the
// OWNER membership, and emails the owner a single-use link to set a password.
export function useLeadConversion() {
  const { convertLead, isMutating } = useLeads();

  const convert = (
    lead: Lead,
    values?: ConvertLeadValues,
    options?: { onSuccess?: () => void },
  ) => {
    const { firstName, lastName } = splitName(values?.ownerName);

    const overrides: Omit<ConvertLeadRequest, "tenantId"> = {
      ...(values?.notes?.trim() ? { note: values.notes.trim() } : {}),
      owner: compact({
        email: values?.ownerEmail?.trim(),
        firstName,
        lastName,
        phone: values?.ownerPhone?.trim(),
        dateOfBirth: values?.dateOfBirth,
      }),
      business: compact({
        name: values?.businessName?.trim(),
        type: values?.intendedType,
        country: values?.country?.trim(),
        countryCode: values?.countryCode,
      }),
    };

    convertLead(lead.id, overrides, options);
  };

  return { convert, isConverting: isMutating };
}
