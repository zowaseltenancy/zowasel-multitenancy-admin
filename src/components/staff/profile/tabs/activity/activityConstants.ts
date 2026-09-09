import { StaffActivity } from '@/types/staff';

export const defaultFullActivities: StaffActivity[] = [
  {
    id: 'act-1',
    type: 'profile_updated',
    title: 'Profile information updated',
    description: 'Permanent residential address and Next of Kin contact numbers verified and updated.',
    actor: 'Zowasel Admin',
    timestamp: '2 days ago · Aug 30, 2026 at 14:22',
  },
  {
    id: 'act-2',
    type: 'document_uploaded',
    title: 'Annual Compliance Contract uploaded',
    description: 'Uploaded and verified Employment Contract & NDA Agreement in encrypted personnel store.',
    actor: 'HR Operations (Amina Bello)',
    timestamp: '5 days ago · Aug 27, 2026 at 09:15',
  },
  {
    id: 'act-3',
    type: 'role_assigned',
    title: 'Department Role Scope Assigned',
    description: 'Assigned Lead Field Officer permissions for CropPilot verification clusters.',
    actor: 'System Admin',
    timestamp: '1 week ago · Aug 24, 2026 at 11:30',
  },
  {
    id: 'act-4',
    type: 'password_reset',
    title: 'Administrative password reset executed',
    description: 'Temporary security credentials dispatched to staff official work email.',
    actor: 'Security Operations',
    timestamp: '2 weeks ago · Aug 17, 2026 at 16:45',
  },
  {
    id: 'act-5',
    type: 'review_completed',
    title: 'Q2 Performance Appraisal verified',
    description: 'Completed annual yield audit rating of 4.9/5.0 with supervisor feedback.',
    actor: 'Dr. Chuka Eze (VP Agronomy)',
    timestamp: '1 month ago · Aug 01, 2026 at 10:00',
  },
  {
    id: 'act-6',
    type: 'general',
    title: 'Staff Onboarding dossier provisioned',
    description: 'Initial employee record created and provisioned on Zowasel multi-tenant directory.',
    actor: 'Zowasel HR System',
    timestamp: 'Jan 15, 2023 at 08:00',
  },
];