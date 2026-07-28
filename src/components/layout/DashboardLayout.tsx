"use client";

import { useState } from "react";

import Header from "./Header";
import PageContainer from "./PageContainer";
import { PageHeaderProvider } from "./PageHeaderContext";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const stored = localStorage.getItem("sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
  };

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