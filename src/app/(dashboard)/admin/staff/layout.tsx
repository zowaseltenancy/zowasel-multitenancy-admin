import { StaffProvider } from '@/hooks/useStaff';
import { TooltipProvider } from "@/components/ui/tooltip"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <StaffProvider>
        {children}
      </StaffProvider>
    </TooltipProvider>
  );
}