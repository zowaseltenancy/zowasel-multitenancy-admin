"use client";

import { use } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import UserDetailView from "@/features/users/components/UserDetailView";
import { usePlatformUser } from "@/features/users/hooks/usePlatformUsers";
import { mockUsers } from "@/features/users/data/mockUsers";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  params: Promise<{
    userId: string;
  }>;
}

// A client component now, because the account comes from GET /admin/users/{id}
// and that call is authenticated with the browser session's bearer token —
// which a server component has no access to. This page used to read mockUsers
// directly and 404 on anything not in the fixture, so it could never show a
// real user at all.
export default function UserDetailPage({ params }: Props) {
  const { userId } = use(params);
  const { user, isLoading, error } = usePlatformUser(userId);

  // The category directories still list fixture rows (their filters have no
  // server-side source — see platform-users.mappers), and those rows link
  // here with ids the API has never heard of. Falling back keeps those links
  // working instead of 404ing on data the console itself put on screen.
  const sample = mockUsers.find((u) => u.id === userId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const resolved = user ?? sample;

  if (!resolved) {
    return (
      <Card className="mx-auto mt-12 max-w-xl border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-start gap-3 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">User not found</p>
            <p className="text-sm text-muted-foreground">
              {error ?? `No account matches ${userId}.`}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <UserDetailView user={resolved} />;
}
