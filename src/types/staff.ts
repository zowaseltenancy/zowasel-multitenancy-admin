export type StaffRole = {
  id: string;
  name: string;          // e.g. "Super Admin", "KYB Reviewer"
  description: string;
  permissions: string[]; // permission codes like "approve_kyb", "manage_staff"
  isSystemRole: boolean; // cannot be deleted
};

export type StaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;    // "Technology", "Programs", etc.
  roleId: string;        // FK to StaffRole
  status: 'active' | 'inactive' | 'suspended';
  avatarUrl?: string;
  dateJoined: string;
  lastActive: string;
  countryCode?: string;
};

export type LeaveRequest = {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;  // staffId of approver
  createdAt: string;
  updatedAt: string;
};