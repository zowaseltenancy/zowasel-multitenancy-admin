"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export default function PasswordField({
  id = "password",
  name = "password",
  label = "Password",
  placeholder = "Enter your password",
  defaultValue,
  disabled = false,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          autoComplete={autoComplete}
          className="pr-10"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}