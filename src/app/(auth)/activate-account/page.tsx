"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  PasswordField,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { getPasswordStrength, validatePasswordMatch } from "@/lib/password";

export default function ActivateAccountPage() {
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ createPassword?: string; confirmPassword?: string }>({});

  const strength = getPasswordStrength(createPassword);

  const handleCreatePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCreatePassword(val);
    if (errorMessage) setErrorMessage(null);
    if (errors.createPassword) {
      setErrors((prev) => ({ ...prev, createPassword: undefined }));
    }
    if (confirmPassword && errors.confirmPassword && val === confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (errorMessage) setErrorMessage(null);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const newErrors: { createPassword?: string; confirmPassword?: string } = {};

    if (!createPassword) {
      newErrors.createPassword = "Password is required.";
    } else if (createPassword.length < 8) {
      newErrors.createPassword = "Password must be at least 8 characters.";
    }

    const matchCheck = validatePasswordMatch(createPassword, confirmPassword);
    if (!matchCheck.isValid) {
      newErrors.confirmPassword = matchCheck.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const topError = newErrors.confirmPassword || newErrors.createPassword || "Please resolve the password errors below.";
      setErrorMessage(topError);
      toast.error(topError);
      return;
    }

    setErrors({});
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Account activated successfully!");
    }, 600);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Activate your account"
          description={
            isSuccess
              ? "Your administrator credentials are now activated. You can proceed to sign in."
              : "Create a secure password to complete your account setup."
          }
        />

        {isSuccess ? (
          <div className="space-y-4 animate-auth-card">
            <div className="p-3.5 rounded-xl bg-[#B8E5B8]/20 border border-[#B8E5B8]/40 text-center text-xs sm:text-sm text-[#438B3E] font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Account activated successfully!</span>
            </div>

            <Link
              href="/login"
              className="group w-full h-11 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Top Error Alert Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-auth-fade shadow-xs"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-destructive" />
                <div className="flex-1">
                  <p className="font-semibold leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Create Password */}
            <div className="space-y-1.5">
              <PasswordField
                id="create-password"
                name="createPassword"
                label="Create password"
                placeholder="Enter your password"
                autoComplete="new-password"
                value={createPassword}
                error={errors.createPassword}
                onChange={handleCreatePasswordChange}
              />

              {/* Password Strength Meter */}
              {createPassword && (
                <div className="pt-0.5 space-y-1 animate-auth-fade">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-[#75787B]">Password strength</span>
                    <span
                      className={
                        strength.label === "Strong"
                          ? "text-[#438B3E]"
                          : strength.label === "Fair"
                          ? "text-[#ED8B00]"
                          : "text-amber-500"
                      }
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex gap-1.5 h-1 w-full">
                    <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : "bg-gray-200"}`} />
                    <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : "bg-gray-200"}`} />
                    <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : "bg-gray-200"}`} />
                  </div>
                  <p className="text-[10px] text-[#75787B]">
                    Use 8+ characters with letters, numbers & symbols.
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <PasswordField
                id="confirm-activate-password"
                name="confirmPassword"
                label="Confirm password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={confirmPassword}
                error={errors.confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="group w-full h-11 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  <span>Activating account...</span>
                </>
              ) : (
                <>
                  <span>Activate account</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
                </>
              )}
            </Button>

            {/* Account Security Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#75787B] select-none">
              <ShieldCheck className="size-3.5 text-[#438B3E] shrink-0" strokeWidth={2} />
              <span className="font-medium text-[#54585A]">Secure account setup</span>
            </div>
          </form>
        )}

        {/* Already Activated Link */}
        <div className="pt-1.5 border-t border-[#EAE9F0] text-center text-[11px] sm:text-xs text-[#75787B] flex items-center justify-center gap-1.5 flex-wrap">
          <span>Already activated your account?</span>
          <Link
            href="/login"
            className="font-semibold text-[#438B3E] hover:text-[#367632] hover:underline transition-colors duration-150"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}