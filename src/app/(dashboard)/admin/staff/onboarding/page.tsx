'use client';

import { useRouter } from 'next/navigation';
import { StaffOnboardingForm } from '@/components/staff/StaffOnboardingForm';
import {
  useAdminRoles,
  useDepartments,
  useStaff,
} from '@/features/staff/hooks/useStaff';
import { mapAdminRole } from '@/features/staff/api/staff.mappers';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { StaffFormValues } from '@/lib/validations/staff';
import { CreateStaffPayload } from '@/features/staff/api/staff.types';
import {
  clearStaffDraft,
  readStaffDraft,
  writeStaffDraft,
  type StaffDraft,
} from '@/components/staff/onboarding/staffOnboardingDraft';

import { Button } from '@/components/ui/button';
import { ArrowLeft, BookmarkCheck, Loader2 } from 'lucide-react';

/** Drops keys whose value is blank, so an untouched section is omitted rather than sent as ''. */
function compact<T extends Record<string, string | undefined>>(section: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(section).filter(([, value]) => value !== undefined && value.trim() !== ''),
  ) as Partial<T>;
}

export default function StaffOnboardingPage() {
  const router = useRouter();

  // POST /admin/staff. Onboarding is invitation-based server-side: the endpoint
  // creates the placement and emails a token the new admin redeems to set
  // their own password, so no admin ever knows another's credentials. That is
  // why there is no password field on this form.
  const { onboard, assignRoles, isMutating: submitting } = useStaff();

  const { roles: roleDtos, isLoading: rolesLoading } = useAdminRoles({ limit: 100 });
  const { departments, isLoading: departmentsLoading } = useDepartments({ limit: 100 });

  const roles = useMemo(() => roleDtos.map(mapAdminRole), [roleDtos]);
  const departmentOptions = useMemo(
    () => departments.map((d) => ({ id: d.id, name: d.name })),
    [departments],
  );

  // Read in an effect, not during render: localStorage does not exist on the
  // server, and seeding useForm from it inline is a hydration mismatch. The
  // form is held back until this has run (see the spinner below) because
  // react-hook-form takes its defaultValues once, at mount — handing it the
  // draft afterwards would have no effect.
  const [draft, setDraft] = useState<StaffDraft | null>(null);
  const [draftChecked, setDraftChecked] = useState(false);

  useEffect(() => {
    // Same shape as DashboardLayout's mounted flag, and disabled for the same
    // reason: reading storage after mount is the only hydration-safe way to
    // get at it, so the setState here is the synchronisation, not a cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(readStaffDraft());
    setDraftChecked(true);
  }, []);

  const handleSaveDraft = (data: StaffFormValues) => {
    if (writeStaffDraft(data)) {
      toast.success('Draft saved on this device. You can safely resume later.');
      return;
    }
    // Reported rather than swallowed: the operator is about to close the tab on
    // the strength of this toast.
    toast.error('Could not save the draft — this browser is out of storage or has site data blocked.');
  };

  const discardDraft = () => {
    clearStaffDraft();
    setDraft(null);
    // The form already mounted with the draft's values, so clearing storage
    // alone would leave them on screen and the banner gone. Remounting it (see
    // the `key` below) is what actually returns the operator to a blank form.
    toast.success('Draft discarded.');
  };

  const handleSubmit = (data: StaffFormValues) => {
    // Blank-only sections are dropped: the endpoint validates `.strict()` and
    // skips sub-records with no values, so sending {} for a stage the operator
    // never opened just adds noise to the request.
    const nextOfKin = compact({
      fullName: data.nextOfKin?.fullName,
      relationship: data.nextOfKin?.relationship,
      phone: data.nextOfKin?.phone,
      email: data.nextOfKin?.email,
      address: data.nextOfKin?.address,
    });
    const bank = compact({
      bankName: data.bank?.bankName,
      accountNumber: data.bank?.accountNumber,
      sortCode: data.bank?.sortCode,
      taxId: data.bank?.taxId,
    });

    const payload: CreateStaffPayload = {
      email: data.personalInfo.email,
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      // New staff always start at the lowest tier. Promotion is a separate
      // SUPER_ADMIN-guarded endpoint, deliberately not reachable from a form
      // that any staff:write holder can submit.
      role: 'STAFF',
      ...(data.employment.department ? { departmentId: data.employment.department } : {}),
      ...(data.employment.managerId ? { managerId: data.employment.managerId } : {}),
      // The headshot, as the base64 data URL the webcam step produced. Stored
      // verbatim server-side in admins.avatarUrl.
      ...(data.personalInfo.avatarUrl ? { avatarUrl: data.personalInfo.avatarUrl } : {}),
      ...(Object.keys(nextOfKin).length > 0 ? { nextOfKin } : {}),
      ...(Object.keys(bank).length > 0 ? { bank } : {}),
    };

    onboard(payload, {
      onSuccess: () => {
        // The record is saved, so the draft has served its purpose — leaving it
        // behind would pre-fill the next onboarding with this person's details.
        clearStaffDraft();
        router.push('/admin/staff/directory');
      },
    });

    // The assignable role is its own endpoint and needs the new member's id,
    // which POST /admin/staff returns to the mutation but not to this callback.
    // Left for the directory's role action rather than guessed at here.
    void assignRoles;
  };

  if (rolesLoading || departmentsLoading || !draftChecked) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#44883C]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/staff/directory')}
          className="-ml-2 text-xs text-slate-600 dark:text-slate-300 hover:text-foreground gap-1.5 font-medium h-7 px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Staff Directory
        </Button>
      </div>

      {draft && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-[#44883C]/25 bg-[#44883C]/5 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-foreground">
            <BookmarkCheck className="h-4 w-4 text-[#44883C] shrink-0" />
            <span>
              Resumed a draft saved on this device at{' '}
              <span className="font-semibold">
                {draft.savedAt.toLocaleString([], {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              . It is cleared once onboarding completes.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={discardDraft}
            className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground shrink-0"
          >
            Discard draft
          </Button>
        </div>
      )}

      <StaffOnboardingForm
        // Remounts the form when the draft is discarded, so its values reset to
        // the blank defaults instead of lingering after the banner is gone.
        key={draft ? 'draft' : 'blank'}
        defaultValues={draft?.values}
        roles={roles}
        departments={departmentOptions}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isSubmitting={submitting}
      />
    </div>
  );
}
