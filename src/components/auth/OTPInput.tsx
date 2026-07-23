"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

export default function OTPInput() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value: string, index: number) => {
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;

      nextInput?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {otp.map((digit, index) => (
        <Input
          key={index}
          id={`otp-${index}`}
          value={digit}
          maxLength={1}
          inputMode="numeric"
          className="h-12 w-12 text-center text-lg font-semibold"
          onChange={(e) => handleChange(e.target.value, index)}
        />
      ))}
    </div>
  );
}