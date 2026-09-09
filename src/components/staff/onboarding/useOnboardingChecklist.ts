import { useMemo } from 'react';
import { ONBOARDING_STAGES } from './onboardingConstants';
import { getAllFieldItems, getCurrentStageFields, StageFieldItem } from './stageFieldDefinitions';

export function useOnboardingChecklist(
  step: number,
  currentValues: any,
  roles: { id: string; name: string }[]
) {
  const allFieldItems = useMemo(
    () => getAllFieldItems(currentValues, step),
    [currentValues, step]
  );

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

  const currentStageFields = useMemo<StageFieldItem[]>(
    () => getCurrentStageFields(step, currentValues),
    [step, currentValues]
  );

  const stageDoneCount = useMemo(
    () => currentStageFields.filter((f) => f.isDone).length,
    [currentStageFields]
  );
  const stageTotalCount = currentStageFields.length;
  const stagePercent = stageTotalCount > 0 ? Math.round((stageDoneCount / stageTotalCount) * 100) : 100;

  const progressPercent = Math.round(
    Math.max(
      ((step + 1) / ONBOARDING_STAGES.length) * 100,
      (completedDetailsCount / totalDetailsCount) * 100
    )
  );

  const candidateFirstName = useMemo(() => {
    return currentValues.personalInfo?.firstName?.trim() || 'New Staff';
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
    if (fn || ln) return `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase();
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

  return {
    allFieldItems,
    completedFieldItems,
    pendingFieldItems,
    completedDetailsCount,
    totalDetailsCount,
    currentStageFields,
    stageDoneCount,
    stageTotalCount,
    stagePercent,
    progressPercent,
    candidateFirstName,
    candidateName,
    candidateInitials,
    candidateRole,
    candidateDept,
  };
}
