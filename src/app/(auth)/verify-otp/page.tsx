"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCw, ShieldCheck } from "lucide-react";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  OTPInput,
} from "@/components/auth";
import { Button } from "@/components/ui/button";

export default function VerifyOtpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleResend = () => {
    setResendStatus("A new verification code has been dispatched.");
    setTimeout(() => {
      setResendStatus(null);
    }, 3000);
  };

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
          title="Verify your account"
          description={
            isSuccess
              ? "Your security code has been verified. Redirecting to workspace..."
              : "Enter the 6-digit code sent to your email to continue."
          }
        />

        {isSuccess ? (
          <div className="space-y-4 animate-auth-card">
            <div className="p-3.5 rounded-xl bg-[#B8E5B8]/20 border border-[#B8E5B8]/40 text-center text-xs sm:text-sm text-[#438B3E] font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Authentication verified successfully!</span>
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 6 Digit OTP Inputs */}
            <div className="space-y-1.5">
              <OTPInput value={otp} onChange={setOtp} />
            </div>

            {resendStatus && (
              <div className="text-center text-xs font-medium text-[#438B3E] animate-auth-fade">
                {resendStatus}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || otp.some((d) => !d)}
              className="group w-full h-11 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  <span>Verifying code...</span>
                </>
              ) : (
                <>
                  <span>Verify code</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
                </>
              )}
            </Button>

            {/* Code Expiration / Security Message (bx.docx Section 10) */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#75787B] select-none">
              <ShieldCheck className="size-3.5 text-[#438B3E] shrink-0" strokeWidth={2} />
              <span className="font-medium text-[#54585A]">This code will expire in <span className="text-[#438B3E] font-bold">10:00</span></span>
            </div>

            {/* Resend and Back Navigation (bx.docx Section 11) */}
            <div className="pt-1.5 border-t border-[#EAE9F0] flex items-center justify-between text-[11px] sm:text-xs text-[#75787B] flex-wrap gap-2">
              <button
                type="button"
                onClick={handleResend}
                className="group font-semibold text-[#438B3E] hover:text-[#367632] hover:underline inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
              >
                <RotateCw className="size-3.5 transition-transform duration-200 group-hover:rotate-45" />
                <span>Resend code</span>
              </button>

              <Link
                href="/login"
                className="group font-semibold text-[#54585A] hover:text-foreground hover:underline inline-flex items-center gap-1 transition-colors duration-150"
              >
                <ArrowLeft className="size-3.5 inline transition-transform duration-150 group-hover:-translate-x-0.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
