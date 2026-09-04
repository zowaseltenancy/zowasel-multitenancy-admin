import { User, MapPin, Briefcase, ClipboardList } from 'lucide-react';
import { StaffFormValues } from '@/lib/validations/staff';

export const ONBOARDING_STAGES = [
  {
    id: 0,
    title: 'Personal Information & Identity',
    shortLabel: 'Personal Info',
    category: 'IDENTITY',
    estimate: '~1 min',
    description: "Capture the employee's personal identity, contact details, biodata, and headshot.",
    icon: User,
  },
  {
    id: 1,
    title: 'Residential Address & Next of Kin',
    shortLabel: 'Address & Kin',
    category: 'EMERGENCY',
    estimate: '~1 min',
    description: 'Provide permanent residential address and optional next of kin emergency contact.',
    icon: MapPin,
  },
  {
    id: 2,
    title: 'Corporate Placement & Payroll',
    shortLabel: 'Placement & Payroll',
    category: 'PLACEMENT',
    estimate: '~2 min',
    description: 'Configure corporate department, assigned role, employment type, and payroll disbursement account.',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'Final Dossier Review & Provisioning',
    shortLabel: 'Final Review',
    category: 'REVIEW',
    estimate: '~1 min',
    description: 'Review the complete employee onboarding profile before final corporate provisioning.',
    icon: ClipboardList,
  },
] as const;

export const STAGE_GUIDELINES: Record<number, string> = {
  0: 'Ensure official legal names and identification match government records. Attach an official profile headshot.',
  1: 'Enter the permanent residential address for official statutory records, and optionally designate a next of kin for emergencies.',
  2: 'Assigned corporate roles define permissions and reporting hierarchies. Disbursement accounts must belong to the staff member for statutory payroll clearing.',
  3: 'Perform a comprehensive final review of all onboarding dossiers before issuing staff credentials and system access provisioning.',
};

export interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
}

export const COUNTRY_DIAL_CODES: CountryCodeOption[] = [
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+225', country: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '+221', country: 'Senegal', flag: '🇸🇳' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
];

export const generateStaffId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `STA-${year}-${random}`;
};

export function getDefaultStaffFormValues(defaultValues?: Partial<StaffFormValues>) {
  return {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male' as const,
      maritalStatus: '',
      nationality: 'Nigerian',
      avatarUrl: '',
    },
    employment: {
      roleId: '',
      department: '',
      managerId: '',
      employeeId: defaultValues?.employment?.employeeId || generateStaffId(),
      dateOfJoining: '',
      employmentType: defaultValues?.employment?.employmentType || ('full-time' as const),
      workLocation: '',
    },
    address: { line1: '', line2: '', city: '', state: '', country: 'Nigeria', postalCode: '' },
    nextOfKin: { fullName: '', relationship: '', phone: '', email: '', address: '' },
    education: defaultValues?.education || [],
    workExperience: defaultValues?.workExperience || [],
    bank: { bankName: '', accountNumber: '', sortCode: '', taxId: '' },
    documents: [],
    ...defaultValues,
  };
}

export function formatStaffSubmitData(data: any, personalPhoneCode: string, kinPhoneCode: string): StaffFormValues {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      phone: data.personalInfo?.phone
        ? data.personalInfo.phone.startsWith('+')
          ? data.personalInfo.phone
          : `${personalPhoneCode} ${data.personalInfo.phone.trim()}`
        : '',
    },
    nextOfKin: {
      ...data.nextOfKin,
      phone: data.nextOfKin?.phone
        ? data.nextOfKin.phone.startsWith('+')
          ? data.nextOfKin.phone
          : `${kinPhoneCode} ${data.nextOfKin.phone.trim()}`
        : '',
    },
  };
}
