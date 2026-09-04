'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export type TabView = 'cards' | 'matrix' | 'catalog';

interface RolesTabBarProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function RolesTabBar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: RolesTabBarProps) {
  const tabs: { id: TabView; label: string }[] = [
    { id: 'cards', label: 'Role Cards' },
    { id: 'matrix', label: 'Permissions Matrix' },
    { id: 'catalog', label: 'Catalogue Audit' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b pb-3">
      <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-2xs border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'cards' && (
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8.5 text-xs"
          />
        </div>
      )}
    </div>
  );
}
