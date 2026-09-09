'use client';

import React from 'react';
import { User, Upload, Camera, Trash2, CheckCircle2 } from 'lucide-react';
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
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB maximum limit.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onAvatarChange(reader.result as string);
      toast.success('Official headshot attached successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs sm:text-sm font-bold text-foreground">
          Employee Headshot & Identity Photo <span className="text-[#44883C]">*</span>
        </Label>
        <span className="text-[11px] text-muted-foreground hidden sm:inline-block">
          Used on digital staff ID card & enterprise directory
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 p-4 sm:p-5 border rounded-2xl transition-all ${
          isDragging
            ? 'border-[#44883C] bg-[#44883C]/10 ring-2 ring-[#44883C]/20 shadow-xs'
            : 'border-border/80 hover:border-[#44883C]/50 bg-card hover:bg-muted/10 shadow-2xs'
        }`}
      >
        {/* 1. EXECUTIVE CIRCULAR PORTRAIT PREVIEW */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-full p-1 bg-background border border-border/80 shadow-xs ring-1 ring-border/40 overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Headshot Preview"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-muted/40 text-muted-foreground/60 flex items-center justify-center border-2 border-dashed border-border/70">
                <User className="h-8 w-8 opacity-40" />
              </div>
            )}
          </div>

          {avatarUrl ? (
            <span className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold text-[#44883C] dark:text-[#5cb850]">
              <CheckCircle2 className="h-3 w-3" /> Attached
            </span>
          ) : (
            <span className="mt-1.5 text-[10.5px] font-medium text-muted-foreground">
              Awaiting Photo
            </span>
          )}
        </div>

        {/* 2. SPECIFICATIONS & CONTROLS */}
        <div className="space-y-3 min-w-0 flex-1 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h4 className="text-sm font-bold text-foreground">Official Corporate Portrait</h4>
              <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0 border-border text-muted-foreground">
                JPG, PNG up to 5MB
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Recommended: Passport or square crop with a forward-facing, neutral background for optimal employee badge resolution.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs font-semibold gap-1.5 bg-background hover:bg-muted border-border text-foreground shadow-2xs"
            >
              <Upload className="h-3.5 w-3.5 text-[#44883C]" />
              {avatarUrl ? 'Change Photo' : 'Upload Headshot'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenCamera}
              className="h-8 text-xs font-semibold gap-1.5 bg-background hover:bg-muted border-border text-foreground shadow-2xs"
            >
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              Take Photo
            </Button>

            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAvatarChange('');
                  toast.info('Profile headshot removed.');
                }}
                className="h-8 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 px-2.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
