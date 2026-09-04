'use client';

import React from 'react';
import { User, Upload, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfilePhotoStudioProps {
  avatarUrl?: string;
  onAvatarChange: (url: string) => void;
  onOpenCamera: () => void;
}

export function ProfilePhotoStudio({
  avatarUrl,
  onAvatarChange,
  onOpenCamera,
}: ProfilePhotoStudioProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result as string);
        toast.success('Photo uploaded & updated in wizard');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2.5">
      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
        Profile Photo & Headshot
      </Label>
      <div className="flex flex-row items-center gap-4 p-4 border border-dashed border-border/80 rounded-xl bg-muted/15 hover:bg-muted/25 transition-colors">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="h-14 w-14 rounded-xl object-cover border border-[#44883C]/40 shadow-xs ring-2 ring-[#44883C]/20"
              />
              <button
                type="button"
                onClick={() => onAvatarChange('')}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-white flex items-center justify-center text-[9px] shadow-xs hover:scale-105 transition-transform"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="h-14 w-14 rounded-xl bg-muted text-muted-foreground flex items-center justify-center border border-dashed border-border">
              <User className="h-7 w-7 opacity-40" />
            </div>
          )}
        </div>

        <div className="space-y-1 min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-semibold text-foreground">Employee Headshot</p>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0.2">JPG, PNG up to 5MB</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">High resolution JPG or PNG format, up to 5MB.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-card hover:bg-muted border border-border/80 rounded-lg text-xs font-semibold text-foreground transition-colors shadow-2xs">
              <Upload className="h-3.5 w-3.5 text-[#44883C]" /> Browse
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenCamera}
              className="h-8 text-xs gap-1.5 font-medium bg-card px-3"
            >
              <Camera className="h-3.5 w-3.5 text-muted-foreground" /> Webcam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
