'use client';

import { Loader2 } from 'lucide-react';
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

  const {
    mounted,
    isFetching,
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
  } = useDirectoryPage();

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
        isFetching={isFetching}
      />

      {/* Dimmed, not unmounted: the rows for the previous filter stay put and
          in place while the next set loads, so the table does not collapse to
          an empty state and the search box keeps focus. */}
      <div
        aria-busy={isFetching}
        className={
          isFetching
            ? 'opacity-60 transition-opacity duration-200 pointer-events-none'
            : 'transition-opacity duration-200'
        }
      >
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
      </div>

      <DirectoryModals
        modalState={modalState}
        roles={roles}
        departments={departments}
      />
    </div>
  );
}