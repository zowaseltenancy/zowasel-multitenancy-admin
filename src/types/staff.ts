export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobilenumber?: string;
  country?: string;
  employmenttype?: string;
  department: string;
  departmentId?: string;
  departmentObj?: { id: string; name: string } | null;
  roleId: string;
  systemRole?: 'super_admin' | 'admin' | 'staff' | string;
  roleIds?: string[];
  roles?: { id: string; name: string; description?: string }[];
  permissions?: string[];
  status: 'active' | 'inactive' | 'suspended' | 'invited' | string;
  statusHistory?: Array<{ status: string; at: string; reason?: string }>;
  manager?: { id: string; firstName: string | null; lastName: string | null; email?: string } | null;
  avatarUrl?: string;
  dateJoined?: string;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
  tempdelete?: number;
  deletedby?: string;

  // New fields for biodata
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: string;
  nationality?: string;
  employeeId?: string;
  managerId?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation?: string;

  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };

  nextOfKin?: {
    fullName?: string;
    relationship?: string;
    phone?: string;
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

  // Extended profile attributes (condex.docx)
  bio?: string;
  departmentRoleIds?: string[];
  projects?: StaffProject[];
  complianceDocuments?: StaffDocument[];
  performance?: StaffPerformance;
  activities?: StaffActivity[];

  documents?: string[];   // legacy file URLs or names
}

export interface StaffProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  startDate: string;
  endDate?: string;
  role?: string;
  progress?: number;
}

export interface StaffDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  url?: string;
}

export interface StaffActivity {
  id: string;
  type: 'profile_updated' | 'document_uploaded' | 'password_reset' | 'status_change' | 'review_completed' | 'role_assigned' | 'general';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface StaffPerformance {
  overallScore: number;
  status: string;
  goals: {
    id: string;
    title: string;
    target: string;
    progress: number;
    status: 'in-progress' | 'achieved' | 'behind';
  }[];
  kpis: {
    id: string;
    name: string;
    target: string;
    current: string;
    achievementRate: number;
  }[];
  reviews: {
    id: string;
    period: string;
    reviewer: string;
    date: string;
    rating: number;
    feedback: string;
  }[];
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  departmentId?: string | null;
  department?: { id: string; name: string } | null;
  assignedAdminCount?: number;
  userCount?: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type LeaveType =
  | 'ANNUAL'
  | 'SICK'
  | 'MATERNITY'
  | 'PATERNITY'
  | 'COMPASSIONATE'
  | 'UNPAID'
  | 'Annual'
  | 'Sick'
  | 'Casual'
  | 'Maternity/Paternity'
  | 'Bereavement'
  | 'Unpaid';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'pending' | 'approved' | 'rejected';

export interface LeaveBalance {
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'COMPASSIONATE' | 'UNPAID';
  year: number;
  entitledDays: number;
  usedDays: number;
  pendingDays: number;
  availableDays: number;
}

export interface CreateLeaveRequestDto {
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'COMPASSIONATE' | 'UNPAID' | LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ReviewLeaveDto {
  decision: 'APPROVED' | 'REJECTED';
  note?: string;
}

export interface ApiLeaveApplicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: {
    id: string;
    name: string;
  } | null;
}

export interface ApiLeaveReviewer {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ApiLeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | LeaveStatus;
  applicant: ApiLeaveApplicant;
  reviewedBy: ApiLeaveReviewer | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveCalendarEvent {
  id: string;
  type: LeaveType;
  status: 'APPROVED' | 'PENDING';
  startDate: string;
  endDate: string;
  days: number;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    department: {
      id: string;
      name: string;
    } | null;
  };
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  employeeName?: string;
  department?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  workingDays: number;
  days?: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  rejectionReason?: string;
  reviewNote?: string;
  reviewedAt?: string;
  attachment?: string;
  deducted?: boolean;
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
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Department-specific Role (Aligned with backend Custom Role & Permission Matrix API)
export interface DepartmentRole {
  id: string;
  departmentId: string;
  name: string;
  description?: string;
  permissions: string[] | Record<string, PermissionSet>;
  isSystemRole?: boolean;
  assignedAdminCount?: number;
  userCount?: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
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