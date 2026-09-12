"use client";
import { useWhatsApp } from '@/context/whatsappContext';
import { Permission } from '@/lib/whatsapp/types';

export default function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useWhatsApp();
  if (!hasPermission(permission)) return <>{fallback}</>;
  return <>{children}</>;
}