"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Header from "./Header";
import PageContainer from "./PageContainer";
import { PageHeaderProvider } from "./PageHeaderContext";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

const STORAGE_KEY = "sidebar-collapsed";

const MemoizedPageContent = memo(function MemoizedPageContent({ children }: { children: React.ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
});

export default function DashboardLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Deliberate: localStorage isn't available during SSR, so the real
    // collapsed state can only be read after mount — the `mounted` flag is
    // what keeps the server-rendered markup hydration-safe in the meantime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <PageHeaderProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar collapsed={mounted ? collapsed : false} onToggle={toggleSidebar} />

        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          <Header onToggle={toggleSidebar} />

          <MemoizedPageContent>{children}</MemoizedPageContent>
        </div>
      </div>
    </PageHeaderProvider>
  );
}