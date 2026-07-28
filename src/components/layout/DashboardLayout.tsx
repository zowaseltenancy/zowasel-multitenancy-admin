"use client";

import { useSyncExternalStore, useCallback } from "react";

import Header from "./Header";
import PageContainer from "./PageContainer";
import { PageHeaderProvider } from "./PageHeaderContext";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

const STORAGE_KEY = "sidebar-collapsed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "false";
  return localStorage.getItem(STORAGE_KEY) || "false";
}

function getServerSnapshot(): string {
  return "false";
}

export default function DashboardLayout({ children }: Props) {
  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const collapsed = storedValue === "true";

  const toggleSidebar = useCallback(() => {
    const next = !collapsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  }, [collapsed]);

  return (
    <PageHeaderProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          <Header onToggle={toggleSidebar} />

          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </PageHeaderProvider>
  );
}