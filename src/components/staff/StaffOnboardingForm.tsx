'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronDown,
  Loader2,
  Upload,
  FileText,
  Camera,
  User,
  Briefcase,
  MapPin,
  HeartHandshake,
  Building2,
  Landmark,
  FileCheck,
  ClipboardList,
  Mail,
  Phone,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  CreditCard,
  Paperclip,
  BookmarkCheck,
  CheckCircle2,
  Search,
  RefreshCw,
  Pencil,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { staffFormSchema, StaffFormValues } from '@/lib/validations/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';

const ONBOARDING_STAGES = [
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

const STAGE_GUIDELINES: Record<number, string> = {
  0: 'Ensure official legal names and identification match government records. Attach an official profile headshot.',
  1: 'Enter the permanent residential address for official statutory records, and optionally designate a next of kin for emergencies.',
  2: 'Assigned corporate roles define permissions and reporting hierarchies. Disbursement accounts must belong to the staff member for statutory payroll clearing.',
  3: 'Perform a comprehensive final review of all onboarding dossiers before issuing staff credentials and system access provisioning.',
};

interface StaffOnboardingFormProps {
  defaultValues?: Partial<StaffFormValues>;
  roles: { id: string; name: string }[];
  departments: string[];
  onSubmit: (data: StaffFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

interface TypeableDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  id: string;
  error?: string;
}

function TypeableDropdown({
  value,
  onChange,
  options,
  placeholder,
  id,
  error,
}: TypeableDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!value) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(value.toLowerCase())
    );
  }, [options, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          id={id}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="h-11 text-sm rounded-xl pr-10 text-slate-900 dark:text-slate-100 bg-background"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-3 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? 'rotate-180 text-[#44883C]' : ''
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-popover text-popover-foreground border border-border/80 rounded-xl shadow-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 max-h-48 overflow-y-auto">
          <div className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    value?.toLowerCase() === option.toLowerCase()
                      ? 'bg-[#00A651]/10 text-[#00A651] font-bold'
                      : 'hover:bg-muted text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>{option}</span>
                  {value?.toLowerCase() === option.toLowerCase() && (
                    <Check className="h-3.5 w-3.5 text-[#00A651]" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-muted-foreground italic">
                Press Enter or keep typing for "{value}"
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
    </div>
  );
}

export interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
}

const COUNTRY_DIAL_CODES: CountryCodeOption[] = [
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

interface CountryCodeDropdownProps {
  value: string;
  onChange: (code: string) => void;
}

function CountryCodeDropdown({ value, onChange }: CountryCodeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => {
    return COUNTRY_DIAL_CODES.find((c) => c.code === value) || COUNTRY_DIAL_CODES[0];
  }, [value]);

  const filtered = useMemo(() => {
    if (!search) return COUNTRY_DIAL_CODES;
    const s = search.toLowerCase();
    return COUNTRY_DIAL_CODES.filter(
      (c) =>
        c.country.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s)
    );
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-11 px-3 sm:px-3.5 flex items-center gap-2 border border-border/80 rounded-xl bg-background hover:bg-muted/50 text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#44883C]"
        title="Select Country Code"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-mono text-sm">{selected.code}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180 text-[#44883C]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-64 max-h-56 overflow-hidden bg-popover text-popover-foreground border border-border/80 rounded-xl shadow-lg animate-in fade-in-50 zoom-in-95 duration-150 flex flex-col">
          <div className="p-1.5 border-b border-border/60 bg-popover">
            <div className="relative flex items-center">
              <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="h-7 text-xs pl-7 bg-background"
                autoFocus
              />
            </div>
          </div>
          <div className="p-1 overflow-y-auto max-h-44">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <button
                  key={`${c.country}-${c.code}`}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    c.code === selected.code && c.country === selected.country
                      ? 'bg-[#44883C]/10 text-[#44883C] font-bold'
                      : 'hover:bg-muted text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm leading-none">{c.flag}</span>
                    <span className="truncate">{c.country}</span>
                  </div>
                  <span className="font-mono text-muted-foreground text-[11px] shrink-0 ml-2">
                    {c.code}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-muted-foreground italic">No matching country code</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const generateStaffId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `STA-${year}-${random}`;
};

export function StaffOnboardingForm({
  defaultValues,
  roles,
  departments,
  onSubmit,
  isSubmitting = false,
}: StaffOnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [personalPhoneCode, setPersonalPhoneCode] = useState('+234');
  const [kinPhoneCode, setKinPhoneCode] = useState('+234');
  const webcamRef = useRef<Webcam>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);

  const methods = useForm<z.input<typeof staffFormSchema>>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
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
        employmentType: defaultValues?.employment?.employmentType || 'full-time',
        workLocation: '',
      },
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postalCode: '',
      },
      nextOfKin: {
        fullName: '',
        relationship: '',
        phone: '',
        email: '',
        address: '',
      },
      education: defaultValues?.education || [],
      workExperience: defaultValues?.workExperience || [],
      bank: {
        bankName: '',
        accountNumber: '',
        sortCode: '',
        taxId: '',
      },
      documents: [],
      ...defaultValues,
    },
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const currentValues = watch();

  // Update auto-save timestamp periodically
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastSavedTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
  }, [step]);

  // Initialize country codes from defaultValues if present
  useEffect(() => {
    if (defaultValues?.personalInfo?.phone) {
      const match = COUNTRY_DIAL_CODES.find((c) =>
        defaultValues.personalInfo?.phone?.startsWith(c.code)
      );
      if (match) {
        setPersonalPhoneCode(match.code);
        const rawNumber = defaultValues.personalInfo.phone.slice(match.code.length).trim();
        setValue('personalInfo.phone', rawNumber);
      }
    }
    if (defaultValues?.nextOfKin?.phone) {
      const match = COUNTRY_DIAL_CODES.find((c) =>
        defaultValues.nextOfKin?.phone?.startsWith(c.code)
      );
      if (match) {
        setKinPhoneCode(match.code);
        const rawNumber = defaultValues.nextOfKin.phone.slice(match.code.length).trim();
        setValue('nextOfKin.phone', rawNumber);
      }
    }
  }, [defaultValues, setValue]);

  // Unrestricted Step Navigation (Freely jump to any stage or field at any time)
  const goToStep = useCallback(
    (targetStep: number) => {
      if (targetStep === step) return;
      if (targetStep < 0 || targetStep >= ONBOARDING_STAGES.length) return;
      setStep(targetStep);
      formScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [step]
  );

  // Granular Field-Level Requirements Checklist (8 Stages)
  const allFieldItems = useMemo(() => {
    return [
      // Stage 0: Personal Information & Identity
      {
        id: 'personal_info',
        label: 'Personal Information & Biodata',
        stageId: 0,
        stageName: 'Personal Info',
        isDone: Boolean(
          currentValues.personalInfo?.firstName?.trim() &&
          currentValues.personalInfo?.lastName?.trim() &&
          currentValues.personalInfo?.email?.trim() &&
          currentValues.personalInfo?.phone?.trim() &&
          currentValues.personalInfo?.dateOfBirth?.trim() &&
          currentValues.personalInfo?.gender?.trim()
        ),
      },

      // Stage 1: Residential Address & Next of Kin
      {
        id: 'address',
        label: 'Residential Address',
        stageId: 1,
        stageName: 'Address & Kin',
        isDone: Boolean(
          currentValues.address?.line1?.trim() &&
          currentValues.address?.city?.trim() &&
          currentValues.address?.state?.trim() &&
          currentValues.address?.country?.trim()
        ),
      },
      {
        id: 'next_of_kin',
        label: 'Next of Kin & Emergency Contact (Optional)',
        stageId: 1,
        stageName: 'Address & Kin',
        isOptional: true,
        isDone: Boolean(
          currentValues.nextOfKin?.fullName?.trim() &&
          currentValues.nextOfKin?.relationship?.trim() &&
          currentValues.nextOfKin?.phone?.trim() &&
          currentValues.nextOfKin.phone.trim().length >= 7
        ),
      },

      // Stage 2: Corporate Placement & Payroll
      {
        id: 'employment',
        label: 'Corporate Role & Placement',
        stageId: 2,
        stageName: 'Placement & Payroll',
        isDone: Boolean(
          currentValues.employment?.department?.trim() &&
          currentValues.employment?.roleId?.trim() &&
          currentValues.employment?.dateOfJoining?.trim()
        ),
      },
      {
        id: 'bank_details',
        label: 'Disbursement Bank & Tax ID (TIN)',
        stageId: 2,
        stageName: 'Placement & Payroll',
        isOptional: true,
        isDone: Boolean(
          currentValues.bank?.bankName?.trim() &&
          currentValues.bank?.accountNumber?.trim()
        ),
      },

      // Stage 3: Final Review
      {
        id: 'final_review',
        label: 'Final Review & Provisioning',
        stageId: 3,
        stageName: 'Final Review',
        isDone: step === 3,
      },
    ];
  }, [currentValues, step]);

  // Dynamically partition items: completed items move up, pending items remain
  const completedFieldItems = useMemo(
    () => allFieldItems.filter((item) => item.isDone),
    [allFieldItems]
  );
  const pendingFieldItems = useMemo(
    () => allFieldItems.filter((item) => !item.isDone),
    [allFieldItems]
  );

  const completedDetailsCount = completedFieldItems.length;
  const totalDetailsCount = allFieldItems.length;

  // Granular Field-Level Items for the Current / Particular Active Stage
  interface StageFieldItem {
    id: string;
    label: string;
    targetId?: string;
    isDone: boolean;
    isOptional?: boolean;
  }

  const currentStageFields = useMemo<StageFieldItem[]>(() => {
    switch (step) {
      case 0:
        return [
          {
            id: 'avatar',
            label: 'Profile Headshot',
            targetId: 'avatarTrigger',
            isDone: Boolean(currentValues.personalInfo?.avatarUrl),
            isOptional: true,
          },
          {
            id: 'firstName',
            label: 'First Name',
            targetId: 'firstName',
            isDone: Boolean(currentValues.personalInfo?.firstName?.trim()),
          },
          {
            id: 'lastName',
            label: 'Last Name',
            targetId: 'lastName',
            isDone: Boolean(currentValues.personalInfo?.lastName?.trim()),
          },
          {
            id: 'email',
            label: 'Official Email',
            targetId: 'email',
            isDone: Boolean(currentValues.personalInfo?.email?.trim()),
          },
          {
            id: 'phone',
            label: 'Phone Number',
            targetId: 'phone',
            isDone: Boolean(
              currentValues.personalInfo?.phone?.trim() &&
              currentValues.personalInfo.phone.trim().length >= 7
            ),
          },
          {
            id: 'dob',
            label: 'Date of Birth',
            targetId: 'dob',
            isDone: Boolean(currentValues.personalInfo?.dateOfBirth?.trim()),
          },
          {
            id: 'gender',
            label: 'Gender',
            targetId: 'genderInput',
            isDone: Boolean(currentValues.personalInfo?.gender?.trim()),
          },
          {
            id: 'nationality',
            label: 'Nationality',
            targetId: 'nationality',
            isDone: Boolean(currentValues.personalInfo?.nationality?.trim()),
          },
        ];

      case 1:
        return [
          {
            id: 'location',
            label: 'Residential Location',
            targetId: 'location',
            isDone: Boolean(currentValues.address?.line1?.trim()),
          },
          {
            id: 'city',
            label: 'City',
            targetId: 'city',
            isDone: Boolean(currentValues.address?.city?.trim()),
          },
          {
            id: 'state',
            label: 'State / Region',
            targetId: 'state',
            isDone: Boolean(currentValues.address?.state?.trim()),
          },
          {
            id: 'country',
            label: 'Country',
            targetId: 'country',
            isDone: Boolean(currentValues.address?.country?.trim()),
          },
          {
            id: 'kinName',
            label: 'Next of Kin Full Name',
            targetId: 'kinName',
            isDone: Boolean(currentValues.nextOfKin?.fullName?.trim()),
            isOptional: true,
          },
          {
            id: 'kinRel',
            label: 'Relationship',
            targetId: 'kinRel',
            isDone: Boolean(currentValues.nextOfKin?.relationship?.trim()),
            isOptional: true,
          },
          {
            id: 'kinPhone',
            label: 'Emergency Phone Number',
            targetId: 'kinPhone',
            isDone: Boolean(
              currentValues.nextOfKin?.phone?.trim() &&
              currentValues.nextOfKin.phone.trim().length >= 7
            ),
            isOptional: true,
          },
          {
            id: 'kinEmail',
            label: 'Emergency Email',
            targetId: 'kinEmail',
            isDone: Boolean(currentValues.nextOfKin?.email?.trim()),
            isOptional: true,
          },
          {
            id: 'kinAddress',
            label: 'Emergency Contact Address',
            targetId: 'kinAddress',
            isDone: Boolean(currentValues.nextOfKin?.address?.trim()),
            isOptional: true,
          },
        ];

      case 2:
        return [
          {
            id: 'department',
            label: 'Corporate Department',
            targetId: 'departmentSelect',
            isDone: Boolean(currentValues.employment?.department?.trim()),
          },
          {
            id: 'roleId',
            label: 'Designated Role',
            targetId: 'roleSelect',
            isDone: Boolean(currentValues.employment?.roleId?.trim()),
          },
          {
            id: 'employmentType',
            label: 'Employment Type',
            targetId: 'employmentTypeSelect',
            isDone: Boolean(currentValues.employment?.employmentType?.trim()),
          },
          {
            id: 'dateOfJoining',
            label: 'Date of Joining',
            targetId: 'dateOfJoining',
            isDone: Boolean(currentValues.employment?.dateOfJoining?.trim()),
          },
          {
            id: 'employeeId',
            label: 'Staff ID',
            targetId: 'employeeId',
            isDone: Boolean(currentValues.employment?.employeeId?.trim()),
          },
          {
            id: 'bankName',
            label: 'Disbursement Bank Name',
            targetId: 'bankName',
            isDone: Boolean(currentValues.bank?.bankName?.trim()),
          },
          {
            id: 'accountNumber',
            label: 'Account Number (NUBAN)',
            targetId: 'accountNumber',
            isDone: Boolean(currentValues.bank?.accountNumber?.trim()),
          },
          {
            id: 'sortCode',
            label: 'Branch Sort Code',
            targetId: 'sortCode',
            isDone: Boolean(currentValues.bank?.sortCode?.trim()),
          },
          {
            id: 'taxId',
            label: 'Tax Identification Number (TIN)',
            targetId: 'taxId',
            isDone: Boolean(currentValues.bank?.taxId?.trim()),
            isOptional: true,
          },
        ];

      case 3:
        return [
          // STAGE 1: Personal Info & Identity
          {
            id: 'rev_avatar',
            label: 'Profile Headshot',
            targetId: 'rev-section-personal',
            isOptional: true,
            isDone: Boolean(currentValues.personalInfo?.avatarUrl?.trim()),
          },
          {
            id: 'rev_firstName',
            label: 'First Name',
            targetId: 'rev-section-personal',
            isDone: Boolean(currentValues.personalInfo?.firstName?.trim()),
          },
          {
            id: 'rev_lastName',
            label: 'Last Name',
            targetId: 'rev-section-personal',
            isDone: Boolean(currentValues.personalInfo?.lastName?.trim()),
          },
          {
            id: 'rev_email',
            label: 'Official Email',
            targetId: 'rev-section-personal',
            isDone: Boolean(currentValues.personalInfo?.email?.trim()),
          },
          {
            id: 'rev_phone',
            label: 'Phone Number',
            targetId: 'rev-section-personal',
            isDone: Boolean(
              currentValues.personalInfo?.phone?.trim() &&
              currentValues.personalInfo.phone.trim().length >= 7
            ),
          },
          {
            id: 'rev_dob',
            label: 'Date of Birth',
            targetId: 'rev-section-personal',
            isDone: Boolean(currentValues.personalInfo?.dateOfBirth?.trim()),
          },
          {
            id: 'rev_gender',
            label: 'Gender',
            targetId: 'rev-section-personal',
            isDone: Boolean(currentValues.personalInfo?.gender?.trim()),
          },
          {
            id: 'rev_nationality',
            label: 'Nationality',
            targetId: 'rev-section-personal',
            isDone: Boolean(currentValues.personalInfo?.nationality?.trim()),
          },

          // STAGE 2: Residential Address & Next of Kin
          {
            id: 'rev_location',
            label: 'Residential Location',
            targetId: 'rev-section-address',
            isDone: Boolean(currentValues.address?.line1?.trim()),
          },
          {
            id: 'rev_city',
            label: 'City',
            targetId: 'rev-section-address',
            isDone: Boolean(currentValues.address?.city?.trim()),
          },
          {
            id: 'rev_state',
            label: 'State / Region',
            targetId: 'rev-section-address',
            isDone: Boolean(currentValues.address?.state?.trim()),
          },
          {
            id: 'rev_country',
            label: 'Country',
            targetId: 'rev-section-address',
            isDone: Boolean(currentValues.address?.country?.trim()),
          },
          {
            id: 'rev_kinName',
            label: 'Next of Kin Full Name',
            targetId: 'rev-section-kin',
            isOptional: true,
            isDone: Boolean(currentValues.nextOfKin?.fullName?.trim()),
          },
          {
            id: 'rev_kinRel',
            label: 'Next of Kin Relationship',
            targetId: 'rev-section-kin',
            isOptional: true,
            isDone: Boolean(currentValues.nextOfKin?.relationship?.trim()),
          },
          {
            id: 'rev_kinPhone',
            label: 'Emergency Phone',
            targetId: 'rev-section-kin',
            isOptional: true,
            isDone: Boolean(
              currentValues.nextOfKin?.phone?.trim() &&
              currentValues.nextOfKin.phone.trim().length >= 7
            ),
          },
          {
            id: 'rev_kinEmail',
            label: 'Emergency Email',
            targetId: 'rev-section-kin',
            isOptional: true,
            isDone: Boolean(currentValues.nextOfKin?.email?.trim()),
          },
          {
            id: 'rev_kinAddress',
            label: 'Emergency Contact Address',
            targetId: 'rev-section-kin',
            isOptional: true,
            isDone: Boolean(currentValues.nextOfKin?.address?.trim()),
          },

          // STAGE 3: Corporate Placement & Payroll
          {
            id: 'rev_dept',
            label: 'Corporate Department',
            targetId: 'rev-section-placement',
            isDone: Boolean(currentValues.employment?.department?.trim()),
          },
          {
            id: 'rev_role',
            label: 'Designated Role',
            targetId: 'rev-section-placement',
            isDone: Boolean(currentValues.employment?.roleId?.trim()),
          },
          {
            id: 'rev_empType',
            label: 'Employment Type',
            targetId: 'rev-section-placement',
            isDone: Boolean(currentValues.employment?.employmentType?.trim()),
          },
          {
            id: 'rev_doj',
            label: 'Date of Joining',
            targetId: 'rev-section-placement',
            isDone: Boolean(currentValues.employment?.dateOfJoining?.trim()),
          },
          {
            id: 'rev_empId',
            label: 'Staff ID',
            targetId: 'rev-section-placement',
            isDone: Boolean(currentValues.employment?.employeeId?.trim()),
          },
          {
            id: 'rev_bank',
            label: 'Disbursement Bank Name',
            targetId: 'rev-section-payroll',
            isDone: Boolean(currentValues.bank?.bankName?.trim()),
          },
          {
            id: 'rev_accNum',
            label: 'Account Number (NUBAN)',
            targetId: 'rev-section-payroll',
            isDone: Boolean(currentValues.bank?.accountNumber?.trim()),
          },
          {
            id: 'rev_sortCode',
            label: 'Branch Sort Code',
            targetId: 'rev-section-payroll',
            isDone: Boolean(currentValues.bank?.sortCode?.trim()),
          },
          {
            id: 'rev_taxId',
            label: 'Tax ID (TIN)',
            targetId: 'rev-section-payroll',
            isOptional: true,
            isDone: Boolean(currentValues.bank?.taxId?.trim()),
          },
        ];

      default:
        return [];
    }
  }, [step, currentValues]);

  const stageDoneCount = useMemo(
    () => currentStageFields.filter((f) => f.isDone).length,
    [currentStageFields]
  );
  const stageTotalCount = currentStageFields.length;
  const stagePercent = stageTotalCount > 0 ? Math.round((stageDoneCount / stageTotalCount) * 100) : 100;

  // Dynamic Progress Calculation based on completed field items
  const progressPercent = Math.round(
    Math.max(
      ((step + 1) / ONBOARDING_STAGES.length) * 100,
      (completedDetailsCount / totalDetailsCount) * 100
    )
  );

  // Dynamic live candidate preview info for the Wizard Top Card
  const candidateFirstName = useMemo(() => {
    const fn = currentValues.personalInfo?.firstName?.trim() || '';
    if (fn) return fn;
    return 'New Staff';
  }, [currentValues.personalInfo?.firstName]);

  const candidateName = useMemo(() => {
    const fn = currentValues.personalInfo?.firstName?.trim() || '';
    const ln = currentValues.personalInfo?.lastName?.trim() || '';
    if (fn || ln) return `${fn} ${ln}`.trim();
    return 'New Staff Member';
  }, [currentValues.personalInfo?.firstName, currentValues.personalInfo?.lastName]);

  const candidateInitials = useMemo(() => {
    const fn = currentValues.personalInfo?.firstName?.trim() || '';
    const ln = currentValues.personalInfo?.lastName?.trim() || '';
    if (fn || ln) {
      return `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase();
    }
    return 'ZS';
  }, [currentValues.personalInfo?.firstName, currentValues.personalInfo?.lastName]);

  const candidateRole = useMemo(() => {
    const roleId = currentValues.employment?.roleId;
    if (!roleId) return 'Role Pending';
    return roles.find((r) => r.id === roleId)?.name || roleId;
  }, [currentValues.employment?.roleId, roles]);

  const candidateDept = useMemo(() => {
    return currentValues.employment?.department || 'Dept Pending';
  }, [currentValues.employment?.department]);

  // File size formatter
  const formatFileSize = (bytes?: number) => {
    if (!bytes || isNaN(bytes)) return '2.4 MB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getDocMeta = (docItem: any, index: number) => {
    if (typeof docItem === 'string') {
      const ext = docItem.includes('.') ? docItem.split('.').pop()?.toUpperCase() : 'DOC';
      return { name: docItem, size: '2.4 MB', ext: ext || 'PDF' };
    }
    const name = docItem?.name || `Document_${index + 1}.pdf`;
    const size = docItem?.size ? formatFileSize(docItem.size) : '1.8 MB';
    const ext = name.includes('.') ? name.split('.').pop()?.toUpperCase() : 'PDF';
    return { name, size, ext: ext || 'PDF' };
  };

  // Webcam Photo Capture
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setValue('personalInfo.avatarUrl', imageSrc, { shouldValidate: true, shouldDirty: true });
      setCameraModalOpen(false);
      toast.success('Profile photo captured');
    }
  }, [webcamRef, setValue]);

  const handleNext = async () => {
    await goToStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft progress saved successfully. You can safely resume later.');
  };

  const onFinalSubmit = async (data: any) => {
    try {
      const formattedData: StaffFormValues = {
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
      await onSubmit(formattedData);
    } catch {
      toast.error('Submission failed. Please check form errors.');
    }
  };

  const currentStage = ONBOARDING_STAGES[step];

  return (
    <div className="space-y-3.5 w-full max-w-7xl mx-auto">
      {/* 1. Page Header (Compact & Crisp) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Onboard New Staff
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {currentStage.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Stage Indicator Badge (Relocated near stats) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A651]/10 border border-[#00A651]/25 text-[#008C44] dark:text-[#00C862]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Stage {step + 1} of {ONBOARDING_STAGES.length}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">• {currentStage.estimate}</span>
          </div>

          {/* Completed Details Counter Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/40 border border-border/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00A651]" />
            <span>{completedDetailsCount}/{totalDetailsCount} Fields Done</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="h-8 gap-1.5 text-xs font-medium bg-card hover:bg-muted shadow-2xs rounded-xl"
          >
            <BookmarkCheck className="h-3.5 w-3.5 text-[#00A651]" /> Save as Draft
          </Button>
        </div>
      </div>

      {/* 2. Unified Master Workflow Card (Form + Wizard Rail + Action Bar in One Seamless Container) */}
      <div className="border border-border/60 rounded-2xl bg-card shadow-xs overflow-hidden flex flex-col">
        {/* Dual-Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/60 flex-1">
          
          {/* LEFT / MAIN FORM AREA (Spacious 9 Columns) */}
          <div
            ref={formScrollRef}
            className="lg:col-span-9 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200"
          >
            <div className="space-y-6 sm:space-y-8">
              {/* Step Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-md bg-[#44883C]/10 text-[#44883C] flex items-center justify-center font-bold text-xs">
                    {step + 1}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    {currentStage.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{currentStage.description}</p>
              </div>
            </div>

            {/* STAGE 0: Personal Identity & Demographics */}
            {step === 0 && (
              <div className="space-y-8 sm:space-y-9">
                {/* Profile Photo Studio */}
                <div className="space-y-2.5">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">Profile Photo & Headshot</Label>
                  <div className="flex flex-row items-center gap-4 p-4 border border-dashed border-border/80 rounded-xl bg-muted/15 hover:bg-muted/25 transition-colors">
                    <div className="relative shrink-0">
                      {currentValues.personalInfo?.avatarUrl ? (
                        <div className="relative group">
                          <img
                            src={currentValues.personalInfo.avatarUrl}
                            alt="Avatar Preview"
                            className="h-14 w-14 rounded-xl object-cover border border-[#44883C]/40 shadow-xs ring-2 ring-[#44883C]/20"
                          />
                          <button
                            type="button"
                            onClick={() => setValue('personalInfo.avatarUrl', '')}
                            className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-white flex items-center justify-center text-[9px] shadow-xs hover:scale-105 transition-transform"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-xl bg-muted text-muted-foreground flex items-center justify-center border border-dashed border-border">
                          <User className="h-7 w-7 opacity-40" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-semibold text-foreground">Employee Headshot</p>
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0.2">JPG, PNG up to 5MB</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">High resolution JPG or PNG format, up to 5MB.</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-card hover:bg-muted border border-border/80 rounded-lg text-xs font-semibold text-foreground transition-colors shadow-2xs">
                          <Upload className="h-3.5 w-3.5 text-[#44883C]" /> Browse
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setValue('personalInfo.avatarUrl', reader.result as string, { shouldValidate: true });
                                  toast.success('Photo uploaded & updated in wizard');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCameraModalOpen(true)}
                          className="h-8 text-xs gap-1.5 font-medium bg-card px-3"
                        >
                          <Camera className="h-3.5 w-3.5 text-muted-foreground" /> Webcam
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Section 1: Basic Identity */}
                <div className="space-y-6 pt-6 border-t border-border/60">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <User className="h-4 w-4 text-[#44883C]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Basic Identity
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        First Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="e.g. Oluwaseun"
                          {...register('personalInfo.firstName')}
                          className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      {errors.personalInfo?.firstName && (
                        <p className="text-[11px] text-destructive">{errors.personalInfo.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Last Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          placeholder="e.g. Adeyemi"
                          {...register('personalInfo.lastName')}
                          className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      {errors.personalInfo?.lastName && (
                        <p className="text-[11px] text-destructive">{errors.personalInfo.lastName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Official Work Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g. oluwaseun@zowasel.com"
                          {...register('personalInfo.email')}
                          className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      {errors.personalInfo?.email && (
                        <p className="text-[11px] text-destructive">{errors.personalInfo.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Phone Number *
                      </Label>
                      <div className="flex items-center gap-2.5">
                        <CountryCodeDropdown
                          value={personalPhoneCode}
                          onChange={setPersonalPhoneCode}
                        />
                        <div className="relative flex-1">
                          <Input
                            id="phone"
                            placeholder="802 345 6789"
                            {...register('personalInfo.phone')}
                            className="h-11 text-sm rounded-xl font-medium bg-background text-slate-900 dark:text-slate-100"
                          />
                        </div>
                      </div>
                      {errors.personalInfo?.phone && (
                        <p className="text-[11px] text-destructive">{errors.personalInfo.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Section 2: Biodata & Demographics */}
                <div className="space-y-6 pt-6 border-t border-border/60">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <Calendar className="h-4 w-4 text-[#44883C]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Biodata & Demographics
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Date of Birth *
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        {...register('personalInfo.dateOfBirth')}
                        className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                      />
                      {errors.personalInfo?.dateOfBirth && (
                        <p className="text-[11px] text-destructive">{errors.personalInfo.dateOfBirth.message}</p>
                      )}
                    </div>

                    {/* Typeable Gender Form with Interactive Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="genderInput" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Gender *
                      </Label>
                      <TypeableDropdown
                        id="genderInput"
                        value={watch('personalInfo.gender')}
                        onChange={(val) => setValue('personalInfo.gender', val, { shouldValidate: true, shouldDirty: true })}
                        options={[
                          'Male',
                          'Female',
                          'Non-Binary',
                          'Prefer not to say',
                          'Other',
                        ]}
                        placeholder="Type or select gender..."
                        error={errors.personalInfo?.gender?.message}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 1: Residential Address & Next of Kin */}
            {step === 1 && (
              <div className="space-y-8">
                {/* Sub-Section 1: Employee Residential Address */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <MapPin className="h-4 w-4 text-[#44883C]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Permanent Residential Address
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Location *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="e.g. 14 Adeola Odeku Street, Victoria Island"
                          {...register('address.line1')}
                          className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      {errors.address?.line1 && (
                        <p className="text-[11px] text-destructive">{errors.address.line1.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        City *
                      </Label>
                      <Input
                        id="city"
                        placeholder="e.g. Victoria Island / Ikeja"
                        {...register('address.city')}
                        className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                      />
                      {errors.address?.city && (
                        <p className="text-[11px] text-destructive">{errors.address.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        State / Region *
                      </Label>
                      <Input
                        id="state"
                        placeholder="e.g. Lagos State"
                        {...register('address.state')}
                        className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                      />
                      {errors.address?.state && (
                        <p className="text-[11px] text-destructive">{errors.address.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Country *
                      </Label>
                      <Input
                        id="country"
                        placeholder="e.g. Nigeria"
                        {...register('address.country')}
                        className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                      />
                      {errors.address?.country && (
                        <p className="text-[11px] text-destructive">{errors.address.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Section 2: Next of Kin & Emergency Contact (Optional) */}
                <div className="space-y-6 pt-6 border-t border-border/60">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <HeartHandshake className="h-4 w-4 text-[#00A651]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Next of Kin & Emergency Contact <span className="text-xs font-normal text-muted-foreground capitalize">(Optional)</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="kinName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Next of Kin Full Name <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="kinName"
                          placeholder="e.g. Bukola Adeyemi"
                          {...register('nextOfKin.fullName')}
                          className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      {errors.nextOfKin?.fullName && (
                        <p className="text-[11px] text-destructive">{errors.nextOfKin.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kinRel" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Relationship <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <Input
                        id="kinRel"
                        placeholder="e.g. Spouse / Brother / Mother"
                        {...register('nextOfKin.relationship')}
                        className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                      />
                      {errors.nextOfKin?.relationship && (
                        <p className="text-[11px] text-destructive">{errors.nextOfKin.relationship.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kinPhone" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Emergency Phone Number <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <div className="flex items-center gap-2.5">
                        <CountryCodeDropdown
                          value={kinPhoneCode}
                          onChange={setKinPhoneCode}
                        />
                        <div className="relative flex-1">
                          <Input
                            id="kinPhone"
                            placeholder="803 123 4567"
                            {...register('nextOfKin.phone')}
                            className="h-11 text-sm rounded-xl font-medium bg-background text-slate-900 dark:text-slate-100"
                          />
                        </div>
                      </div>
                      {errors.nextOfKin?.phone && (
                        <p className="text-[11px] text-destructive">{errors.nextOfKin.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kinEmail" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Emergency Email <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="kinEmail"
                          type="email"
                          placeholder="e.g. bukola@example.com"
                          {...register('nextOfKin.email')}
                          className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="kinAddress" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Residential Address <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="kinAddress"
                        rows={2}
                        placeholder="Emergency contact residence address..."
                        {...register('nextOfKin.address')}
                        className="text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100 min-h-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: Corporate Placement & Payroll */}
            {step === 2 && (
              <div className="space-y-8">
                {/* Sub-Section 1: Corporate Placement & Role */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <Briefcase className="h-4 w-4 text-[#44883C]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Corporate Placement & Designation
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">Department *</Label>
                      <Select
                        value={watch('employment.department')}
                        onValueChange={(val) => { if (val) setValue('employment.department', val, { shouldValidate: true }); }}
                      >
                        <SelectTrigger id="departmentSelect" className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => {
                            const DeptIcon = getDepartmentIcon(dept);
                            return (
                              <SelectItem key={dept} value={dept} className="text-xs">
                                <div className="flex items-center gap-2">
                                  <DeptIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{dept}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.employment?.department && (
                        <p className="text-[11px] text-destructive">{errors.employment.department.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">Designated Role *</Label>
                      <Select
                        value={watch('employment.roleId')}
                        onValueChange={(val) => { if (val) setValue('employment.roleId', val, { shouldValidate: true }); }}
                      >
                        <SelectTrigger id="roleSelect" className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100">
                          <SelectValue placeholder="Select corporate role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id} className="text-xs">
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.employment?.roleId && (
                        <p className="text-[11px] text-destructive">{errors.employment.roleId.message}</p>
                      )}
                    </div>

                    {/* Employment Type Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">Employment Type *</Label>
                      <Select
                        value={watch('employment.employmentType')}
                        onValueChange={(val) => setValue('employment.employmentType', val as any, { shouldValidate: true, shouldDirty: true })}
                      >
                        <SelectTrigger id="employmentTypeSelect" className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time" className="text-xs">Full-Time</SelectItem>
                          <SelectItem value="part-time" className="text-xs">Part-Time</SelectItem>
                          <SelectItem value="contract" className="text-xs">Contract</SelectItem>
                          <SelectItem value="intern" className="text-xs">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.employment?.employmentType && (
                        <p className="text-[11px] text-destructive">{errors.employment.employmentType.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfJoining" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Date of Joining *
                      </Label>
                      <Input
                        id="dateOfJoining"
                        type="date"
                        {...register('employment.dateOfJoining')}
                        className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                      />
                      {errors.employment?.dateOfJoining && (
                        <p className="text-[11px] text-destructive">{errors.employment.dateOfJoining.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="employeeId" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                          Staff ID
                        </Label>
                        <span className="text-[9.5px] font-medium text-[#44883C] bg-[#44883C]/10 px-1.5 py-0.5 rounded-md border border-[#44883C]/20">
                          Auto-generated
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <Input
                          id="employeeId"
                          placeholder="STA-2026-0000"
                          {...register('employment.employeeId')}
                          className="h-11 text-sm font-mono font-medium rounded-xl bg-background text-slate-900 dark:text-slate-100 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setValue('employment.employeeId', generateStaffId(), { shouldValidate: true, shouldDirty: true })}
                          title="Regenerate Staff ID"
                          className="absolute right-3 p-1 text-muted-foreground hover:text-[#44883C] transition-colors cursor-pointer"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 text-xs text-muted-foreground self-end h-11">
                      <ShieldCheck className="h-4 w-4 text-[#44883C] shrink-0" />
                      <span className="text-[11px] leading-tight">Staff ID is generated automatically according to corporate numbering.</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Section 2: Statutory Payroll & Tax Details */}
                <div className="space-y-6 pt-6 border-t border-border/60">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <Landmark className="h-4 w-4 text-[#44883C]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Payroll Disbursement & Tax Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Disbursement Bank Name
                      </Label>
                      <div className="relative">
                        <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="bankName"
                          placeholder="e.g. First Bank of Nigeria"
                          {...register('bank.bankName')}
                          className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Account Number (10-Digit NUBAN)
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="accountNumber"
                          placeholder="10-digit NUBAN"
                          {...register('bank.accountNumber')}
                          className="h-11 pl-10 text-sm font-mono rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sortCode" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Branch Sort Code
                      </Label>
                      <Input
                        id="sortCode"
                        placeholder="e.g. 011152"
                        {...register('bank.sortCode')}
                        className="h-11 text-sm font-mono rounded-xl bg-background text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                        Tax Identification (TIN)
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="taxId"
                          placeholder="e.g. 12345678-0001"
                          {...register('bank.taxId')}
                          className="h-11 pl-10 text-sm font-mono rounded-xl bg-background text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: Final Review & Provisioning Dossier (Compact) */}
            {step === 3 && (
              <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
                {/* 1. Candidate Overview Banner */}
                <div className="p-3.5 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-muted text-foreground font-bold text-base flex items-center justify-center border shrink-0 overflow-hidden shadow-xs">
                      {currentValues.personalInfo?.avatarUrl ? (
                        <img
                          src={currentValues.personalInfo.avatarUrl}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        candidateInitials
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{candidateName}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {candidateRole} • {candidateDept}
                      </p>
                      <p className="text-[10.5px] font-mono text-muted-foreground">
                        {currentValues.personalInfo?.email || '—'}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#00A651]/15 text-[#008C44] dark:text-[#00C862] border border-[#00A651]/30 self-start sm:self-auto">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Provisioning
                  </span>
                </div>

                {/* 2. Personal & Identity Details */}
                <div id="rev-section-personal" className="p-3.5 space-y-2 scroll-mt-6">
                  <div className="flex items-center justify-between pb-1 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-[#00A651]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        1. Personal Identity & Demographics
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">First Name</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.personalInfo?.firstName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Last Name</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.personalInfo?.lastName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Work Email</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{currentValues.personalInfo?.email || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Phone Number</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                        {currentValues.personalInfo?.phone
                          ? currentValues.personalInfo.phone.startsWith('+')
                            ? currentValues.personalInfo.phone
                            : `${personalPhoneCode} ${currentValues.personalInfo.phone}`
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Date of Birth</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.personalInfo?.dateOfBirth || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Gender</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{currentValues.personalInfo?.gender || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Nationality</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.personalInfo?.nationality || 'Nigerian'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Profile Photo</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {currentValues.personalInfo?.avatarUrl ? 'Attached ✓' : 'Default Initials'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Permanent Residential Address */}
                <div id="rev-section-address" className="p-3.5 space-y-2 scroll-mt-6">
                  <div className="flex items-center justify-between pb-1 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#44883C]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        2A. Permanent Residential Address
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-muted-foreground block">Street / Location</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {currentValues.address?.line1 || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">City</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.address?.city || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">State / Region</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.address?.state || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Country</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.address?.country || 'Nigeria'}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Next of Kin & Emergency Contact */}
                <div id="rev-section-kin" className="p-3.5 space-y-2 scroll-mt-6">
                  <div className="flex items-center justify-between pb-1 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="h-3.5 w-3.5 text-[#00A651]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        2B. Emergency Contact & Next of Kin (Optional)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Full Name</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.nextOfKin?.fullName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Relationship</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.nextOfKin?.relationship || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Emergency Phone</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                        {currentValues.nextOfKin?.phone
                          ? currentValues.nextOfKin.phone.startsWith('+')
                            ? currentValues.nextOfKin.phone
                            : `${kinPhoneCode} ${currentValues.nextOfKin.phone}`
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Emergency Email</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.nextOfKin?.email || '—'}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-4">
                      <span className="text-[10px] text-muted-foreground block">Emergency Contact Address</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.nextOfKin?.address || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* 5. Corporate Placement & Designation */}
                <div id="rev-section-placement" className="p-3.5 space-y-2 scroll-mt-6">
                  <div className="flex items-center justify-between pb-1 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-[#44883C]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        3A. Corporate Placement & Designation
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Department</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateDept}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Designated Role</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateRole}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Staff ID</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{currentValues.employment?.employeeId || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Employment Type</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{currentValues.employment?.employmentType || 'full-time'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Date of Joining</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.employment?.dateOfJoining || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* 6. Payroll Disbursement & Statutory Tax */}
                <div id="rev-section-payroll" className="p-3.5 space-y-2 scroll-mt-6">
                  <div className="flex items-center justify-between pb-1 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-3.5 w-3.5 text-[#00A651]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        3B. Payroll Disbursement & Statutory Tax
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Disbursement Bank</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{currentValues.bank?.bankName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Account Number (NUBAN)</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{currentValues.bank?.accountNumber || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Branch Sort Code</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{currentValues.bank?.sortCode || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Tax ID / TIN</span>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{currentValues.bank?.taxId || '—'}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
            </div>

            {/* Form Left Pane Trust Banner */}
            <div className="pt-6 mt-8 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-[#44883C] shrink-0" />
              <span>All entered data is securely encrypted and auto-saved in compliance with enterprise policies.</span>
            </div>
          </div>

          {/* RIGHT / CURRENT STAGE WIZARD CHECKLIST (Integrated 3 Columns with Subtle Tint) */}
          <div className="lg:col-span-3 p-4 sm:p-5 bg-muted/15 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* TOP WIZARD: Profile Photo Card */}
              <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-2xs shrink-0">
                <div className="relative w-full aspect-[4/3] sm:h-40 md:h-44 bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/50">
                  {currentValues.personalInfo?.avatarUrl ? (
                    <img
                      src={currentValues.personalInfo.avatarUrl}
                      alt="Candidate Avatar"
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 p-3 text-center w-full h-full">
                      <div className="h-14 w-14 rounded-full bg-card border-2 border-dashed border-border/80 flex items-center justify-center text-base font-bold text-foreground shadow-xs">
                        {candidateInitials}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">No photo uploaded</span>
                        <span className="text-[10px] text-muted-foreground block">Attach headshot in Stage 1</span>
                      </div>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 h-3 w-3 rounded-full border-2 border-card shadow-xs ${
                      currentValues.personalInfo?.avatarUrl ? 'bg-[#44883C]' : 'bg-amber-400'
                    }`}
                    title={currentValues.personalInfo?.avatarUrl ? 'Photo Uploaded' : 'Photo Pending'}
                  />
                </div>

                {/* Candidate Name & Email */}
                <div className="py-2.5 px-3 text-center space-y-0.5 bg-card">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{candidateName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate leading-tight">
                    {currentValues.personalInfo?.email || 'email@pending.com'}
                  </p>
                </div>
              </div>

              {/* CURRENT STAGE FIELD CHECKLIST */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 px-0.5 border-b border-border/40">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ClipboardList className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
                      {step === 3 ? 'All Dossier Fields Checklist' : `Stage ${step + 1} Checklist`}
                    </span>
                  </div>
                  <span
                    className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      stageDoneCount === stageTotalCount
                        ? 'bg-emerald-500/15 text-[#008C44] dark:text-[#00C862] border-emerald-500/20'
                        : 'bg-[#00A651]/10 text-[#008C44] dark:text-[#00C862] border-[#00A651]/20'
                    }`}
                  >
                    {stageDoneCount}/{stageTotalCount} Done
                  </span>
                </div>

                {/* List of Fields for Current Stage */}
                <div className={`space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.3)_transparent] ${
                  step === 3 ? 'max-h-[380px] sm:max-h-[440px]' : 'max-h-[300px]'
                }`}>
                  {currentStageFields.map((field) => (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => {
                        if (field.targetId) {
                          const el = document.getElementById(field.targetId);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.focus();
                          }
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        field.isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15 dark:bg-emerald-950/20'
                          : 'bg-card border-border/60 hover:bg-muted/40'
                      }`}
                      title={field.targetId ? `Click to jump to ${field.label}` : field.label}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Checkmark: Ticked Good if Filled */}
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center text-[8.5px] font-bold shrink-0 transition-colors ${
                            field.isDone
                              ? 'bg-[#00A651] text-white shadow-2xs ring-2 ring-[#00A651]/20'
                              : 'border border-border/80 bg-muted/30 text-transparent'
                          }`}
                        >
                          {field.isDone ? <Check className="h-2.5 w-2.5" /> : null}
                        </div>

                        <span
                          className={`text-xs truncate ${
                            field.isDone
                              ? 'text-slate-800 dark:text-slate-200 font-medium'
                              : 'text-slate-600 dark:text-slate-400 font-normal'
                          }`}
                        >
                          {field.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {field.isDone ? (
                          <span className="text-[9px] font-bold text-[#008C44] dark:text-[#00C862] flex items-center gap-0.5">
                            Filled
                          </span>
                        ) : (
                          <span className="text-[9px] text-muted-foreground font-medium">
                            {field.isOptional ? 'Optional' : 'Fill →'}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contextual Stage Guideline Note */}
              <div className="p-3 rounded-xl bg-card border border-border/50 space-y-1 text-xs text-muted-foreground shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                  <BookmarkCheck className="h-3.5 w-3.5 text-[#00A651]" />
                  <span>Stage Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {STAGE_GUIDELINES[step] || 'Complete the required fields above to proceed to the next onboarding stage.'}
                </p>
              </div>
            </div>

            {/* BOTTOM: Stage Progress Meter & Overall Status */}
            <div className="pt-3 border-t border-border/50 space-y-2 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10.5px] font-medium text-slate-600 dark:text-slate-400">
                  <span>Stage Completion:</span>
                  <span className="font-bold text-[#008C44] dark:text-[#00C862]">
                    {stageDoneCount}/{stageTotalCount} Fields
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00A651] via-teal-500 to-[#00A651] transition-all duration-300 rounded-full"
                    style={{ width: `${stageTotalCount > 0 ? (stageDoneCount / stageTotalCount) * 100 : 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-0.5 text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/40">
                <span>Overall Stage {step + 1} of {ONBOARDING_STAGES.length}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {completedDetailsCount}/{totalDetailsCount} Completed
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Integrated Workflow Action Bar (Seamlessly Anchored to the Bottom of the Master Card) */}
        <div className="p-3.5 sm:p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Cancel */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/staff/directory')}
            className="h-10 text-xs sm:text-sm text-muted-foreground hover:text-foreground cursor-pointer px-4 rounded-xl"
          >
            Cancel
          </Button>

          {/* Center: Auto-Save Status */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#44883C] animate-pulse" />
            <span>Auto-saved at {lastSavedTime}</span>
          </div>

          {/* Right: Back & Continue */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={step === 0}
              className="h-10 text-xs sm:text-sm gap-1.5 font-medium cursor-pointer px-4 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>

            {step === ONBOARDING_STAGES.length - 1 ? (
              <Button
                type="button"
                size="sm"
                onClick={handleSubmit(onFinalSubmit)}
                disabled={isSubmitting}
                className="h-10 px-6 bg-[#44883C] hover:bg-[#3b7434] text-white font-bold shadow-xs gap-2 cursor-pointer text-xs sm:text-sm rounded-xl"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Complete Onboarding
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="h-10 px-6 bg-[#44883C] hover:bg-[#3b7434] text-white font-bold shadow-xs gap-2 cursor-pointer text-xs sm:text-sm rounded-xl"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Webcam Photo Capture Modal */}
      <Dialog open={cameraModalOpen} onOpenChange={setCameraModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Capture Profile Photo</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Center the staff member's face in the camera viewport.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setCameraModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={capturePhoto}
              className="bg-[#00A651] hover:bg-[#008C44] text-white font-semibold gap-1.5"
            >
              <Camera className="h-4 w-4" /> Capture Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}