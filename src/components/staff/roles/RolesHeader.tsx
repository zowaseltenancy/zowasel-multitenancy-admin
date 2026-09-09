'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck2, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RolesHeaderProps {
  onOpenCreateRole: () => void;
}

export function RolesHeader({ onOpenCreateRole }: RolesHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-3 pb-1 border-b border-border/60">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <button
          type="button"
          onClick={() => router.push('/admin/staff/directory')}
          className="hover:text-foreground cursor-pointer"
        >
          Staff Management
        </button>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground font-semibold">Roles & Permissions</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Roles & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Define corporate roles, manage RBAC permissions, and inspect security access matrices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/staff/permissions')}
            className="h-9 px-3 text-xs gap-1.5 shadow-2xs"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-muted-foreground" /> Permissions Audit
          </Button>
          <Button
            size="sm"
            onClick={onOpenCreateRole}
            className="h-9 px-3.5 bg-[#44883C] hover:bg-[#3b7434] text-white font-bold gap-1.5 text-xs sm:text-sm cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" /> Create Custom Role
          </Button>
        </div>
      </div>
    </div>
  );
}
