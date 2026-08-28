"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { getAdminAccessToken } from "@/lib/auth-session";

// Gate for the /admin shell.
//
// This is a UX gate, NOT a security boundary — the access token lives in
// localStorage so only the client can read it, and anyone can edit
// localStorage. The real boundary is auth-service, which rejects every
// unauthenticated request with 401 (verified: a wrong password returns
// INVALID_CREDENTIALS). What this stops is navigating straight to /admin and
// being shown an empty shell that then 401s on every request.
//
// Checked in an effect rather than during render because localStorage does not
// exist on the server, and reading it during render would mismatch hydration.
export default function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    if (getAdminAccessToken()) {
      setState("allowed");
      return;
    }
    // replace(), not push() — a signed-out user should not be able to go
    // "back" into the shell.
    router.replace("/login");
  }, [router]);

  if (state === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  return <>{children}</>;
}
