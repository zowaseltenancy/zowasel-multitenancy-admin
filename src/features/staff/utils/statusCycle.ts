import { StaffMember } from '@/types/staff';
import { StaffStatus } from '@/features/staff/api/staff.types';

/**
 * What the status control does next, given where the account is now.
 *
 * The three states are not a checkbox, and the console used to treat them as
 * two different ones: the directory flipped ACTIVE ↔ INACTIVE and never
 * suspended anyone, while the profile screen flipped ACTIVE ↔ SUSPENDED and
 * never deactivated anyone. Which of the three an account could reach came
 * down to which page you happened to be on, and neither page could reach the
 * third at all.
 *
 * One cycle for both:
 *
 *   INACTIVE  → ACTIVE     reinstate an account that was stood down
 *   ACTIVE    → SUSPENDED  the escalation: suspension revokes every session
 *   SUSPENDED → ACTIVE     lift the suspension
 *
 * So a live account is one click from suspended, and a stopped account — by
 * either route — is one click from working again. Deactivating rather than
 * suspending stays available through the staff form, which sets the status
 * outright instead of stepping through it.
 *
 * The server enforces its own rules on top: it refuses your own account and
 * the last active super admin, and revokes sessions on any move off ACTIVE.
 */
export function nextStaffStatus(current: StaffMember['status'] | string | undefined): StaffStatus {
  return (current ?? '').toLowerCase() === 'active' ? 'SUSPENDED' : 'ACTIVE';
}

/** The verb for the action `nextStaffStatus` would take, for labels and tooltips. */
export function staffStatusActionLabel(
  current: StaffMember['status'] | string | undefined,
): string {
  const normalized = (current ?? '').toLowerCase();
  if (normalized === 'active') return 'Suspend';
  if (normalized === 'suspended') return 'Lift suspension';
  return 'Activate';
}
