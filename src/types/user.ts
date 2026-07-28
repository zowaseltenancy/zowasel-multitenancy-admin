export type PlatformUserRole =
  | "Super Admin"
  | "Tenant Admin"
  | "Programme Manager"
  | "Field Supervisor"
  | "Field Agent"
  | "Agronomist"
  | "Data Analyst"
  | "Farmer (Self-service)";

export type UserAccountStatus = "active" | "inactive" | "pending" | "suspended";

export interface UserModulePermission {
  moduleKey: string;
  moduleName: string;
  read: boolean;
  write: boolean;
  approve: boolean;
  delete: boolean;
}

export interface AgentMetaData {
  coverageArea?: string;
  assignedFarmersCount?: number;
  totalSurveysSubmitted?: number;
  assignedProjectsCount?: number;
  specialization?: string;
}

export interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: PlatformUserRole;
  status: UserAccountStatus;
  organizationId: string;
  organizationName: string;
  avatarUrl?: string;
  dateJoined: string;
  lastActive: string;
  permissions: UserModulePermission[];
  agentMeta?: AgentMetaData;
}
