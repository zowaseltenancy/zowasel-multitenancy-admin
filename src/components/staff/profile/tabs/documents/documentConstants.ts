import { StaffDocument } from '@/types/staff';

export const defaultDocuments: StaffDocument[] = [
  {
    id: 'doc-1',
    name: 'Employment Contract & NDA Agreement',
    type: 'PDF',
    size: '245 KB',
    uploadedAt: 'Jan 15, 2023',
    verificationStatus: 'verified',
  },
  {
    id: 'doc-2',
    name: 'National Identity Card (NIN Slip)',
    type: 'PDF',
    size: '189 KB',
    uploadedAt: 'Jan 15, 2023',
    verificationStatus: 'verified',
  },
  {
    id: 'doc-3',
    name: 'Degree Certificate & Academic Transcripts',
    type: 'PDF',
    size: '1.2 MB',
    uploadedAt: 'Feb 10, 2023',
    verificationStatus: 'verified',
  },
  {
    id: 'doc-4',
    name: 'Annual Agronomy Safety Certification (2024)',
    type: 'PDF',
    size: '512 KB',
    uploadedAt: 'Apr 02, 2024',
    verificationStatus: 'pending',
  },
];