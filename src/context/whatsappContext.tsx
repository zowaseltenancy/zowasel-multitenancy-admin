"use client";
import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { WhatsAppRepository } from '@/lib/whatsapp/repository';
import { CurrentUser, Permission } from '@/lib/whatsapp/types';
import { DEFAULT_WHATSAPP_ROLES } from '@/lib/whatsapp/permissions';

interface Ctx {
  repo: WhatsAppRepository;
  currentUser: CurrentUser;
  setCurrentUserRole: (roleId: string) => void;
  hasPermission: (p: Permission) => boolean;
  refresh: () => void;
}

const WhatsAppContext = createContext<Ctx | null>(null);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repoRef = useRef(new WhatsAppRepository());
  const [roleId, setRoleId] = useState('wa-role-super');
  const [, force] = useState(0);

  const role = useMemo(
    () => repoRef.current.getRoles().find((r) => r.id === roleId) || DEFAULT_WHATSAPP_ROLES[0],
    [roleId]
  );

  const currentUser: CurrentUser = useMemo(
    () => ({
      id: 'staff-1',
      name: 'Alice Johnson',
      scopeLevel: role.scopeLevel,
      departmentId: role.departmentId,
      permissions: role.permissions,
      roleId: role.id,
    }),
    [role]
  );

  const hasPermission = (p: Permission) => currentUser.permissions.includes(p);

  return (
    <WhatsAppContext.Provider
      value={{
        repo: repoRef.current,
        currentUser,
        setCurrentUserRole: setRoleId,
        hasPermission,
        refresh: () => force((n) => n + 1),
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) throw new Error('useWhatsApp must be used within WhatsAppProvider');
  return ctx;
};