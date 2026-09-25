import * as z from 'zod';

export const staffSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department required'),
  roleId: z.string().min(1, 'Role required'),
  status: z.enum(['active', 'inactive', 'pending']),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

// DEPARTMENTS_LIST is gone. Departments are database rows created through
// /admin/departments, so the form takes them as a prop — a fixed list here
// offered names that mostly did not exist, and names cannot be submitted to an
// endpoint that stores departmentId.