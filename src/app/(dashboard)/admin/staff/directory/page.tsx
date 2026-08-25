'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { StaffListTable } from '@/components/staff/StaffListTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Plus, Loader2 } from 'lucide-react';

export default function StaffDirectoryPage() {
  const { repo } = useStaff();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const router = useRouter();

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render data-dependent UI until mounted
  if (!mounted) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Staff Directory</h2>
            <p className="text-muted-foreground">Manage Zowasel internal staff</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // From here on, we are client‑side – localStorage is available
  const staffList = repo.getAllStaff();
  const roles = repo.getRoles();
  const departments = Array.from(new Set(staffList.map((s) => s.department))).sort();

  const filtered = staffList.filter((s) => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.roleId === roleFilter;
    const matchesDept = deptFilter === 'all' || s.department === deptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const exportToCSV = () => {
    const headers = 'Name,Email,Phone,Department,Role,Status';
    const rows = filtered.map((s) => {
      const roleName = roles.find((r) => r.id === s.roleId)?.name || '';
      return `"${s.firstName} ${s.lastName}","${s.email}","${s.phone}","${s.department}","${roleName}","${s.status}"`;
    });
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_directory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Directory</h2>
          <p className="text-muted-foreground">Manage Zowasel internal staff</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => router.push('/admin/staff/onboarding')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search name, email..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm w-[180px]"
        >
          <option value="all">All Roles</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Department filter */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm w-[200px]"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <StaffListTable staff={filtered} roles={roles} />
    </div>
  );
}