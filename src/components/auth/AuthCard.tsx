import { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full rounded-3xl border border-border/70 bg-card shadow-2xl shadow-black/5">      <CardContent className="space-y-8 p-10">
        {children}
      </CardContent>
    </Card>
  );
}