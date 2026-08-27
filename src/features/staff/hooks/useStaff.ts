"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/axios";
import { staffApi } from "../api/staff.api";
import { staffKeys } from "../api/staff.keys";
import {
  CreateStaffPayload,
  StaffListQuery,
  StaffStatus,
  StaffSystemRole,
  UpdateStaffPayload,
} from "../api/staff.types";

export function useStaff(params: StaffListQuery = {}) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffApi.list(params),
  });

  // Every mutation returns the updated row, so the detail cache is primed and
  // the list refetched rather than patched — the list's ordering and paging
  // are the server's to decide.
  const invalidate = () => queryClient.invalidateQueries({ queryKey: staffKeys.all });

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

  return {
    staff: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load staff.") : null,
    createStaff,
    updateStaff,
    setStatus,
    setSystemRole,
    setRoles,
  };
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.detail(id),
    enabled: id.length > 0,
  });
}

/** Departments come from the backend, not a hardcoded list. */
export function useDepartments() {
  const query = useQuery({
    queryKey: staffKeys.departments(),
    queryFn: staffApi.departments,
  });

  return {
    departments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load departments.") : null,
  };
}

/** "Ada Okoro", or the email when the invitation has not been accepted yet. */
export function staffDisplayName(member: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}): string {
  return [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email;
}
