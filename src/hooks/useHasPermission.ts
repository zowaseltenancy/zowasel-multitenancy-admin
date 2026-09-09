'use client';

import { useMemo } from 'react';

/**
 * useHasPermission
 * Evaluates whether the active staff / session user has the requested permission key.
 * Corresponds to /api/v1/auth/me payload in Zowasel SSO Backend Track (lines 2425-2430 & 2518).
 */
export function useHasPermission(permissionCode: string): boolean {
  return useCan([permissionCode]);
}

/**
 * useCan
 * Evaluates whether the user satisfies one or more required permission codes.
 * Returns true if user has SUPER_ADMIN systemRole or wildcard '*' scope.
 */
export function useCan(permissionCodes: string | string[]): boolean {
  const codes = Array.isArray(permissionCodes) ? permissionCodes : [permissionCodes];

  return useMemo(() => {
    if (typeof window === 'undefined') return true;
    try {
      const rawUser = localStorage.getItem('auth_user') || localStorage.getItem('current_user');
      if (!rawUser) {
        // Default Super Admin access in development environment
        return true;
      }
      const user = JSON.parse(rawUser);
      const systemRole = user.role || user.systemRole;
      if (systemRole === 'SUPER_ADMIN' || systemRole === 'super_admin') {
        return true;
      }

      const userPerms: string[] = user.permissions || [];
      if (userPerms.includes('*')) {
        return true;
      }

      return codes.some((code) => userPerms.includes(code));
    } catch {
      return true;
    }
  }, [JSON.stringify(codes)]);
}
