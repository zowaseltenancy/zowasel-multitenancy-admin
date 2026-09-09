'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, FileCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffDocument, StaffMember } from '@/types/staff';
import { toast } from 'sonner';
import { defaultDocuments } from './documents/documentConstants';
import { DocumentCard } from './documents/DocumentCard';

interface DocumentsTabProps {
  staff: StaffMember;
  onUploadDocument: () => void;
}

export function DocumentsTab({ staff, onUploadDocument }: DocumentsTabProps) {
  const [docs, setDocs] = useState<StaffDocument[]>(
    staff.complianceDocuments && staff.complianceDocuments.length > 0
      ? staff.complianceDocuments
      : defaultDocuments
  );

  const verifiedCount = docs.filter((d) => d.verificationStatus === 'verified').length;
  const pendingCount = docs.filter((d) => d.verificationStatus === 'pending').length;

  const handleDownload = (docName: string) => {
    toast.success(`Downloading ${docName}`);
  };

  const handleDelete = (docId: string, docName: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== docId));
    toast.success(`Removed ${docName}`);
  };

  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      {/* 1. Header with Stats & Upload CTA */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-[#00A651]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Official Compliance & Work Documents
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage attached personnel files, verified certificates, and regulatory compliance paperwork.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#008C44] dark:text-[#00C862] font-semibold border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" /> {verifiedCount} Verified
            </span>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                <Clock className="h-3 w-3" /> {pendingCount} Pending
              </span>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={onUploadDocument}
            className="h-8.5 bg-[#00A651] hover:bg-[#008C44] text-white font-medium gap-1.5 shadow-xs cursor-pointer text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Upload Document
          </Button>
        </div>
      </div>

      {/* 2. Documents Grid / List */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {docs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
