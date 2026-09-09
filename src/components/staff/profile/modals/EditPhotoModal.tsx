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
import { Label } from '@/components/ui/label';
import { Camera, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface EditPhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  onPhotoUpdated?: (url: string) => void;
}

export function EditPhotoModal({
  open,
  onOpenChange,
  staff,
  onPhotoUpdated,
}: EditPhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(staff.avatarUrl || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!preview) {
      toast.error('Please select an image first.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onPhotoUpdated?.(preview);
      toast.success('Staff profile photo updated.');
      onOpenChange(false);
    } catch {
      toast.error('Failed to update photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#00A651]/10 text-[#00A651] flex items-center justify-center">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Update Staff Photo
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload a professional headshot for {staff.firstName} {staff.lastName}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs flex flex-col items-center">
          {/* Avatar Preview */}
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-28 w-28 rounded-2xl object-cover border-2 border-[#00A651]/40 shadow-xs ring-4 ring-[#00A651]/10"
              />
            ) : (
              <div className="h-28 w-28 rounded-2xl bg-muted border flex flex-col items-center justify-center text-muted-foreground gap-1 shadow-xs">
                <ImageIcon className="h-8 w-8 opacity-40" />
                <span className="text-[10px]">No photo</span>
              </div>
            )}
          </div>

          {/* File input label */}
          <label className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border/80 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer text-xs font-semibold">
            <Upload className="h-4 w-4 text-[#00A651]" />
            <span>Select new image (JPG, PNG)</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
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
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={loading || !preview}
            className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
