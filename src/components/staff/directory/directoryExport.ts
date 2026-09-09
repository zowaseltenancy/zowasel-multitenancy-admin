import { exportToCsv, exportToExcel, exportToPdf } from '@/lib/export';
import { StaffMember, StaffRole } from '@/types/staff';
import { toast } from 'sonner';

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export function getExportDataset(filtered: StaffMember[], roles: StaffRole[]) {
  const headers = ['Staff ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Role', 'Status', 'Date Joined', 'Location'];
  const rows = filtered.map((s) => {
    const roleName = roles.find((r) => r.id === s.roleId)?.name || s.roleId || '';
    const employeeId = s.employeeId || `STA-${s.id.slice(-5).toUpperCase()}`;
    return [
      employeeId,
      s.firstName || '',
      s.lastName || '',
      s.email || '',
      s.phone || '',
      s.department || '',
      roleName,
      s.status || '',
      formatDate(s.dateJoined),
      s.workLocation || '',
    ];
  });
  return { headers, rows };
}

export function handleExportCSV(filtered: StaffMember[], roles: StaffRole[]) {
  try {
    const { headers, rows } = getExportDataset(filtered, roles);
    exportToCsv({ title: 'Zowasel_Staff_Directory', headers, rows });
    toast.success('CSV Export downloaded successfully');
  } catch (err) {
    console.error('Failed to export CSV:', err);
    toast.error('Failed to export CSV');
  }
}

export async function handleExportExcel(filtered: StaffMember[], roles: StaffRole[]) {
  try {
    const { headers, rows } = getExportDataset(filtered, roles);
    await exportToExcel({ title: 'Zowasel_Staff_Directory', headers, rows });
    toast.success('Excel spreadsheet downloaded successfully');
  } catch (err) {
    console.error('Failed to export Excel:', err);
    toast.error('Failed to export Excel');
  }
}

export async function handleExportPDF(filtered: StaffMember[], roles: StaffRole[]) {
  try {
    const headers = ['Staff ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Date Joined'];
    const rows = filtered.map((s) => {
      const roleName = roles.find((r) => r.id === s.roleId)?.name || s.roleId || '';
      const employeeId = s.employeeId || `STA-${s.id.slice(-5).toUpperCase()}`;
      return [
        employeeId,
        `${s.firstName || ''} ${s.lastName || ''}`.trim(),
        s.email || '',
        s.department || '',
        roleName,
        s.status || '',
        formatDate(s.dateJoined),
      ];
    });
    await exportToPdf({ title: 'Zowasel Staff Directory', headers, rows });
    toast.success('PDF document downloaded successfully');
  } catch (err) {
    console.error('Failed to export PDF:', err);
    toast.error('Failed to export PDF');
  }
}
