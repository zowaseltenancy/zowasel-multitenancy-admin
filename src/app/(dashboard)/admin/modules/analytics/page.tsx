"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModulesAnalyticsHubPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/finance-hub");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <TrendingUp className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Finance Hub & BI Moved</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          The Analytics & Intelligence Hub has been promoted to a top-level primary navigation section called <strong className="text-foreground">Finance Hub</strong>.
        </p>
      </div>
      <Link href="/admin/finance-hub">
        <Button className="gap-2 font-bold cursor-pointer">
          <span>Go to Finance Hub</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
