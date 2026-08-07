"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalysisLandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/analysis/crm");
  }, [router]);

  return null;
}
