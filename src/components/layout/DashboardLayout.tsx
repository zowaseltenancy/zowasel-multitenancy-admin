"use client";

import { useState } from "react";

import Header from "./Header";
import PageContainer from "./PageContainer";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
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

    localStorage.setItem(
      "sidebar-collapsed",
      JSON.stringify(next)
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <Header onToggle={toggleSidebar} />

        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}