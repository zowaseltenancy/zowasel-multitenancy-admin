'use client';

import { Loader2 } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { DirectoryHeader } from '@/components/staff/directory/DirectoryHeader';
import { DirectoryStatsCards } from '@/components/staff/directory/DirectoryStatsCards';
import { DirectoryFilterBar } from '@/components/staff/directory/DirectoryFilterBar';
import { DirectoryTable } from '@/components/staff/directory/DirectoryTable';
import { DirectoryModals } from '@/components/staff/directory/DirectoryModals';
import { useDirectoryPage, PAGE_SIZE } from '@/components/staff/directory/useDirectoryPage';
import {
  formatDate,
  handleExportCSV,
  handleExportExcel,
  handleExportPDF,
} from '@/components/staff/directory/directoryExport';

export default function StaffDirectoryPage() {
  const { repo, refresh } = useStaff();

  const {
    mounted,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    deptFilter,
    setDeptFilter,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    copiedId,
    roles,
    departments,
    stats,
    filtered,
    paginated,
    totalPages,
    hasActiveFilters,
    resetFilters,
    handleCopyId,
    handleStatusToggle,
    modalState,
    openRoleDialog,
    openDeptDialog,
    openMessageDialog,
  } = useDirectoryPage(repo, refresh);

  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <DirectoryHeader
        onExportCSV={() => handleExportCSV(filtered, roles)}
        onExportExcel={() => handleExportExcel(filtered, roles)}
        onExportPDF={() => handleExportPDF(filtered, roles)}
      />

      <DirectoryStatsCards stats={stats} filteredCount={filtered.length} />

      <DirectoryFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        departments={departments}
        roles={roles}
        stats={stats}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
      />

      <DirectoryTable
        paginated={paginated}
        filteredLength={filtered.length}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        roles={roles}
        hasActiveFilters={hasActiveFilters}
        copiedId={copiedId}
        onPageChange={setPage}
        onResetFilters={resetFilters}
        onCopyId={handleCopyId}
        onOpenRoleDialog={openRoleDialog}
        onOpenDeptDialog={openDeptDialog}
        onOpenMessageDialog={openMessageDialog}
        onStatusToggle={handleStatusToggle}
        formatDate={formatDate}
      />

      <DirectoryModals
        modalState={modalState}
        roles={roles}
        departments={departments}
      />
    </div>
  );
}