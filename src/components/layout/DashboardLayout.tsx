"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import PageContainer from "./PageContainer";
import { PageHeaderProvider } from "./PageHeaderContext";
import Sidebar from "./Sidebar";
import { resolvePageTitle } from "./usePageTitle";
import { FloatingChatButton } from "@/components/FloatingButton";

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
  const pathname = usePathname();

  useEffect(() => {
    // One shared resolver covers every route's tab title instead of each of
    // the 101 pages needing its own — pages are all client components, so
    // none of them can export Next's `metadata` API directly. Confirmed via
    // direct measurement: Next's own metadata reconciliation (which resolves
    // to the root layout's static title, since no page defines its own)
    // keeps reasserting the root title about a second after every
    // navigation — a one-shot `document.title =` here gets overwritten
    // right back. A MutationObserver holding the line is what actually wins.
    const title = `${resolvePageTitle(pathname)} · Zowasel Admin`;
    document.title = title;

    const observer = new MutationObserver(() => {
      if (document.title !== title) {
        document.title = title;
      }
    });
    observer.observe(document.querySelector("title") ?? document.head, {
      subtree: true,
      characterData: true,
      childList: true,
    });

    return () => observer.disconnect();
  }, [pathname]);

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
      <FloatingChatButton />
    </PageHeaderProvider>
  );
}
