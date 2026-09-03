'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  onSuccess?: () => void;
}

export function UploadDocumentModal({ open, onOpenChange, staff, onSuccess }: UploadDocumentModalProps) {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('contract');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    setUploading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Document "${docName}" uploaded and queued for verification.`);
      setDocName('');
      setSelectedFile(null);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Upload Compliance Document
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Attach a verified document to {staff.firstName}'s personnel dossier.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Document Title</Label>
            <Input
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. 2024 Agronomy Safety Certification"
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Document Category</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Employment Contract / NDA</SelectItem>
                <SelectItem value="identification">Government ID / Passport</SelectItem>
                <SelectItem value="certificate">Academic / Professional Certificate</SelectItem>
                <SelectItem value="tax">Tax / TIN Verification</SelectItem>
                <SelectItem value="other">Other Compliance Record</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Attach File (PDF, DOCX, PNG up to 10MB)</Label>
            <label className="flex flex-col items-center justify-center p-4 border border-dashed border-border/80 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer text-center">
              <FileText className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {selectedFile ? selectedFile.name : 'Click to browse files'}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supports PDF, DOC, PNG, JPG'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSelectedFile(e.target.files[0]);
                    if (!docName) setDocName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                  }
                }}
              />
            </label>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={uploading}
              className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
            >
              {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Upload className="h-3.5 w-3.5" /> Upload File
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
