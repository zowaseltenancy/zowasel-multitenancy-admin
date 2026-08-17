"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface OTPInputProps {
  value?: string[];
  onChange?: (digits: string[]) => void;
  hasError?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  hasError = false,
}: OTPInputProps) {
  const [internalOtp, setInternalOtp] = useState(["", "", "", "", "", ""]);
  const otp = value || internalOtp;

  const handleDigitChange = (val: string, index: number) => {
    const next = [...otp];
    next[index] = val.slice(-1);
    if (onChange) {
      onChange(next);
    } else {
      setInternalOtp(next);
    }

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
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
          aria-label={`Verification digit ${index + 1}`}
          className={`h-11 sm:h-12 w-11 sm:w-12 text-center text-lg sm:text-xl font-bold rounded-xl border ${
            hasError
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-4 focus-visible:ring-destructive/15"
              : "border-[#DCE8DC] focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15"
          } bg-white text-foreground transition-all duration-200 shadow-xs`}
          onChange={(e) => handleDigitChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}