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

export const DEPARTMENTS_LIST = [
  'Executive',
  'Technology',
  'Programs',
  'Fintech',
  'Sales',
  'Finance',
  'Administration',
  'Compliance',
  'Regional Operations',
] as const;