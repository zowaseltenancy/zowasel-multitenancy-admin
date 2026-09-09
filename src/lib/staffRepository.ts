import { StaffMember, StaffRole, LeaveRequest, LeaveStatus, Department, DepartmentRole } from '@/types/staff';
import { mockRoles, mockStaff, mockLeaveRequests, mockDepartments, mockDepartmentRoles } from '@/data/mockStaff';

interface StaffDB {
  staff: StaffMember[];
  roles: StaffRole[];
  leaveRequests: LeaveRequest[];
  departments: Department[];
  departmentRoles: DepartmentRole[];
}

const STORAGE_KEY = 'staff_management_db';

export class StaffRepository {
  private readDB(): StaffDB {
    const empty: StaffDB = {
      staff: mockStaff,
      roles: mockRoles,
      leaveRequests: mockLeaveRequests,
      departments: mockDepartments,
      departmentRoles: mockDepartmentRoles,
    };
    if (typeof window === 'undefined') return empty;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      return {
        staff: Array.isArray(parsed?.staff) && parsed.staff.length > 0 ? parsed.staff : mockStaff,
        roles: Array.isArray(parsed?.roles) && parsed.roles.length > 0 ? parsed.roles : mockRoles,
        leaveRequests: Array.isArray(parsed?.leaveRequests) ? parsed.leaveRequests : mockLeaveRequests,
        departments: Array.isArray(parsed?.departments) && parsed.departments.length > 0 ? parsed.departments : mockDepartments,
        departmentRoles: Array.isArray(parsed?.departmentRoles) && parsed.departmentRoles.length > 0 ? parsed.departmentRoles : mockDepartmentRoles,
      };
    } catch {
      return empty;
    }
  }

  private writeDB(db: StaffDB) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      } catch (e) {
        console.error('Failed to write staff repository to localStorage', e);
      }
    }
  }

  init() {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        this.writeDB({
          staff: mockStaff,
          roles: mockRoles,
          leaveRequests: mockLeaveRequests,
          departments: mockDepartments,
          departmentRoles: mockDepartmentRoles,
        });
      }
    }
  }

  // ---- Staff CRUD ----
  getAllStaff(): StaffMember[] {
    return this.readDB().staff || [];
  }

  getStaffById(id: string): StaffMember | undefined {
    return this.getAllStaff().find(s => s && s.id === id);
  }

  addStaff(staff: Omit<StaffMember, 'id' | 'dateJoined' | 'lastActive'>): StaffMember {
    const db = this.readDB();
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dateJoined: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    db.staff = db.staff || [];
    db.staff.push(newStaff);
    this.writeDB(db);
    return newStaff;
  }

  updateStaff(id: string, updates: Partial<StaffMember>) {
    const db = this.readDB();
    db.staff = db.staff || [];
    const idx = db.staff.findIndex(s => s && s.id === id);
    if (idx !== -1) {
      db.staff[idx] = { ...db.staff[idx], ...updates };
      this.writeDB(db);
    }
  }

  deleteStaff(id: string) {
    const db = this.readDB();
    db.staff = (db.staff || []).filter(s => s && s.id !== id);
    this.writeDB(db);
  }

  // ---- Roles ----
  getRoles(): StaffRole[] {
    return this.readDB().roles || [];
  }

  getRoleById(id: string): StaffRole | undefined {
    return this.getRoles().find(r => r && r.id === id);
  }

  addRole(role: Omit<StaffRole, 'id'>): StaffRole {
    const db = this.readDB();
    const newRole: StaffRole = {
      ...role,
      id: `role-${Date.now()}`,
    };
    db.roles = db.roles || [];
    db.roles.push(newRole);
    this.writeDB(db);
    return newRole;
  }

  updateRole(id: string, updates: Partial<StaffRole>) {
    const db = this.readDB();
    db.roles = db.roles || [];
    const idx = db.roles.findIndex(r => r && r.id === id);
    if (idx !== -1) {
      db.roles[idx] = { ...db.roles[idx], ...updates, updatedAt: new Date().toISOString() };
      this.writeDB(db);
    }
  }

  updateRolePermissions(roleId: string, permissionKeys: string[]) {
    // Implements PUT /api/v1/admin/roles/:id/permissions
    return this.updateRole(roleId, { permissions: permissionKeys });
  }

  deleteRole(id: string): { success: boolean; message: string } {
    const db = this.readDB();
    const role = (db.roles || []).find(r => r && r.id === id);
    if (!role) return { success: false, message: 'Role not found' };
    if (role.isSystemRole) return { success: false, message: 'System core roles cannot be deleted' };

    // Check if staff assigned
    const assignedStaff = (db.staff || []).filter(s => s && (s.roleId === id || (s.roleIds || []).includes(id)));
    if (assignedStaff.length > 0) {
      return { success: false, message: `Cannot delete role. ${assignedStaff.length} staff member(s) currently assigned. Reassign staff first.` };
    }

    // Soft delete (archive) per backend spec
    db.roles = (db.roles || []).map(r => r.id === id ? { ...r, isArchived: true } : r);
    this.writeDB(db);
    return { success: true, message: 'Role archived successfully' };
  }

  updateStaffSystemRole(staffId: string, systemRole: 'super_admin' | 'admin' | 'staff') {
    // Implements PATCH /admin/staff/:id/system-role
    this.updateStaff(staffId, { systemRole });
  }

  updateStaffRoles(staffId: string, roleIds: string[]) {
    // Implements PUT /admin/staff/:id/roles
    const db = this.readDB();
    const allRoles = db.roles || [];
    const resolvedRoles = allRoles
      .filter(r => roleIds.includes(r.id))
      .map(r => ({ id: r.id, name: r.name }));
    const resolvedPermissions = Array.from(
      new Set(allRoles.filter(r => roleIds.includes(r.id)).flatMap(r => r.permissions || []))
    );

    this.updateStaff(staffId, {
      roleIds,
      roleId: roleIds[0] || 'role-staff', // backward compatibility
      roles: resolvedRoles,
      permissions: resolvedPermissions,
    });
  }

  // Role writes, mirroring the department-role CRUD further down. The roles
  // screen already calls these; only the reads existed, so the page could list
  // roles but not save one.
  // ---- Departments ----
  getDepartments(): Department[] {
    return this.readDB().departments || [];
  }

  getDepartmentById(id: string): Department | undefined {
    return this.getDepartments().find(d => d && d.id === id);
  }

  addDepartment(dept: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Department {
    const db = this.readDB();
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.departments = db.departments || [];
    db.departments.push(newDept);
    this.writeDB(db);
    return newDept;
  }

  updateDepartment(id: string, updates: Partial<Department>) {
    const db = this.readDB();
    db.departments = db.departments || [];
    const idx = db.departments.findIndex(d => d && d.id === id);
    if (idx !== -1) {
      db.departments[idx] = { ...db.departments[idx], ...updates, updatedAt: new Date().toISOString() };
      this.writeDB(db);
    }
  }

  deleteDepartment(id: string) {
    const db = this.readDB();
    db.departments = (db.departments || []).filter(d => d && d.id !== id);
    this.writeDB(db);
  }

  // ---- Leave Requests ----
  getLeaveRequests(): LeaveRequest[] {
    return this.readDB().leaveRequests || [];
  }

  addLeaveRequest(req: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): LeaveRequest {
    const db = this.readDB();
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.leaveRequests = db.leaveRequests || [];
    db.leaveRequests.push(newReq);
    this.writeDB(db);
    return newReq;
  }

  updateLeaveRequest(id: string, updates: Partial<LeaveRequest>) {
    const db = this.readDB();
    db.leaveRequests = db.leaveRequests || [];
    const idx = db.leaveRequests.findIndex(r => r && r.id === id);
    if (idx !== -1) {
      db.leaveRequests[idx] = { ...db.leaveRequests[idx], ...updates, updatedAt: new Date().toISOString() };
      this.writeDB(db);
    }
  }

  updateLeaveStatus(
    id: string,
    status: LeaveStatus,
    reviewerId?: string,
    reviewerName?: string,
    rejectionReason?: string
  ): { success: boolean; message: string } {
    const db = this.readDB();
    const req = (db.leaveRequests || []).find(r => r && r.id === id);
    if (!req) return { success: false, message: 'Leave request not found' };

    // STRICT SELF-REVIEW BLOCK per Backend Spec (Zowasel SSO Backend Track, lines 1188 & 1322)
    if (reviewerId && req.staffId === reviewerId) {
      return { success: false, message: 'Self-review is strictly blocked: Applicant cannot approve their own leave request.' };
    }

    req.status = status;
    req.approvedBy = reviewerName || req.approvedBy;
    if (status === 'rejected' && rejectionReason) {
      req.rejectionReason = rejectionReason;
    }
    req.updatedAt = new Date().toISOString();

    // AUTO-DEDUCT BALANCE per Backend Spec (line 1188)
    if (status === 'approved' && !req.deducted) {
      req.deducted = true;
    }

    this.writeDB(db);
    return { success: true, message: `Leave request ${status} successfully` };
  }

  deleteLeaveRequest(id: string) {
    const db = this.readDB();
    db.leaveRequests = (db.leaveRequests || []).filter(r => r && r.id !== id);
    this.writeDB(db);
  }

  // ---- Department Roles (Aligned with Custom Role & Permission Matrix API) ----
  // Returns DepartmentRole[], not the (DepartmentRole | StaffRole)[] union the
  // two sources suggest.
  //
  // The only field StaffRole types more loosely than DepartmentRole requires is
  // `departmentId` (optional and nullable there, required here) — and both
  // branches below filter on it being present, so every returned row satisfies
  // the narrower type. Asserting once here beats casting at each of the four
  // call sites, all of which declare their state as DepartmentRole[].
  getDepartmentRoles(departmentId?: string): DepartmentRole[] {
    const db = this.readDB();
    const allRoles = db.roles || [];
    // Roles with departmentId from the unified roles repository
    if (departmentId) {
      const unifiedDeptRoles = allRoles.filter(r => r && r.departmentId === departmentId);
      const legacyRoles = (db.departmentRoles || []).filter(r => r && r.departmentId === departmentId);
      return [...unifiedDeptRoles, ...legacyRoles] as DepartmentRole[];
    }
    return [
      ...allRoles.filter(r => r && r.departmentId),
      ...(db.departmentRoles || []),
    ] as DepartmentRole[];
  }

  addDepartmentRole(role: Omit<DepartmentRole, 'id'>): DepartmentRole {
    const db = this.readDB();
    const newRole: DepartmentRole = {
      ...role,
      id: `drole-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.departmentRoles = db.departmentRoles || [];
    db.departmentRoles.push(newRole);
    this.writeDB(db);
    return newRole;
  }

  updateDepartmentRole(id: string, updates: Partial<DepartmentRole>) {
    const db = this.readDB();
    db.departmentRoles = db.departmentRoles || [];
    const idx = db.departmentRoles.findIndex(r => r && r.id === id);
    if (idx !== -1) {
      db.departmentRoles[idx] = { ...db.departmentRoles[idx], ...updates, updatedAt: new Date().toISOString() };
      this.writeDB(db);
    }
  }

  deleteDepartmentRole(id: string) {
    const db = this.readDB();
    db.departmentRoles = (db.departmentRoles || []).filter(r => r && r.id !== id);
    this.writeDB(db);
  }
}

// ── Shared instance ──────────────────────────────────────────────────────────
// leaveService imports `staffRepository` as a module-level singleton. It is
// created lazily rather than at import time because the constructor's first
// read touches localStorage, which does not exist during server rendering.
//
// This is the same store the StaffProvider's own instance uses — both read and
// write the one `staff_management_db` key — so the two stay consistent.
let sharedRepository: StaffRepository | null = null;

export const staffRepository = new Proxy({} as StaffRepository, {
  get(_target, prop, receiver) {
    sharedRepository ??= new StaffRepository();
    const value = Reflect.get(sharedRepository, prop, receiver);
    return typeof value === 'function' ? value.bind(sharedRepository) : value;
  },
});
