import { createContext, useContext } from 'react';
import { PlatformUser } from '@/types/platform';
import { WhatsAppPermission } from '@/types/permissions';

interface AuthUser extends PlatformUser {
  whatsappPermissions: WhatsAppPermission[];
}

const AuthContext = createContext<AuthUser | null>(null);

export const AuthProvider: React.FC<{ user: AuthUser; children: React.ReactNode }> = ({ user, children }) => (
  <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
);

export const useAuth = () => {
  const user = useContext(AuthContext);
  if (!user) throw new Error('useAuth must be used within AuthProvider');
  return user;
};