import { z } from 'zod';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone must be at least 7 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const employmentSchema = z.object({
  roleId: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  managerId: z.string().optional(),
  employeeId: z.string().optional(),
  dateOfJoining: z.string().min(1, 'Joining date is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'intern']),
  workLocation: z.string().optional(),
});

const addressSchema = z.object({
  line1: z.string().min(1, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
});

const nextOfKinSchema = z.object({
  fullName: z.string().optional(),
  relationship: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
});

const educationEntrySchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
});

const workExperienceEntrySchema = z.object({
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const bankSchema = z.object({
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  sortCode: z.string().optional(),
  taxId: z.string().optional(),
});

export const staffFormSchema = z.object({
  personalInfo: personalInfoSchema,
  employment: employmentSchema,
  address: addressSchema,
  nextOfKin: nextOfKinSchema,
  education: z.array(educationEntrySchema).default([]),
  workExperience: z.array(workExperienceEntrySchema).default([]),
  bank: bankSchema.default({}),
  documents: z.array(z.any()).default([]),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;