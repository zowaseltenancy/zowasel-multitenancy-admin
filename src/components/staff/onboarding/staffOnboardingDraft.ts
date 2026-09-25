import { StaffFormValues } from '@/lib/validations/staff';

// ── Onboarding draft storage ─────────────────────────────────────────────────
// "Save as Draft" used to be a toast and nothing else: the button reported
// success and the operator lost nine stages of typing on the next refresh.
//
// Drafts live in localStorage rather than on the server because there is no
// draft resource to POST to — an admin row cannot be created half-filled (it
// would appear in the directory and fire an invitation email). Per-browser is
// therefore the honest scope, and the resume banner says so.

const DRAFT_KEY = 'staff-draft';

// Bumped whenever StaffFormValues changes shape. A draft from an older shape
// is discarded rather than fed to the form, where a stale field would either
// be silently ignored or land in a control that no longer expects it.
const DRAFT_VERSION = 1;

interface StoredDraft {
  version: number;
  savedAt: string;
  values: Partial<StaffFormValues>;
}

export interface StaffDraft {
  savedAt: Date;
  values: Partial<StaffFormValues>;
}

/**
 * Every access is wrapped: localStorage throws outright in a browser with site
 * data blocked, and this runs on a page whose only job is a form — a storage
 * failure must not take the form down with it.
 */
export function readStaffDraft(): StaffDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredDraft;
    if (parsed?.version !== DRAFT_VERSION || !parsed.values) {
      window.localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return { savedAt: new Date(parsed.savedAt), values: parsed.values };
  } catch {
    return null;
  }
}

/**
 * Returns false when the draft could not be stored, so the caller reports a
 * failure instead of the success toast this button used to show unconditionally.
 *
 * `documents` is dropped: it holds File objects, which JSON.stringify flattens
 * to `{}` — restoring those would put unusable placeholders back in the form.
 */
export function writeStaffDraft(values: StaffFormValues): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const persistable: Partial<StaffFormValues> = { ...values };
    delete persistable.documents;

    const draft: StoredDraft = {
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      values: persistable,
    };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    // Most likely the quota: a captured headshot is a base64 string of a few
    // hundred KB, and localStorage caps out around 5MB per origin.
    return false;
  }
}

export function clearStaffDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to recover — the draft is only ever a convenience.
  }
}
