import { StaffProvider } from '@/hooks/useStaff';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffProvider>{children}</StaffProvider>;
}