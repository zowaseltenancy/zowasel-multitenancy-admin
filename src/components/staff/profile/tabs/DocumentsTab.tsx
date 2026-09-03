'use client';

import { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  FileCheck,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StaffDocument, StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface DocumentsTabProps {
  staff: StaffMember;
  onUploadDocument: () => void;
}

export function DocumentsTab({ staff, onUploadDocument }: DocumentsTabProps) {
  const defaultDocuments: StaffDocument[] = [
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
          {/* Quick Metrics */}
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
            <div
              key={doc.id}
              className="p-4 rounded-xl bg-muted/20 border border-border/60 hover:bg-muted/30 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-card border border-border flex items-center justify-center text-xs font-bold text-[#00A651] shrink-0 shadow-2xs">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {doc.type} • {doc.size} • Uploaded {doc.uploadedAt}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold shrink-0 ${
                    doc.verificationStatus === 'verified'
                      ? 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                      : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
                  }`}
                >
                  {doc.verificationStatus === 'verified' ? 'Verified' : 'Pending verification'}
                </Badge>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#00A651]" /> Stored in Encrypted Vault
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc.name)}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                  >
                    <Download className="h-3 w-3" /> Download
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
