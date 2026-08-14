"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordField({
  id = "password",
  name = "password",
  label = "Password",
  placeholder = "Enter your password",
  defaultValue,
  disabled = false,
  autoComplete = "current-password",
  className,
  required = true,
  value,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-foreground select-none"
      >
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75787B] dark:text-[#9AA1B1]">
          <Lock className="size-4.5" strokeWidth={2} />
        </div>

        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          className="h-12 w-full rounded-xl border border-[#DCE8DC] dark:border-white/10 bg-white dark:bg-[#19212D] pl-11 pr-11 text-sm font-medium text-foreground transition-all duration-200 placeholder:text-[#75787B]/70 dark:placeholder:text-[#9AA1B1]/60 focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 size-9 rounded-lg text-[#75787B] dark:text-[#9AA1B1] hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="size-4.5 transition-transform duration-150" strokeWidth={2} />
          ) : (
            <Eye className="size-4.5 transition-transform duration-150" strokeWidth={2} />
          )}
        </Button>
      </div>
    </div>
  );
}