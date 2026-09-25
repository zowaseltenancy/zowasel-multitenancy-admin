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
  // The onboarding form sets personalInfo.avatarUrl from the webcam/upload
  // step; the schema never declared it, so every setValue/watch on that path
  // failed to typecheck.
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

// Two distinct shapes, because several arrays use `.default([])`:
//
//   z.input  — what the form holds while editing. The defaulted fields are
//              optional, and this is what useForm is instantiated with, so it
//              is what register/watch/setValue are typed on.
//   z.output — what the resolver produces on submit, with defaults applied,
//              so those same fields are required.
//
// StaffFormValues is the input shape because that is what every step component
// receives from the form. Mixing the two is what made UseFormRegister and
// UseFormSetValue mutually unassignable across the onboarding components.
export type StaffFormValues = z.input<typeof staffFormSchema>;

/** The resolved payload handed to onSubmit, with `.default([])` applied. */
export type StaffFormSubmitValues = z.output<typeof staffFormSchema>;

// ── Edit mode ────────────────────────────────────────────────────────────────
// The staff edit screen renders this same form against an existing record, but
// the staff endpoint stores only part of it — there is no column for date of
// birth, home address, phone or joining date, so the screen has no way to fill
// those in.
//
// Validating them anyway made "Save Changes" impossible to submit: the resolver
// rejected six fields seeded empty, and the review stage renders no error UI,
// so the button silently did nothing on every edit.
//
// Every format rule is kept — an email still has to be an email — and only the
// required-ness of fields the record cannot hold is dropped. Name and email
// stay required because they are always seeded from the record.
const notRequired = z.string().optional();

export const staffEditFormSchema = staffFormSchema.extend({
  personalInfo: personalInfoSchema.extend({
    phone:       notRequired,
    dateOfBirth: notRequired,
    gender:      notRequired,
  }),
  employment: employmentSchema.extend({
    // Blank for a staff member with no placement yet — which is exactly the
    // record an operator opens this screen to fix.
    roleId:        notRequired,
    department:    notRequired,
    dateOfJoining: notRequired,
  }),
  address: addressSchema.extend({
    line1:   notRequired,
    city:    notRequired,
    state:   notRequired,
    country: notRequired,
  }),
});