"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/axios";
import {
  adminPermissionsApi,
  adminRolesApi,
  departmentsApi,
  leaveApi,
  staffApi,
} from "../api/staff.api";
import { staffKeys } from "../api/staff.keys";
import {
  AdminPermissionDto,
  AdminPermissionListQuery,
  AdminRoleDto,
  AdminRoleListQuery,
  CreateAdminPermissionPayload,
  CreateAdminRolePayload,
  CreateDepartmentPayload,
  CreateLeaveRequestPayload,
  CreateStaffPayload,
  DepartmentListQuery,
  LeaveCalendarQuery,
  LeaveOverviewQuery,
  MyLeaveRequestsQuery,
  ReviewLeaveRequestPayload,
  StaffListQuery,
  StaffPasswordResetDto,
  StaffStatus,
  StaffSystemRole,
  UpdateAdminRolePayload,
  UpdateDepartmentPayload,
  UpdateStaffPayload,
} from "../api/staff.types";

// Staff management, backed entirely by auth-service.
//
// Every screen in this module previously read and wrote a StaffRepository over
// localStorage seeded from mockStaff — so two admins saw different staff, and
// clearing site data reset the directory. These hooks replace that.
//
// Each resource exposes the same shape: a query, plus action functions that
// take an optional `onSuccess` so callers can close a dialog or navigate only
// once the server has accepted. Toasts are raised here rather than at the call
// site, so a failure cannot be reported as a success — which is what happened
// wherever a component fired a toast next to the mutation instead of after it.

/** Runs a mutation, reporting the outcome once, from one place. */
/**
 * `onSuccess` receives whatever the endpoint returned, for the callers that
 * need it — creating a role, say, where the next call needs the new role's id
 * and the refetched list has not arrived yet. The default `void` keeps every
 * existing call site (which ignores the argument) unchanged.
 */
interface ActionOptions<TData = void> {
  onSuccess?: (data: TData) => void;
}

// ── Staff directory ──────────────────────────────────────────────────────────

export function useStaff(params: StaffListQuery = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffApi.list(params),
    // Every filter and page is part of the key, so each change is a *new*
    // query with no cached data — and react-query reports isLoading for it.
    // Without this the directory fell back to its empty state on each
    // keystroke: the table, the filter bar and the focused search input were
    // all unmounted and rebuilt, which is why typing felt like a page reload.
    //
    // Holding the previous result keeps the rows on screen while the next
    // ones arrive; `isFetching` is what tells the UI something is in flight.
    placeholderData: keepPreviousData,
  });

  // Mutations return the updated row, but the list is refetched rather than
  // patched — its ordering, filtering and paging are the server's to decide.
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: staffKeys.all });
    void queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
  };

  const createStaff = useMutation({
    mutationFn: (payload: CreateStaffPayload) => staffApi.create(payload),
    onSuccess: invalidate,
  });

  const updateStaff = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStaffPayload }) =>
      staffApi.update(id, payload),
    onSuccess: invalidate,
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: StaffStatus; reason?: string }) =>
      staffApi.setStatus(id, status, reason),
    onSuccess: invalidate,
  });

  const setSystemRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: StaffSystemRole }) =>
      staffApi.setSystemRole(id, role),
    onSuccess: invalidate,
  });

  const setRoles = useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) =>
      staffApi.setRoles(id, roleIds),
    onSuccess: invalidate,
  });

  const resetStaffPassword = useMutation({
    mutationFn: (id: string) => staffApi.resetPassword(id),
    // Nothing in the list changes — no status, no role, no membership — so the
    // directory is left alone rather than refetched for a write it cannot show.
  });

  const removeStaff = useMutation({
    mutationFn: (id: string) => staffApi.remove(id),
    onSuccess: invalidate,
  });

  return {
    staff: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load staff.") : null,

    /**
     * POST /admin/staff. Onboarding is invitation-based: this creates the
     * placement and the server emails a token the new admin redeems to set
     * their own password, so no admin ever knows another's credentials.
     */
    onboard: (payload: CreateStaffPayload, options?: ActionOptions) => {
      createStaff.mutate(payload, {
        onSuccess: () => {
          toast.success("Staff member onboarded — an invitation has been emailed.");
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to onboard this staff member.")),
      });
    },

    /** PATCH /admin/staff/{id} — department and manager placement. */
    edit: (id: string, payload: UpdateStaffPayload, options?: ActionOptions) => {
      updateStaff.mutate(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Staff member updated.");
            options?.onSuccess?.();
          },
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to update this staff member.")),
        },
      );
    },

    /**
     * PATCH /admin/staff/{id}/status. Moving off ACTIVE revokes the account's
     * sessions server-side. Refused for your own account and for the last
     * active super admin.
     */
    changeStatus: (
      id: string,
      status: StaffStatus,
      reason?: string,
      options?: ActionOptions,
    ) => {
      setStatus.mutate(
        { id, status, reason },
        {
          onSuccess: () => {
            toast.success(`Status changed to ${status.toLowerCase()}.`);
            options?.onSuccess?.();
          },
          onError: (error) => toast.error(getApiErrorMessage(error, "Unable to change the status.")),
        },
      );
    },

    /** PATCH /admin/staff/{id}/system-role. SUPER_ADMIN only server-side. */
    changeSystemRole: (id: string, role: StaffSystemRole, options?: ActionOptions) => {
      setSystemRole.mutate(
        { id, role },
        {
          onSuccess: () => {
            toast.success("System role updated.");
            options?.onSuccess?.();
          },
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to change the system role.")),
        },
      );
    },

    /**
     * PUT /admin/staff/{id}/roles. Replaces the whole assignment set, so the
     * payload is the roles the member should end up with, not a delta.
     */
    assignRoles: (id: string, roleIds: string[], options?: ActionOptions) => {
      setRoles.mutate(
        { id, roleIds },
        {
          onSuccess: () => {
            toast.success("Roles updated.");
            options?.onSuccess?.();
          },
          onError: (error) => toast.error(getApiErrorMessage(error, "Unable to update the roles.")),
        },
      );
    },

    /**
     * DELETE /admin/staff/{id}. A soft delete server-side — the record leaves
     * the directory and authentication, but the row survives so audit and lead
     * attribution stay intact. Refused for your own account, for a super admin
     * unless you are one, and for the last active super admin. Those refusals
     * surface as toasts rather than being pre-empted here, because the caller's
     * copy of the record can be stale.
     */
    /**
     * POST /admin/staff/{id}/reset-password.
     *
     * The temporary password reaches `onSuccess` and nowhere else: it is not
     * cached, not put in a query, and not emailed. Whatever the caller does
     * not show the admin in that callback is gone.
     */
    resetPassword: (id: string, options?: ActionOptions<StaffPasswordResetDto>) => {
      resetStaffPassword.mutate(id, {
        onSuccess: (result) => {
          toast.success(
            result.noticeSent
              ? "Password reset. The staff member has been notified by email."
              : "Password reset. The notice email could not be sent — share the password directly.",
          );
          options?.onSuccess?.(result);
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to reset the password.")),
      });
    },

    remove: (id: string, options?: ActionOptions) => {
      removeStaff.mutate(id, {
        onSuccess: () => {
          toast.success("Staff member deleted.");
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to delete this staff member.")),
      });
    },

    isResettingPassword: resetStaffPassword.isPending,

    isMutating:
      createStaff.isPending ||
      updateStaff.isPending ||
      setStatus.isPending ||
      setSystemRole.isPending ||
      setRoles.isPending ||
      removeStaff.isPending,

    // The raw mutations, for callers that need pending state per action.
    createStaff,
    updateStaff,
    setStatus,
    setSystemRole,
    setRoles,
    removeStaff,
  };
}

/** One staff member, from GET /admin/staff/{id}. */
export function useStaffMember(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.detail(id),
    enabled: id.length > 0,
  });
}

/**
 * Platform-wide staff counts, from GET /admin/staff/stats.
 *
 * Computed server-side with grouped queries. Counting the fetched page would
 * make every figure mean "rows currently on screen" and move as you filter.
 */
export function useStaffStats() {
  const query = useQuery({
    queryKey: staffKeys.stats(),
    queryFn: staffApi.stats,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load staff stats.") : null,
  };
}

// ── Departments ──────────────────────────────────────────────────────────────

export function useDepartments(params: DepartmentListQuery = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: staffKeys.departmentList(params),
    queryFn: () => departmentsApi.list(params),
  });

  // Staff carry a department, and the stats card counts by department, so both
  // are stale after any department write.
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: staffKeys.departments() });
    void queryClient.invalidateQueries({ queryKey: staffKeys.all });
  };

  const createDepartment = useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => departmentsApi.create(payload),
    onSuccess: invalidate,
  });

  const updateDepartment = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDepartmentPayload }) =>
      departmentsApi.update(id, payload),
    onSuccess: invalidate,
  });

  const removeDepartment = useMutation({
    mutationFn: (id: string) => departmentsApi.remove(id),
    onSuccess: invalidate,
  });

  return {
    departments: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load departments.") : null,

    create: (payload: CreateDepartmentPayload, options?: ActionOptions) => {
      createDepartment.mutate(payload, {
        onSuccess: () => {
          toast.success("Department created.");
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to create the department.")),
      });
    },

    /** `headId: null` vacates the post; omitting it leaves the head untouched. */
    update: (id: string, payload: UpdateDepartmentPayload, options?: ActionOptions) => {
      updateDepartment.mutate(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Department updated.");
            options?.onSuccess?.();
          },
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to update the department.")),
        },
      );
    },

    remove: (id: string, options?: ActionOptions) => {
      removeDepartment.mutate(id, {
        onSuccess: () => {
          toast.success("Department deleted.");
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to delete the department.")),
      });
    },

    isMutating:
      createDepartment.isPending || updateDepartment.isPending || removeDepartment.isPending,
  };
}

/** One department, from GET /admin/departments/{id}. */
export function useDepartment(id: string) {
  return useQuery({
    queryKey: staffKeys.departmentDetail(id),
    queryFn: () => departmentsApi.detail(id),
    enabled: id.length > 0,
  });
}

// ── Admin roles ──────────────────────────────────────────────────────────────

export function useAdminRoles(params: AdminRoleListQuery = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: staffKeys.roleList(params),
    queryFn: () => adminRolesApi.list(params),
  });

  // Staff rows embed their roles and permissions, so a role write invalidates
  // the directory too.
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: staffKeys.roles() });
    void queryClient.invalidateQueries({ queryKey: staffKeys.all });
  };

  const createRole = useMutation({
    mutationFn: (payload: CreateAdminRolePayload) => adminRolesApi.create(payload),
    onSuccess: invalidate,
  });

  const updateRole = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminRolePayload }) =>
      adminRolesApi.update(id, payload),
    onSuccess: invalidate,
  });

  const removeRole = useMutation({
    mutationFn: (id: string) => adminRolesApi.remove(id),
    onSuccess: invalidate,
  });

  const setPermissions = useMutation({
    mutationFn: ({ id, permissionKeys }: { id: string; permissionKeys: string[] }) =>
      adminRolesApi.setPermissions(id, permissionKeys),
    onSuccess: invalidate,
  });

  return {
    roles: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load roles.") : null,

    /**
     * The created role reaches `onSuccess` — a role's permissions are a second
     * request (PUT /admin/roles/{id}/permissions) and it needs the new id.
     * Callers used to search the cached list for it by name, which could not
     * work: that list is the pre-create one until the invalidation refetch
     * lands, so the permission set was quietly dropped on every create.
     */
    create: (payload: CreateAdminRolePayload, options?: ActionOptions<AdminRoleDto>) => {
      createRole.mutate(payload, {
        onSuccess: (created) => {
          toast.success("Role created.");
          options?.onSuccess?.(created);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to create the role.")),
      });
    },

    update: (id: string, payload: UpdateAdminRolePayload, options?: ActionOptions) => {
      updateRole.mutate(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Role updated.");
            options?.onSuccess?.();
          },
          onError: (error) => toast.error(getApiErrorMessage(error, "Unable to update the role.")),
        },
      );
    },

    /**
     * The server refuses to delete a role that still has admins assigned, so
     * that refusal arrives as a toast rather than being guessed at here.
     */
    remove: (id: string, options?: ActionOptions) => {
      removeRole.mutate(id, {
        onSuccess: () => {
          toast.success("Role deleted.");
          options?.onSuccess?.();
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to delete the role.")),
      });
    },

    /** Replaces the role's whole permission set — pass the final list. */
    savePermissions: (id: string, permissionKeys: string[], options?: ActionOptions) => {
      setPermissions.mutate(
        { id, permissionKeys },
        {
          onSuccess: () => {
            toast.success("Permissions saved.");
            options?.onSuccess?.();
          },
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to save the permissions.")),
        },
      );
    },

    isMutating:
      createRole.isPending ||
      updateRole.isPending ||
      removeRole.isPending ||
      setPermissions.isPending,
  };
}

/** One role, from GET /admin/roles/{id}. */
export function useAdminRole(id: string) {
  return useQuery({
    queryKey: staffKeys.roleDetail(id),
    queryFn: () => adminRolesApi.detail(id),
    enabled: id.length > 0,
  });
}

// ── Permission catalog ───────────────────────────────────────────────────────

export function useAdminPermissions(params: AdminPermissionListQuery = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: staffKeys.permissionList(params),
    queryFn: () => adminPermissionsApi.list(params),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: staffKeys.permissions() });
    void queryClient.invalidateQueries({ queryKey: staffKeys.roles() });
  };

  const createPermission = useMutation({
    mutationFn: (payload: CreateAdminPermissionPayload) => adminPermissionsApi.create(payload),
    onSuccess: invalidate,
  });

  const removePermission = useMutation({
    mutationFn: (id: string) => adminPermissionsApi.remove(id),
    onSuccess: invalidate,
  });

  return {
    permissions: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load permissions.") : null,

    /** SUPER_ADMIN only — a 403 here means the signed-in admin is not one. */
    create: (payload: CreateAdminPermissionPayload, options?: ActionOptions<AdminPermissionDto>) => {
      createPermission.mutate(payload, {
        onSuccess: (created) => {
          toast.success("Permission added to the catalog.");
          options?.onSuccess?.(created);
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to add the permission.")),
      });
    },

    /** SUPER_ADMIN only. */
    remove: (id: string, options?: ActionOptions) => {
      removePermission.mutate(id, {
        onSuccess: () => {
          toast.success("Permission removed from the catalog.");
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to remove the permission.")),
      });
    },

    isMutating: createPermission.isPending || removePermission.isPending,
  };
}

// ── Leave ────────────────────────────────────────────────────────────────────

/** The signed-in admin's own leave. Open to any platform admin. */
export function useMyLeave(params: MyLeaveRequestsQuery = {}, year?: number) {
  const queryClient = useQueryClient();

  const balances = useQuery({
    queryKey: staffKeys.leaveBalances(year),
    queryFn: () => leaveApi.myBalances(year),
  });

  const requests = useQuery({
    queryKey: staffKeys.myLeave(params),
    queryFn: () => leaveApi.myRequests(params),
  });

  // A new request moves pendingDays on the balance, so both are stale.
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: staffKeys.leave() });
  };

  const submitRequest = useMutation({
    mutationFn: (payload: CreateLeaveRequestPayload) => leaveApi.submit(payload),
    onSuccess: invalidate,
  });

  const cancelRequest = useMutation({
    mutationFn: (id: string) => leaveApi.cancel(id),
    onSuccess: invalidate,
  });

  return {
    balances: balances.data ?? [],
    requests: requests.data?.items ?? [],
    meta: requests.data?.meta,
    isLoading: balances.isLoading || requests.isLoading,
    error:
      balances.error || requests.error
        ? getApiErrorMessage(balances.error ?? requests.error, "Unable to load leave.")
        : null,

    /**
     * POST /admin/leave/requests. The server checks the request against
     * availableDays (entitled - used - pending) and refuses an overdraw, so
     * that refusal is surfaced rather than pre-computed here.
     */
    submit: (payload: CreateLeaveRequestPayload, options?: ActionOptions) => {
      submitRequest.mutate(payload, {
        onSuccess: () => {
          toast.success("Leave request submitted.");
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to submit the leave request.")),
      });
    },

    /**
     * PATCH /admin/leave/requests/{id}/cancel. Only a PENDING request can be
     * withdrawn, and only your own — the server refuses the rest.
     */
    withdraw: (id: string, options?: ActionOptions) => {
      cancelRequest.mutate(id, {
        onSuccess: () => {
          toast.success('Leave request withdrawn.');
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, 'Unable to withdraw the request.')),
      });
    },

    isMutating: submitRequest.isPending || cancelRequest.isPending,
  };
}

/**
 * The management view: every admin's requests, and the review action.
 * Requires leave:review server-side.
 */
export function useLeaveOverview(params: LeaveOverviewQuery = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: staffKeys.leaveOverview(params),
    queryFn: () => leaveApi.overview(params),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: staffKeys.leave() });
  };

  const reviewRequest = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewLeaveRequestPayload }) =>
      leaveApi.review(id, payload),
    onSuccess: invalidate,
  });

  return {
    requests: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load leave requests.") : null,

    /**
     * PATCH /admin/leave/requests/{id}/review. Only APPROVED or REJECTED — a
     * reviewer cannot return a request to PENDING, and cancelling belongs to
     * the applicant. Approving is what deducts the days from the balance.
     */
    review: (
      id: string,
      decision: ReviewLeaveRequestPayload["decision"],
      note?: string,
      options?: ActionOptions,
    ) => {
      reviewRequest.mutate(
        { id, payload: { decision, ...(note ? { note } : {}) } },
        {
          onSuccess: () => {
            toast.success(decision === "APPROVED" ? "Leave approved." : "Leave rejected.");
            options?.onSuccess?.();
          },
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to record the decision.")),
        },
      );
    },

    isMutating: reviewRequest.isPending,
  };
}

/**
 * Approved leave in a date window, for the calendar.
 * Requires leave:read_calendar server-side.
 */
export function useLeaveCalendar(params: LeaveCalendarQuery) {
  const query = useQuery({
    queryKey: staffKeys.leaveCalendar(params),
    queryFn: () => leaveApi.calendar(params),
    enabled: Boolean(params.from && params.to),
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load the leave calendar.") : null,
  };
}

// ── Display helpers ──────────────────────────────────────────────────────────

/** "Ada Okoro", or the email when the invitation has not been accepted yet. */
export function staffDisplayName(member: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}): string {
  return [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email;
}
