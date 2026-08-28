"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings,
  ShieldCheck,
  ChevronDown,
  Mail,
  User,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { getStoredAdmin, StoredAdmin } from "@/lib/auth-session";
import { Badge } from "@/components/ui/badge";

export default function UserMenu() {
  const router = useRouter();
  const [storedAdmin, setStoredAdminState] = useState<StoredAdmin | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const logoutMutation = useLogout();

  useEffect(() => {
    setStoredAdminState(getStoredAdmin());
  }, []);

  const admin = storedAdmin;

  const firstName = admin?.firstName || "Busayo";
  const lastName = admin?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const email = admin?.email || "admin@zowasel.com";

  const roleFormatMap: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    STAFF: "Staff",
  };
  const roleLabel = (admin?.role && roleFormatMap[admin.role]) || "Super Admin";

  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : firstName
      ? firstName.slice(0, 2).toUpperCase()
      : null;

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    try {
      if (getStoredAdmin()) {
        await logoutMutation.mutateAsync().catch(() => {});
      }
    } finally {
      toast.success("Signed out successfully. See you soon!");
      router.push("/login");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg p-1.5 transition hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer group"
              aria-label="User account menu"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-2xs transition-transform group-hover:scale-105">
                {initials ? initials : <User className="h-4.5 w-4.5" />}
                <span
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
                  title="Online"
                />
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {firstName}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {roleLabel}
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground md:block" />
            </button>
          }
        />

        <DropdownMenuContent
          align="end"
          className="w-72 min-w-[18rem] p-2 shadow-2xl border border-border/80 bg-popover rounded-2xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Profile & Email Header with subtle User Icon */}
          <div className="p-3.5 bg-muted/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary shadow-2xs">
                <User className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight text-foreground truncate">
                  {fullName}
                </p>
                <div className="pt-1 flex items-center gap-1.5">
                  <Badge
                    variant="brand"
                    className="text-[10px] px-1.5 py-0 font-semibold"
                  >
                    <ShieldCheck className="h-3 w-3 mr-0.5" />
                    {roleLabel}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 font-medium pt-0.5 border-t border-border/40">
              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{email}</span>
            </p>
          </div>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Account Settings */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/admin/billing/settings")}
              className="cursor-pointer font-semibold text-xs py-2.5 px-3 flex items-center gap-2.5 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Account Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Sign Out Option */}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer font-semibold text-xs py-2.5 px-3 flex items-center gap-2.5 rounded-lg text-rose-600 focus:bg-rose-500/10 focus:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog for Sign Out */}
      <AlertDialog
        open={showLogoutDialog}
        onOpenChange={(value) => {
          if (!value) setShowLogoutDialog(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto sm:mx-0 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
              <LogOut className="h-5 w-5" />
            </div>
            <AlertDialogTitle className="text-base font-bold">
              Sign out of Zowasel Admin?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to end your current admin session? You will
              be redirected to the sign-in page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => setShowLogoutDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
