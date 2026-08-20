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
  error?: string;
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
  error,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-foreground select-none"
      >
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75787B]">
          <Lock className="size-4" strokeWidth={2} />
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
          aria-invalid={!!error}
          className={cn(
            "h-10.5 w-full rounded-xl border bg-white pl-10 pr-10 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 placeholder:text-[#75787B]/70 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs",
            error
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-4 focus-visible:ring-destructive/15"
              : "border-[#DCE8DC] focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15"
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-lg text-[#75787B] hover:text-foreground hover:bg-black/5 transition-colors duration-150 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="size-4 transition-transform duration-150" strokeWidth={2} />
          ) : (
            <Eye className="size-4 transition-transform duration-150" strokeWidth={2} />
          )}
        </Button>
      </div>

      {error && (
        <p className="text-[11px] font-medium text-destructive animate-auth-fade" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}