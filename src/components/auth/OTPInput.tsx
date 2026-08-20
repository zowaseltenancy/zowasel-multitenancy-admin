"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value?: string[];
  onChange?: (digits: string[]) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  hasError = false,
  disabled = false,
}: OTPInputProps) {
  const [internalOtp, setInternalOtp] = useState(["", "", "", "", "", ""]);
  const otp = value || internalOtp;

  const handleDigitChange = (val: string, index: number) => {
    // Only accept numeric inputs
    const sanitized = val.replace(/\D/g, "");
    const next = [...otp];
    next[index] = sanitized.slice(-1);

    if (onChange) {
      onChange(next);
    } else {
      setInternalOtp(next);
    }

    // Auto-focus next input when a digit is entered
    if (sanitized && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, 6).split("");
    const next = [...otp];
    digits.forEach((d, i) => {
      if (i < 6) next[i] = d;
    });

    if (onChange) {
      onChange(next);
    } else {
      setInternalOtp(next);
    }

    const focusIndex = Math.min(digits.length, 5);
    const targetInput = document.getElementById(`otp-${focusIndex}`) as HTMLInputElement | null;
    targetInput?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-2.5">
      {otp.map((digit, index) => (
        <Input
          key={index}
          id={`otp-${index}`}
          value={digit}
          maxLength={1}
          inputMode="numeric"
          disabled={disabled}
          aria-label={`Verification digit ${index + 1}`}
          aria-invalid={hasError}
          className={cn(
            "h-11 sm:h-12 w-11 sm:w-12 text-center text-lg sm:text-xl font-bold rounded-xl border bg-white text-foreground transition-all duration-200 shadow-xs tabular-nums disabled:cursor-not-allowed disabled:opacity-60",
            hasError
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-4 focus-visible:ring-destructive/15"
              : "border-[#DCE8DC] focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15"
          )}
          onChange={(e) => handleDigitChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}