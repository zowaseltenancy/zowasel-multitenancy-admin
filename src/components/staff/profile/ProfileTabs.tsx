'use client';

import {
  LayoutDashboard,
  Building2,
  History,
} from 'lucide-react';

export type TabKey = 'overview' | 'department' | 'status_history';

interface ProfileTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  leaveCount?: number;
  rolesCount?: number;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'department', label: 'Department & Team', icon: Building2 },
    { key: 'status_history', label: 'Status & Audit History', icon: History },
  ];

  return (
    <div className="border-b border-border/60 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <nav className="flex items-center gap-1 sm:gap-2 min-w-max" aria-label="Staff Profile Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`group relative flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-medium transition-all cursor-pointer border-b-2 -mb-px ${
                isActive
                  ? 'text-[#00A651] dark:text-[#00C862] border-[#00A651] font-semibold'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors ${
                  isActive
                    ? 'text-[#00A651]'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
