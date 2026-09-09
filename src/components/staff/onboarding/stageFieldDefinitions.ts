export interface StageFieldItem {
  id: string;
  label: string;
  targetId?: string;
  isDone: boolean;
  isOptional?: boolean;
}

export function getAllFieldItems(currentValues: any, step: number) {
  return [
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
    {
      id: 'final_review',
      label: 'Final Review & Provisioning',
      stageId: 3,
      stageName: 'Final Review',
      isDone: step === 3,
    },
  ];
}

export function getCurrentStageFields(step: number, currentValues: any): StageFieldItem[] {
  switch (step) {
    case 0:
      return [
        { id: 'avatar', label: 'Profile Headshot', targetId: 'avatarTrigger', isDone: Boolean(currentValues.personalInfo?.avatarUrl), isOptional: true },
        { id: 'firstName', label: 'First Name', targetId: 'firstName', isDone: Boolean(currentValues.personalInfo?.firstName?.trim()) },
        { id: 'lastName', label: 'Last Name', targetId: 'lastName', isDone: Boolean(currentValues.personalInfo?.lastName?.trim()) },
        { id: 'email', label: 'Official Email', targetId: 'email', isDone: Boolean(currentValues.personalInfo?.email?.trim()) },
        { id: 'phone', label: 'Phone Number', targetId: 'phone', isDone: Boolean(currentValues.personalInfo?.phone?.trim() && currentValues.personalInfo.phone.trim().length >= 7) },
        { id: 'dob', label: 'Date of Birth', targetId: 'dob', isDone: Boolean(currentValues.personalInfo?.dateOfBirth?.trim()) },
        { id: 'gender', label: 'Gender', targetId: 'genderInput', isDone: Boolean(currentValues.personalInfo?.gender?.trim()) },
        { id: 'nationality', label: 'Nationality', targetId: 'nationality', isDone: Boolean(currentValues.personalInfo?.nationality?.trim()) },
      ];
    case 1:
      return [
        { id: 'location', label: 'Residential Location', targetId: 'location', isDone: Boolean(currentValues.address?.line1?.trim()) },
        { id: 'city', label: 'City', targetId: 'city', isDone: Boolean(currentValues.address?.city?.trim()) },
        { id: 'state', label: 'State / Region', targetId: 'state', isDone: Boolean(currentValues.address?.state?.trim()) },
        { id: 'country', label: 'Country', targetId: 'country', isDone: Boolean(currentValues.address?.country?.trim()) },
        { id: 'kinName', label: 'Next of Kin Full Name', targetId: 'kinName', isDone: Boolean(currentValues.nextOfKin?.fullName?.trim()), isOptional: true },
        { id: 'kinRel', label: 'Relationship', targetId: 'kinRel', isDone: Boolean(currentValues.nextOfKin?.relationship?.trim()), isOptional: true },
        { id: 'kinPhone', label: 'Emergency Phone Number', targetId: 'kinPhone', isDone: Boolean(currentValues.nextOfKin?.phone?.trim() && currentValues.nextOfKin.phone.trim().length >= 7), isOptional: true },
        { id: 'kinEmail', label: 'Emergency Email', targetId: 'kinEmail', isDone: Boolean(currentValues.nextOfKin?.email?.trim()), isOptional: true },
        { id: 'kinAddress', label: 'Emergency Contact Address', targetId: 'kinAddress', isDone: Boolean(currentValues.nextOfKin?.address?.trim()), isOptional: true },
      ];
    case 2:
      return [
        { id: 'department', label: 'Corporate Department', targetId: 'departmentSelect', isDone: Boolean(currentValues.employment?.department?.trim()) },
        { id: 'roleId', label: 'Designated Role', targetId: 'roleSelect', isDone: Boolean(currentValues.employment?.roleId?.trim()) },
        { id: 'employmentType', label: 'Employment Type', targetId: 'employmentTypeSelect', isDone: Boolean(currentValues.employment?.employmentType?.trim()) },
        { id: 'dateOfJoining', label: 'Date of Joining', targetId: 'dateOfJoining', isDone: Boolean(currentValues.employment?.dateOfJoining?.trim()) },
        { id: 'employeeId', label: 'Staff ID', targetId: 'employeeId', isDone: Boolean(currentValues.employment?.employeeId?.trim()) },
        { id: 'bankName', label: 'Disbursement Bank Name', targetId: 'bankName', isDone: Boolean(currentValues.bank?.bankName?.trim()) },
        { id: 'accountNumber', label: 'Account Number (NUBAN)', targetId: 'accountNumber', isDone: Boolean(currentValues.bank?.accountNumber?.trim()) },
        { id: 'sortCode', label: 'Branch Sort Code', targetId: 'sortCode', isDone: Boolean(currentValues.bank?.sortCode?.trim()) },
        { id: 'taxId', label: 'Tax Identification Number (TIN)', targetId: 'taxId', isDone: Boolean(currentValues.bank?.taxId?.trim()), isOptional: true },
      ];
    case 3:
      return [
        { id: 'rev_avatar', label: 'Profile Headshot', targetId: 'rev-section-personal', isOptional: true, isDone: Boolean(currentValues.personalInfo?.avatarUrl?.trim()) },
        { id: 'rev_firstName', label: 'First Name', targetId: 'rev-section-personal', isDone: Boolean(currentValues.personalInfo?.firstName?.trim()) },
        { id: 'rev_lastName', label: 'Last Name', targetId: 'rev-section-personal', isDone: Boolean(currentValues.personalInfo?.lastName?.trim()) },
        { id: 'rev_email', label: 'Official Email', targetId: 'rev-section-personal', isDone: Boolean(currentValues.personalInfo?.email?.trim()) },
        { id: 'rev_phone', label: 'Phone Number', targetId: 'rev-section-personal', isDone: Boolean(currentValues.personalInfo?.phone?.trim() && currentValues.personalInfo.phone.trim().length >= 7) },
        { id: 'rev_dob', label: 'Date of Birth', targetId: 'rev-section-personal', isDone: Boolean(currentValues.personalInfo?.dateOfBirth?.trim()) },
        { id: 'rev_gender', label: 'Gender', targetId: 'rev-section-personal', isDone: Boolean(currentValues.personalInfo?.gender?.trim()) },
        { id: 'rev_nationality', label: 'Nationality', targetId: 'rev-section-personal', isDone: Boolean(currentValues.personalInfo?.nationality?.trim()) },
        { id: 'rev_location', label: 'Residential Location', targetId: 'rev-section-address', isDone: Boolean(currentValues.address?.line1?.trim()) },
        { id: 'rev_city', label: 'City', targetId: 'rev-section-address', isDone: Boolean(currentValues.address?.city?.trim()) },
        { id: 'rev_state', label: 'State / Region', targetId: 'rev-section-address', isDone: Boolean(currentValues.address?.state?.trim()) },
        { id: 'rev_country', label: 'Country', targetId: 'rev-section-address', isDone: Boolean(currentValues.address?.country?.trim()) },
        { id: 'rev_kinName', label: 'Next of Kin Full Name', targetId: 'rev-section-kin', isOptional: true, isDone: Boolean(currentValues.nextOfKin?.fullName?.trim()) },
        { id: 'rev_kinRel', label: 'Next of Kin Relationship', targetId: 'rev-section-kin', isOptional: true, isDone: Boolean(currentValues.nextOfKin?.relationship?.trim()) },
        { id: 'rev_kinPhone', label: 'Emergency Phone', targetId: 'rev-section-kin', isOptional: true, isDone: Boolean(currentValues.nextOfKin?.phone?.trim() && currentValues.nextOfKin.phone.trim().length >= 7) },
        { id: 'rev_kinEmail', label: 'Emergency Email', targetId: 'rev-section-kin', isOptional: true, isDone: Boolean(currentValues.nextOfKin?.email?.trim()) },
        { id: 'rev_kinAddress', label: 'Emergency Contact Address', targetId: 'rev-section-kin', isOptional: true, isDone: Boolean(currentValues.nextOfKin?.address?.trim()) },
        { id: 'rev_dept', label: 'Corporate Department', targetId: 'rev-section-placement', isDone: Boolean(currentValues.employment?.department?.trim()) },
        { id: 'rev_role', label: 'Designated Role', targetId: 'rev-section-placement', isDone: Boolean(currentValues.employment?.roleId?.trim()) },
        { id: 'rev_empType', label: 'Employment Type', targetId: 'rev-section-placement', isDone: Boolean(currentValues.employment?.employmentType?.trim()) },
        { id: 'rev_doj', label: 'Date of Joining', targetId: 'rev-section-placement', isDone: Boolean(currentValues.employment?.dateOfJoining?.trim()) },
        { id: 'rev_empId', label: 'Staff ID', targetId: 'rev-section-placement', isDone: Boolean(currentValues.employment?.employeeId?.trim()) },
        { id: 'rev_bank', label: 'Disbursement Bank Name', targetId: 'rev-section-payroll', isDone: Boolean(currentValues.bank?.bankName?.trim()) },
        { id: 'rev_accNum', label: 'Account Number (NUBAN)', targetId: 'rev-section-payroll', isDone: Boolean(currentValues.bank?.accountNumber?.trim()) },
        { id: 'rev_sortCode', label: 'Branch Sort Code', targetId: 'rev-section-payroll', isDone: Boolean(currentValues.bank?.sortCode?.trim()) },
        { id: 'rev_taxId', label: 'Tax ID (TIN)', targetId: 'rev-section-payroll', isOptional: true, isDone: Boolean(currentValues.bank?.taxId?.trim()) },
      ];
    default:
      return [];
  }
}
