'use client';

import { FileText, Download, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StaffDocument } from '@/types/staff';

interface DocumentCardProps {
  doc: StaffDocument;
  onDownload: (name: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function DocumentCard({ doc, onDownload, onDelete }: DocumentCardProps) {
  return (
    <div className="p-4 rounded-xl bg-muted/20 border border-border/60 hover:bg-muted/30 transition-all flex flex-col justify-between gap-3 group">
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
            onClick={() => onDownload(doc.name)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
          >
            <Download className="h-3 w-3" /> Download
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(doc.id, doc.name)}
            className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}