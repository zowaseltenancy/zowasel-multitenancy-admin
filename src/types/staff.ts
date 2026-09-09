export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  roleId: string;
  // 'pending' matches the option the staff form offers for someone invited
  // but not yet activated; the union previously omitted it, so saving that
  // choice could not typecheck.
  status: 'active' | 'inactive' | 'pending';
  avatarUrl?: string;
  dateJoined?: string;
  lastActive?: string;

  // New fields for biodata
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: string;
  nationality?: string;
  employeeId?: string;
  managerId?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract';
  workLocation?: string;

  // Department-scoped roles assigned to this member, distinct from the single
  // `roleId` above. Read by the profile view and the detail page.
  departmentRoleIds?: string[];

  // Populated by the onboarding form, which collects biodata under this key
  // before it is flattened onto the record. Only the fields actually read
  // elsewhere are declared.
  personalInfo?: {
    avatarUrl?: string;
  };

  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };

  nextOfKin?: {
    fullName: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
  };

  education?: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startYear?: string;
    endYear?: string;
  }[];

  workExperience?: {
    company: string;
    jobTitle: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];

  bank?: {
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
    taxId?: string;
  };

  documents?: string[];   // file URLs or names
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Department
export interface Department {
  id: string;
  name: string;
  description: string;
  headId: string | null;        // staff member id
  headName?: string;            // denormalized for display
  staffCount?: number;          // denormalized
  createdAt: string;
  updatedAt: string;
}

// Department-specific Role
export interface DepartmentRole {
  id: string;
  departmentId: string;
  name: string;                 // e.g. "Lead Developer"
  permissions: Record<string, PermissionSet>; // key = module, e.g. "finance", "kyb"
}

export interface PermissionSet {
  read: boolean;
  write: boolean;
  approve: boolean;
  delete: boolean;
}

// Permission Matrix Module definition (for the grid)
export interface PermissionModule {
  key: string;      // e.g. "finance", "kyb", "staff"
  label: string;    // e.g. "Finance"
  icon?: React.ComponentType<{ className?: string }>;
}