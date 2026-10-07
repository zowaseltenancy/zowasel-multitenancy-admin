import { StaffMember, StaffRole, LeaveRequest, Department,DepartmentRole } from '@/types/staff';
import { mockRoles, mockStaff, mockLeaveRequests } from '@/data/mockStaff';

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
    const empty: StaffDB = { staff: [], roles: [], leaveRequests: [], departments: [], departmentRoles: [] };
    if (typeof window === 'undefined') return empty;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  }

  private writeDB(db: StaffDB) {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  init() {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      this.writeDB({
        staff: mockStaff,
        roles: mockRoles,
        leaveRequests: mockLeaveRequests,
        departments: [],
        departmentRoles: [],
      });
    }
  }

  // ---- Staff CRUD ----
  getAllStaff(): StaffMember[] {
    return this.readDB().staff;
  }

  getStaffById(id: string): StaffMember | undefined {
    return this.readDB().staff.find(s => s.id === id);
  }

  addStaff(staff: Omit<StaffMember, 'id' | 'dateJoined' | 'lastActive'>): StaffMember {
    const db = this.readDB();
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dateJoined: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    db.staff.push(newStaff);
    this.writeDB(db);
    return newStaff;
  }

  updateStaff(id: string, updates: Partial<StaffMember>) {
    const db = this.readDB();
    const idx = db.staff.findIndex(s => s.id === id);
    if (idx !== -1) {
      db.staff[idx] = { ...db.staff[idx], ...updates };
      this.writeDB(db);
    }
  }

  deleteStaff(id: string) {
    const db = this.readDB();
    db.staff = db.staff.filter(s => s.id !== id);
    this.writeDB(db);
  }

  // ---- Roles ----
  getRoles(): StaffRole[] {
    return this.readDB().roles;
  }

  addRole(role: Pick<StaffRole, 'name' | 'permissions'> & Partial<StaffRole>): StaffRole {
    const db = this.readDB();
    const newRole: StaffRole = {
      description: '',
      isSystemRole: false,
      ...role,
      id: `role-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    db.roles.push(newRole);
    this.writeDB(db);
    return newRole;
  }

  updateRole(id: string, updates: Partial<StaffRole>) {
    const db = this.readDB();
    const idx = db.roles.findIndex(r => r.id === id);
    if (idx !== -1) {
      db.roles[idx] = { ...db.roles[idx], ...updates };
      this.writeDB(db);
    }
  }

  deleteRole(id: string) {
    const db = this.readDB();
    db.roles = db.roles.filter(r => r.id !== id);
    this.writeDB(db);
  }

  // ---- Departments ----
  getDepartments(): Department[] {
    return this.readDB().departments;
  }

  getDepartmentById(id: string): Department | undefined {
    return this.readDB().departments.find(d => d.id === id);
  }

  addDepartment(dept: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Department {
    const db = this.readDB();
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.departments.push(newDept);
    this.writeDB(db);
    return newDept;
  }

  updateDepartment(id: string, updates: Partial<Department>) {
    const db = this.readDB();
    const idx = db.departments.findIndex(d => d.id === id);
    if (idx !== -1) {
      db.departments[idx] = { ...db.departments[idx], ...updates, updatedAt: new Date().toISOString() };
      this.writeDB(db);
    }
  }

  deleteDepartment(id: string) {
    const db = this.readDB();
    db.departments = db.departments.filter(d => d.id !== id);
    this.writeDB(db);
  }

  // ---- Leave Requests ----
  getLeaveRequests(): LeaveRequest[] {
    return this.readDB().leaveRequests;
  }

  addLeaveRequest(req: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): LeaveRequest {
    const db = this.readDB();
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.leaveRequests.push(newReq);
    this.writeDB(db);
    return newReq;
  }

  updateLeaveRequest(id: string, updates: Partial<LeaveRequest>) {
    const db = this.readDB();
    const idx = db.leaveRequests.findIndex(r => r.id === id);
    if (idx !== -1) {
      db.leaveRequests[idx] = { ...db.leaveRequests[idx], ...updates, updatedAt: new Date().toISOString() };
      this.writeDB(db);
    }
  }

  
  // StaffRepository.ts
  getDepartmentRoles(departmentId?: string): DepartmentRole[] {
    const db = this.readDB();
    if (departmentId) {
      return db.departmentRoles.filter(r => r.departmentId === departmentId);
    }
    return db.departmentRoles;
  }

  addDepartmentRole(role: Omit<DepartmentRole, 'id'>): DepartmentRole {
    const db = this.readDB();
    const newRole: DepartmentRole = {
      ...role,
      id: `drole-${Date.now()}`,
    };
    db.departmentRoles.push(newRole);
    this.writeDB(db);
    return newRole;
  }

  updateDepartmentRole(id: string, updates: Partial<DepartmentRole>) {
    const db = this.readDB();
    const idx = db.departmentRoles.findIndex(r => r.id === id);
    if (idx !== -1) {
      db.departmentRoles[idx] = { ...db.departmentRoles[idx], ...updates };
      this.writeDB(db);
    }
  }

  deleteDepartmentRole(id: string) {
    const db = this.readDB();
    db.departmentRoles = db.departmentRoles.filter(r => r.id !== id);
    this.writeDB(db);
  }
}
