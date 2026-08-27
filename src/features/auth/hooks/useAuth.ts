"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/axios";
import {
  clearAdminSession,
  getAdminAccessToken,
  setAdminAccessToken,
  setStoredAdmin,
} from "@/lib/auth-session";
import { authApi } from "../api/auth.api";
import { authKeys } from "../api/auth.keys";
import {
  AcceptAdminInvitationRequest,
  AdminForgotPasswordRequest,
  AdminLoginRequest,
  AdminResetPasswordRequest,
} from "../api/auth.types";

function persistLogin(result: Awaited<ReturnType<typeof authApi.login>>) {
  setAdminAccessToken(result.accessToken);
  setStoredAdmin(result.admin);
}

export function useAdminMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    enabled: typeof window !== "undefined" && Boolean(getAdminAccessToken()),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInvitation(token: string) {
  return useQuery({
    queryKey: authKeys.invitation(token),
    queryFn: () => authApi.getInvitation(token),
    enabled: token.length > 0,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminLoginRequest) => authApi.login(payload),
    onSuccess: (result) => {
      persistLogin(result);
      queryClient.setQueryData(authKeys.me(), result.admin);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAdminSession();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: AdminForgotPasswordRequest) => authApi.forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: AdminResetPasswordRequest) => authApi.resetPassword(payload),
  });
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (payload: AcceptAdminInvitationRequest) => authApi.acceptInvitation(payload),
  });
}

export function authErrorMessage(error: unknown, fallback: string) {
  return getApiErrorMessage(error, fallback);
}
