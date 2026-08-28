import DashboardLayout from "@/components/layout/DashboardLayout";
import RequireAdminAuth from "@/components/layout/RequireAdminAuth";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Without this, /admin was reachable by typing the URL — no token, no
    // redirect, just a shell whose every request came back 401.
    <RequireAdminAuth>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </RequireAdminAuth>
  );
}
