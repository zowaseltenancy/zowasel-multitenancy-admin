'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { WhatsAppPermission } from '@/types/permissions';

interface Props {
  children: React.ReactNode;
  /** All of these must be held. */
  required?: WhatsAppPermission[];
  /** At least one of these must be held. */
  anyOf?: WhatsAppPermission[];
  /** Extra condition, e.g. `repo.canActOnChat(viewer, chat)`. */
  when?: boolean;
  /** 'hide' removes the node; 'disable' dims it and blocks pointer events. */
  mode?: 'hide' | 'disable';
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  required,
  anyOf,
  when = true,
  mode = 'hide',
  fallback = null,
}: Props) {
  const { whatsappPermissions } = useAuth();

  const hasRequired = required
    ? required.every((p) => whatsappPermissions.includes(p))
    : true;
  const hasAny = anyOf ? anyOf.some((p) => whatsappPermissions.includes(p)) : true;
  const allowed = hasRequired && hasAny && when;

  if (allowed) return <>{children}</>;
  if (mode === 'hide') return <>{fallback}</>;

  return (
    <div
      aria-disabled
      className="pointer-events-none opacity-40"
      title="You do not have permission for this action"
    >
      {children}
    </div>
  );
}

/** Imperative form, for logic that isn't a render decision. */
export function usePermission() {
  const { whatsappPermissions } = useAuth();
  return {
    can: (p: WhatsAppPermission) => whatsappPermissions.includes(p),
    canAll: (ps: WhatsAppPermission[]) => ps.every((p) => whatsappPermissions.includes(p)),
    canAny: (ps: WhatsAppPermission[]) => ps.some((p) => whatsappPermissions.includes(p)),
  };
}