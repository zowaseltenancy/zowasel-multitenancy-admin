import { LeaveType } from '@/types/staff';

/**
 * The leave types the platform actually has, in the order they are offered.
 *
 * This is the API's enum, verbatim. The console previously carried its own
 * list of display strings — 'Annual', 'Casual', 'Maternity/Paternity' — and
 * sent them to the server after a `.toUpperCase()`, which produced:
 *
 *   'Annual'              → ANNUAL               ✓ by luck
 *   'Casual'              → CASUAL               ✗ no such type
 *   'Maternity/Paternity' → MATERNITY/PATERNITY  ✗ two types joined by a slash
 *
 * So two of the five options in the request form could never be submitted, and
 * the queue's type filter compared those same display strings against the
 * mapped lower-case values, matching nothing whichever type was picked.
 *
 * Values are what goes on the wire; labels are what people read. Nothing
 * derives one from the other by transforming case.
 */
export const LEAVE_TYPES: LeaveType[] = [
  'ANNUAL',
  'SICK',
  'MATERNITY',
  'PATERNITY',
  'COMPASSIONATE',
  'UNPAID',
];

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  ANNUAL: 'Annual',
  SICK: 'Sick',
  MATERNITY: 'Maternity',
  PATERNITY: 'Paternity',
  COMPASSIONATE: 'Compassionate',
  UNPAID: 'Unpaid',
};

/** Longer wording for the request form, where the entitlement rules matter. */
export const LEAVE_TYPE_HINTS: Partial<Record<LeaveType, string>> = {
  ANNUAL: 'Annual Vacation',
  SICK: 'Sick Leave (medical certificate required beyond 2 days)',
  MATERNITY: 'Maternity Leave',
  PATERNITY: 'Paternity Leave',
  COMPASSIONATE: 'Compassionate / Bereavement',
  UNPAID: 'Unpaid Leave',
};

export const LEAVE_TYPE_OPTIONS = LEAVE_TYPES.map((value) => ({
  value,
  label: LEAVE_TYPE_LABELS[value],
  hint: LEAVE_TYPE_HINTS[value] ?? LEAVE_TYPE_LABELS[value],
}));

/**
 * A readable label for any value that reaches a screen.
 *
 * Tolerant on purpose: leave rows predate this list, and a stored type the
 * enum no longer names should render as itself rather than blank out the row.
 */
export function leaveTypeLabel(value: string | null | undefined): string {
  if (!value) return '—';
  const upper = value.toUpperCase();
  if (upper in LEAVE_TYPE_LABELS) return LEAVE_TYPE_LABELS[upper as LeaveType];
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
