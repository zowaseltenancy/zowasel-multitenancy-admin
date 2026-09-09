'use client';

import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle } from 'lucide-react';

interface DepartmentArchiveSectionProps {
  confirmDelete: boolean;
  onConfirmDeleteChange: (val: boolean) => void;
  onDelete: () => void;
}

export function DepartmentArchiveSection({
  confirmDelete,
  onConfirmDeleteChange,
  onDelete,
}: DepartmentArchiveSectionProps) {
  return (
    <div className="pt-2 border-t">
      {confirmDelete ? (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-destructive flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" /> Are you sure you want to archive this unit?
          </p>
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={onDelete}>
              Yes, Archive Unit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onConfirmDeleteChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2 h-8"
          onClick={() => onConfirmDeleteChange(true)}
        >
          <Trash2 className="h-3.5 w-3.5" /> Archive Department
        </Button>
      )}
    </div>
  );
}