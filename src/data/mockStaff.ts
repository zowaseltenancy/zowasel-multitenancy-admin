import { StaffRole, StaffMember, LeaveRequest } from '@/types/staff';

// ---------- Permission Codes ----------
export const PERMISSION_CODES = {
  MANAGE_STAFF: 'manage_staff',
  APPROVE_KYB: 'approve_kyb',
  VIEW_FINANCE: 'view_finance',
  MANAGE_FINANCE: 'manage_finance',
  MANAGE_MODULES: 'manage_modules',
  BROADCAST: 'broadcast',
  VIEW_AUDIT: 'view_audit',
  MANAGE_ROLES: 'manage_roles',
} as const;

// ---------- Roles ----------
export const mockRoles: StaffRole[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: Object.values(PERMISSION_CODES),
    isSystemRole: true,
  },
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Can manage staff, approve KYB, view finance',
    permissions: [
      PERMISSION_CODES.MANAGE_STAFF,
      PERMISSION_CODES.APPROVE_KYB,
      PERMISSION_CODES.VIEW_FINANCE,
      PERMISSION_CODES.BROADCAST,
    ],
    isSystemRole: true,
  },
  {
    id: 'role-kyb-reviewer',
    name: 'KYB Reviewer',
    description: 'Reviews and approves KYB applications',
    permissions: [PERMISSION_CODES.APPROVE_KYB, PERMISSION_CODES.VIEW_AUDIT],
    isSystemRole: false,
  },
  {
    id: 'role-finance-manager',
    name: 'Finance Manager',
    description: 'Manages finance and billing',
    permissions: [PERMISSION_CODES.MANAGE_FINANCE, PERMISSION_CODES.VIEW_FINANCE],
    isSystemRole: false,
  },
  {
    id: 'role-support',
    name: 'Support Staff',
    description: 'Handles chat and support',
    permissions: [], // specific permissions like whatsapp:chat_read_assigned would be separate
    isSystemRole: false,
  },
];

// ---------- Staff Members ----------
export const mockStaff: StaffMember[] = [
  {
    id: 'staff-alice',
    firstName: 'Alice',
    lastName: 'Okonkwo',
    email: 'alice@zowasel.com',
    phone: '+2348012345678',
    department: 'Technology',
    roleId: 'role-super-admin',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?u=alice',
    dateJoined: '2025-01-15T08:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'staff-david',
    firstName: 'David',
    lastName: 'Okafor',
    email: 'david@zowasel.com',
    phone: '+2348023456789',
    department: 'Programs',
    roleId: 'role-kyb-reviewer',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    dateJoined: '2025-02-20T09:00:00Z',
    lastActive: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'staff-grace',
    firstName: 'Grace',
    lastName: 'Adebayo',
    email: 'grace@zowasel.com',
    phone: '+2348034567890',
    department: 'Sales',
    roleId: 'role-finance-manager',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?u=grace',
    dateJoined: '2025-03-10T10:00:00Z',
    lastActive: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'staff-ibrahim',
    firstName: 'Ibrahim',
    lastName: 'Sule',
    email: 'ibrahim@zowasel.com',
    phone: '+2348045678901',
    department: 'Finance',
    roleId: 'role-support',
    status: 'inactive',
    avatarUrl: 'https://i.pravatar.cc/150?u=ibrahim',
    dateJoined: '2025-04-05T11:00:00Z',
    lastActive: new Date(Date.now() - 86400000).toISOString(),
  },
];

// ---------- Leave Requests (sample) ----------
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    staffId: 'staff-david',
    startDate: '2025-08-10',
    endDate: '2025-08-12',
    reason: 'Family engagement',
    status: 'pending',
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-01T10:00:00Z',
  },
  {
    id: 'leave-2',
    staffId: 'staff-grace',
    startDate: '2025-08-15',
    endDate: '2025-08-16',
    reason: 'Medical appointment',
    status: 'approved',
    approvedBy: 'staff-alice',
    createdAt: '2025-08-02T09:00:00Z',
    updatedAt: '2025-08-03T08:00:00Z',
  },
];