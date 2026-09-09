import { useState, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { StaffFormValues } from '@/lib/validations/staff';
import { COUNTRY_DIAL_CODES } from './onboardingConstants';

export function usePhoneCountryCodes(
  defaultValues: Partial<StaffFormValues> | undefined,
  setValue: UseFormSetValue<StaffFormValues>
) {
  const [personalPhoneCode, setPersonalPhoneCode] = useState('+234');
  const [kinPhoneCode, setKinPhoneCode] = useState('+234');

  useEffect(() => {
    if (defaultValues?.personalInfo?.phone) {
      const match = COUNTRY_DIAL_CODES.find((c) => defaultValues.personalInfo?.phone?.startsWith(c.code));
      if (match) {
        setPersonalPhoneCode(match.code);
        setValue('personalInfo.phone', defaultValues.personalInfo.phone.slice(match.code.length).trim());
      }
    }
    if (defaultValues?.nextOfKin?.phone) {
      const match = COUNTRY_DIAL_CODES.find((c) => defaultValues.nextOfKin?.phone?.startsWith(c.code));
      if (match) {
        setKinPhoneCode(match.code);
        setValue('nextOfKin.phone', defaultValues.nextOfKin.phone.slice(match.code.length).trim());
      }
    }
  }, [defaultValues, setValue]);

  return { personalPhoneCode, setPersonalPhoneCode, kinPhoneCode, setKinPhoneCode };
}
