'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
  Upload,
  FileText,
  ImageIcon,
  Camera,
  X,
} from 'lucide-react';
import { staffFormSchema, StaffFormValues } from '@/lib/validations/staff';


const STEPS = [
  'Personal Info',
  'Employment',
  'Address',
  'Next of Kin',
  'Education',
  'Experience',
  'Bank Details',
  'Documents',
  'Review',
];

interface StaffOnboardingFormProps {
  defaultValues?: Partial<StaffFormValues>;
  roles: { id: string; name: string }[];
  departments: string[];
  onSubmit: (data: StaffFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function StaffOnboardingForm({
  defaultValues,
  roles,
  departments,
  onSubmit,
  isSubmitting = false,
}: StaffOnboardingFormProps) {
  const [step, setStep] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const methods = useForm<z.input<typeof staffFormSchema>>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      personalInfo: { gender: 'male', ...defaultValues?.personalInfo },
      employment: { employmentType: 'full-time', ...defaultValues?.employment },
      address: { country: 'Nigeria', ...defaultValues?.address },
      nextOfKin: { ...defaultValues?.nextOfKin },
      education: defaultValues?.education || [],
      workExperience: defaultValues?.workExperience || [],
      bank: defaultValues?.bank || {},
      documents: defaultValues?.documents || [],
    },
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
    control,
  } = methods;

  const educationArray = useFieldArray({ control, name: 'education' });
  const experienceArray = useFieldArray({ control, name: 'workExperience' });
  const documentsArray = useFieldArray({ control, name: 'documents' });

  const progress = (step / (STEPS.length - 1)) * 100;

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data as StaffFormValues);
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('personalInfo.avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setValue('personalInfo.avatarUrl', imageSrc);
        setShowCamera(false);
      }
    }
  }, [webcamRef, setValue]);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs sm:text-sm">
          {STEPS.map((label, idx) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 ${
                idx <= step ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  idx <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {idx + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border rounded-lg p-6">
        {/* STEP 0 – Personal Info (with image upload) */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* IMAGE UPLOAD / CAMERA CAPTURE */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium leading-none">Profile Photo</label>
                <div className="flex items-start gap-4 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 text-sm hover:bg-accent">
                      <ImageIcon className="h-4 w-4" />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCamera(!showCamera)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {showCamera ? 'Cancel Camera' : 'Capture from Camera'}
                    </Button>
                  </div>

                  {/* Photo preview */}
                  {watch('personalInfo.avatarUrl') && (
                    <div className="relative">
                      <img
                        src={watch('personalInfo.avatarUrl')}
                        alt="Preview"
                        className="h-24 w-24 rounded-full object-cover border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setValue('personalInfo.avatarUrl', '')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Camera view */}
                {showCamera && (
                  <div className="mt-4 space-y-2">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: 'user' }}
                      className="rounded-lg border w-full max-w-md"
                    />
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto}>Capture</Button>
                      <Button variant="ghost" onClick={() => setShowCamera(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Other personal info fields remain unchanged */}
              <div>
                <label className="text-sm font-medium leading-none">First Name *</label>
                <Input {...register('personalInfo.firstName')} placeholder="John" />
                {errors.personalInfo?.firstName && (
                  <p className="text-sm text-red-500">{errors.personalInfo.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Last Name *</label>
                <Input {...register('personalInfo.lastName')} placeholder="Doe" />
                {errors.personalInfo?.lastName && (
                  <p className="text-sm text-red-500">{errors.personalInfo.lastName.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Email *</label>
                <Input type="email" {...register('personalInfo.email')} placeholder="john@zowasel.com" />
                {errors.personalInfo?.email && (
                  <p className="text-sm text-red-500">{errors.personalInfo.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Phone *</label>
                <Input {...register('personalInfo.phone')} placeholder="+234..." />
                {errors.personalInfo?.phone && (
                  <p className="text-sm text-red-500">{errors.personalInfo.phone.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Date of Birth *</label>
                <Input type="date" {...register('personalInfo.dateOfBirth')} />
                {errors.personalInfo?.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.personalInfo.dateOfBirth.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Gender *</label>
                <Select
                  value={watch('personalInfo.gender') ?? 'male'}
                  onValueChange={(val) => setValue('personalInfo.gender', (val as any) ?? 'male')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.personalInfo?.gender && (
                  <p className="text-sm text-red-500">{errors.personalInfo.gender.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Marital Status</label>
                <Input {...register('personalInfo.maritalStatus')} placeholder="Single" />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Nationality</label>
                <Input {...register('personalInfo.nationality')} placeholder="Nigerian" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 – Employment */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium leading-none">Role *</label>
                <Select
                  value={watch('employment.roleId') ?? ''}
                  onValueChange={(val) => setValue('employment.roleId', val ?? '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employment?.roleId && (
                  <p className="text-sm text-red-500">{errors.employment.roleId.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Department *</label>
                <Select
                  value={watch('employment.department') ?? ''}
                  onValueChange={(val) => setValue('employment.department', val ?? '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employment?.department && (
                  <p className="text-sm text-red-500">{errors.employment.department.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Manager ID (optional)</label>
                <Input {...register('employment.managerId')} placeholder="STAFF-001" />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Employee ID (optional)</label>
                <Input {...register('employment.employeeId')} placeholder="EMP-123" />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Date of Joining *</label>
                <Input type="date" {...register('employment.dateOfJoining')} />
                {errors.employment?.dateOfJoining && (
                  <p className="text-sm text-red-500">{errors.employment.dateOfJoining.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Employment Type *</label>
                <Select
                  value={watch('employment.employmentType') ?? 'full-time'}
                  onValueChange={(val) => setValue('employment.employmentType', (val as any) ?? 'full-time')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employment?.employmentType && (
                  <p className="text-sm text-red-500">{errors.employment.employmentType.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Work Location</label>
                <Input {...register('employment.workLocation')} placeholder="Lagos Office" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 – Address */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Residential Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium leading-none">Address Line 1 *</label>
                <Input {...register('address.line1')} placeholder="123 Main Street" />
                {errors.address?.line1 && <p className="text-sm text-red-500">{errors.address.line1.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium leading-none">Address Line 2</label>
                <Input {...register('address.line2')} placeholder="Apt, Suite, etc." />
              </div>
              <div>
                <label className="text-sm font-medium leading-none">City *</label>
                <Input {...register('address.city')} placeholder="Lagos" />
                {errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">State *</label>
                <Input {...register('address.state')} placeholder="Lagos" />
                {errors.address?.state && <p className="text-sm text-red-500">{errors.address.state.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Country *</label>
                <Input {...register('address.country')} placeholder="Nigeria" />
                {errors.address?.country && <p className="text-sm text-red-500">{errors.address.country.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Postal Code</label>
                <Input {...register('address.postalCode')} placeholder="100001" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 – Next of Kin */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Next of Kin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium leading-none">Full Name *</label>
                <Input {...register('nextOfKin.fullName')} placeholder="Jane Doe" />
                {errors.nextOfKin?.fullName && <p className="text-sm text-red-500">{errors.nextOfKin.fullName.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Relationship *</label>
                <Input {...register('nextOfKin.relationship')} placeholder="Spouse" />
                {errors.nextOfKin?.relationship && <p className="text-sm text-red-500">{errors.nextOfKin.relationship.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Phone *</label>
                <Input {...register('nextOfKin.phone')} placeholder="+234..." />
                {errors.nextOfKin?.phone && <p className="text-sm text-red-500">{errors.nextOfKin.phone.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Email</label>
                <Input {...register('nextOfKin.email')} placeholder="kin@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium leading-none">Address</label>
                <Input {...register('nextOfKin.address')} placeholder="Kin's address" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 – Education */}
        {/* (unchanged from previous version) */}
        {/* STEP 5 – Work Experience */}
        {/* (unchanged) */}
        {/* STEP 6 – Bank Details */}
        {/* (unchanged) */}

        {/* STEP 7 – Documents (enhanced UI) */}
        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Supporting Documents</h3>
            <p className="text-muted-foreground text-sm">
              Upload CV, certificates, ID, etc. (optional)
            </p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer border rounded-md px-4 py-2 text-sm hover:bg-accent">
                <Upload className="h-4 w-4" />
                Upload Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        documentsArray.append(files[i].name); // store file name as string
                      }
                    }
                  }}
                />
              </label>
            </div>
            {documentsArray.fields.length > 0 && (
              <ul className="space-y-2">
                {documentsArray.fields.map((field, index) => (
                  <li key={field.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{field}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => documentsArray.remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* STEP 8 – Review (organized summary) */}
        {step === 8 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <p className="text-muted-foreground text-sm">
              Please confirm all details before submitting. You can go back to edit any section.
            </p>

            {/* Personal Info Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> {watch('personalInfo.firstName')} {watch('personalInfo.lastName')}</div>
                <div><span className="text-muted-foreground">Email:</span> {watch('personalInfo.email')}</div>
                <div><span className="text-muted-foreground">Phone:</span> {watch('personalInfo.phone')}</div>
                <div><span className="text-muted-foreground">DOB:</span> {watch('personalInfo.dateOfBirth')}</div>
                <div><span className="text-muted-foreground">Gender:</span> {watch('personalInfo.gender')}</div>
                {watch('personalInfo.maritalStatus') && <div><span className="text-muted-foreground">Marital Status:</span> {watch('personalInfo.maritalStatus')}</div>}
                {watch('personalInfo.nationality') && <div><span className="text-muted-foreground">Nationality:</span> {watch('personalInfo.nationality')}</div>}
              </div>
            </div>

            {/* Employment Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Employment</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Role:</span> {roles.find(r => r.id === watch('employment.roleId'))?.name || '—'}</div>
                <div><span className="text-muted-foreground">Department:</span> {watch('employment.department')}</div>
                <div><span className="text-muted-foreground">Employee ID:</span> {watch('employment.employeeId') || '—'}</div>
                <div><span className="text-muted-foreground">Manager ID:</span> {watch('employment.managerId') || '—'}</div>
                <div><span className="text-muted-foreground">Date of Joining:</span> {watch('employment.dateOfJoining')}</div>
                <div><span className="text-muted-foreground">Type:</span> {watch('employment.employmentType')}</div>
                <div><span className="text-muted-foreground">Work Location:</span> {watch('employment.workLocation') || '—'}</div>
              </div>
            </div>

            {/* Address Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-sm">{watch('address.line1')}{watch('address.line2') ? `, ${watch('address.line2')}` : ''}</p>
              <p className="text-sm text-muted-foreground">
                {watch('address.city')}, {watch('address.state')}, {watch('address.country')}
                {watch('address.postalCode') ? ` – ${watch('address.postalCode')}` : ''}
              </p>
            </div>

            {/* Next of Kin Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Next of Kin</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> {watch('nextOfKin.fullName')}</div>
                <div><span className="text-muted-foreground">Relationship:</span> {watch('nextOfKin.relationship')}</div>
                <div><span className="text-muted-foreground">Phone:</span> {watch('nextOfKin.phone')}</div>
                {watch('nextOfKin.email') && <div><span className="text-muted-foreground">Email:</span> {watch('nextOfKin.email')}</div>}
                {watch('nextOfKin.address') && <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {watch('nextOfKin.address')}</div>}
              </div>
            </div>

            {/* Education Summary */}
            {educationArray.fields.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Education</h4>
                {educationArray.fields.map((field, i) => (
                  <div key={field.id} className="text-sm mb-1">
                    <strong>{watch(`education.${i}.institution`)}</strong> – {watch(`education.${i}.degree`)}{watch(`education.${i}.fieldOfStudy`) ? ` in ${watch(`education.${i}.fieldOfStudy`)}` : ''}
                    {watch(`education.${i}.startYear`) || watch(`education.${i}.endYear`) ? ` (${watch(`education.${i}.startYear`) || '?'} – ${watch(`education.${i}.endYear`) || 'Present'})` : ''}
                  </div>
                ))}
              </div>
            )}

            {/* Work Experience Summary */}
            {experienceArray.fields.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Work Experience</h4>
                {experienceArray.fields.map((field, i) => (
                  <div key={field.id} className="text-sm mb-1">
                    <strong>{watch(`workExperience.${i}.company`)}</strong> – {watch(`workExperience.${i}.jobTitle`)}
                    {watch(`workExperience.${i}.startDate`) || watch(`workExperience.${i}.endDate`) ? ` (${watch(`workExperience.${i}.startDate`) || '?'} – ${watch(`workExperience.${i}.endDate`) || 'Present'})` : ''}
                  </div>
                ))}
              </div>
            )}

            {/* Bank Details Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Bank & Tax</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Bank:</span> {watch('bank.bankName') || '—'}</div>
                <div><span className="text-muted-foreground">Account No.:</span> {watch('bank.accountNumber') || '—'}</div>
                <div><span className="text-muted-foreground">Sort Code:</span> {watch('bank.sortCode') || '—'}</div>
                <div><span className="text-muted-foreground">Tax ID:</span> {watch('bank.taxId') || '—'}</div>
              </div>
            </div>

            {/* Documents Summary */}
            {documentsArray.fields.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Documents</h4>
                <ul className="list-disc list-inside text-sm">
                  {documentsArray.fields.map((field, i) => (
                    <li key={field.id}>{field}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={onFormSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}

function getFieldsForStep(step: number): (keyof StaffFormValues)[] {
  const mapping: Record<number, (keyof StaffFormValues)[]> = {
    0: ['personalInfo'],
    1: ['employment'],
    2: ['address'],
    3: ['nextOfKin'],
    4: ['education'],
    5: ['workExperience'],
    6: ['bank'],
    7: ['documents'],
    8: [],
  };
  return mapping[step] || [];
}