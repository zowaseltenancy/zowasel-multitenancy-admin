"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  PasswordField,
} from "@/components/auth";
import { Button } from "@/components/ui/button";

export default function ActivateAccountPage() {
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength evaluation (bx.docx Section 17)
  const getStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-amber-400" };
    if (score <= 3) return { score: 2, label: "Fair", color: "bg-[#ED8B00]" };
    return { score: 3, label: "Strong", color: "bg-[#438B3E]" };
  };

  const strength = getStrength(createPassword);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
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
            {/* Create Password */}
            <div className="space-y-1.5">
              <PasswordField
                id="create-password"
                name="createPassword"
                label="Create password"
                placeholder="Enter your password"
                autoComplete="new-password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
              />

              {/* Password Strength Meter (bx.docx Section 17 & 18) */}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Account Security Indicator (bx.docx Section 20) */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#75787B] select-none">
              <ShieldCheck className="size-3.5 text-[#438B3E] shrink-0" strokeWidth={2} />
              <span className="font-medium text-[#54585A]">Secure account setup</span>
            </div>
          </form>
        )}

        {/* Already Activated Link (bx.docx Section 22) */}
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