"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";

import { useAdminMe, useLogout } from "@/features/auth/hooks/useAuth";
import { getStoredAdmin } from "@/lib/auth-session";

// The signed-in admin, from GET /admin/me.
//
// This was hardcoded to "BS / Busayo / Super Admin" — it showed the same person
// whoever was actually signed in. `useAdminMe` already existed and nothing
// called it, the same way `useLogin` was orphaned before the login page was
// wired.
//
// Also adds sign-out: there was no way to log out anywhere in the UI, which
// stopped mattering only while login was a mock that stored no session.

function initials(firstName: string | null, lastName: string | null, email: string): string {
  const letters = [firstName?.[0], lastName?.[0]].filter(Boolean).join("");
  // Falls back to the email when an invitation hasn't been accepted yet and
  // neither name is set.
  return (letters || email.slice(0, 2)).toUpperCase();
}

function roleLabel(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: me, isLoading } = useAdminMe();
  const logout = useLogout();

  // The login response is cached locally, so the menu can render immediately
  // and be corrected by /admin/me once it lands — no empty flash on every load.
  const stored = getStoredAdmin();
  const profile = me ?? stored;

  const handleSignOut = () => {
    logout.mutate(undefined, {
      // onSettled in the hook clears the session either way — a failed logout
      // call must still sign you out locally rather than trapping you here.
      onSettled: () => router.replace("/login"),
    });
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="hidden space-y-1 md:block">
          <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-muted/60"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-2xs">
          {initials(profile.firstName, profile.lastName, profile.email)}
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{roleLabel(profile.role)}</p>
        </div>

        <ChevronDown className="hidden size-4 text-muted-foreground md:block" />
      </button>

      {open && (
        <>
          {/* Click-away layer — closes the menu without a document listener. */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />

          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
          >
            <div className="border-b border-border p-3">
              <p className="truncate text-sm font-semibold text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{profile.email}</p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[11px] font-semibold">
                  <ShieldCheck className="size-3 text-primary" />
                  {roleLabel(profile.role)}
                </span>
                {me?.department ? (
                  <span className="inline-flex items-center rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[11px]">
                    {me.department.name}
                  </span>
                ) : null}
              </div>

              {/* A SUPER_ADMIN resolves to the single '*' wildcard rather than
                  an enumerated list, so show the count only when it is one. */}
              {me && !me.permissions.includes("*") ? (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {me.permissions.length} permission{me.permissions.length === 1 ? "" : "s"}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={logout.isPending}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted/60 disabled:opacity-60"
            >
              <LogOut className="size-4" />
              {logout.isPending ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
