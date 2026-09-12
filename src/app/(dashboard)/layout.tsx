import DashboardLayout from "@/components/layout/DashboardLayout";
import { StaffProvider } from "@/hooks/useStaff";
import { WhatsAppProvider } from "@/context/whatsappContext";


export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffProvider>
      <WhatsAppProvider>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </WhatsAppProvider>
    </StaffProvider>
  );
}