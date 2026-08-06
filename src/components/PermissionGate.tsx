import { useAuth } from '@/hooks/useAuth';
import { WhatsAppPermission } from '@/types/permissions';

interface Props {
  required: WhatsAppPermission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<Props> = ({ required, fallback = null, children }) => {
  const user = useAuth();
  const hasPermission = required.every((p) => user.whatsappPermissions.includes(p));
  if (!hasPermission) return <>{fallback}</>;
  return <>{children}</>;
};