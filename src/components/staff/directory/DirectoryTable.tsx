'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserX } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StaffMember, StaffRole } from '@/types/staff';
import { DirectoryTableHeader } from './DirectoryTableHeader';
import { DirectoryTableRow } from './DirectoryTableRow';
import { DirectoryPagination } from './DirectoryPagination';

interface DirectoryTableProps {
  paginated: StaffMember[];
  filteredLength: number;
  page: number;
  totalPages: number;
  pageSize: number;
  roles: StaffRole[];
  hasActiveFilters: boolean;
  copiedId: string | null;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onCopyId: (e: React.MouseEvent, id: string) => void;
  onOpenRoleDialog: (e: React.MouseEvent, staff: StaffMember) => void;
  onOpenDeptDialog: (e: React.MouseEvent, staff: StaffMember) => void;
  onOpenMessageDialog: (e: React.MouseEvent, staff: StaffMember) => void;
  onStatusToggle: (e: React.MouseEvent, staff: StaffMember) => void;
  formatDate: (dateStr?: string) => string;
}

export function DirectoryTable({
  paginated,
  filteredLength,
  page,
  totalPages,
  pageSize,
  roles,
  hasActiveFilters,
  copiedId,
  onPageChange,
  onResetFilters,
  onCopyId,
  onOpenRoleDialog,
  onOpenDeptDialog,
  onOpenMessageDialog,
  onStatusToggle,
  formatDate,
}: DirectoryTableProps) {
  const router = useRouter();

  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs">
      <Table>
        <DirectoryTableHeader />
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-56 text-center">
                <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-muted-foreground">
                  <div className="h-12 w-12 rounded-2xl bg-muted/40 border flex items-center justify-center text-muted-foreground">
                    <UserX className="h-6 w-6 opacity-60" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">No personnel records found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {hasActiveFilters
                        ? 'No staff members match the current search or filter query. Try clearing filters.'
                        : 'No staff members exist in the repository yet. Onboard your first staff member.'}
                    </p>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onResetFilters}
                      className="h-8 text-xs mt-1 cursor-pointer"
                    >
                      Reset Search Filters
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((staff) => {
              const roleName = roles.find((r) => r.id === staff.roleId)?.name || staff.roleId || 'Staff Member';
              return (
                <DirectoryTableRow
                  key={staff.id}
                  staff={staff}
                  roleName={roleName}
                  copiedId={copiedId}
                  onCopyId={onCopyId}
                  onRowClick={() => router.push(`/admin/staff/${staff.id}`)}
                  onViewProfile={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/staff/${staff.id}`);
                  }}
                  onEditStaff={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/staff/${staff.id}/edit`);
                  }}
                  onOpenRoleDialog={onOpenRoleDialog}
                  onOpenDeptDialog={onOpenDeptDialog}
                  onOpenMessageDialog={onOpenMessageDialog}
                  onStatusToggle={onStatusToggle}
                  formatDate={formatDate}
                />
              );
            })
          )}
        </TableBody>
      </Table>

      <DirectoryPagination
        filteredLength={filteredLength}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
