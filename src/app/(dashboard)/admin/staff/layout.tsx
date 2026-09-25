import { TooltipProvider } from "@/components/ui/tooltip"

// StaffProvider is gone from this tree.
//
// It supplied a StaffRepository over localStorage, seeded from mockStaff, that
// every screen in this module read and wrote. All of them now talk to
// auth-service through features/staff, so the provider had no consumers left —
// and leaving it mounted would keep seeding a shadow copy of the directory
// into each admin's browser.
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
