'use client';

import React from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface OnboardingCameraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webcamRef: React.RefObject<Webcam | null>;
  onCapture: () => void;
}

export function OnboardingCameraModal({
  open,
  onOpenChange,
  webcamRef,
  onCapture,
}: OnboardingCameraModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Capture Profile Photo</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Center the staff member's face in the camera viewport.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onCapture}
            className="bg-[#00A651] hover:bg-[#008C44] text-white font-semibold gap-1.5"
          >
            <Camera className="h-4 w-4" /> Capture Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
