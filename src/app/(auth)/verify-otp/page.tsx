1"use client";

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
          <div className="space-y-5 animate-auth-card">
            <div className="p-4 rounded-xl bg-[#B8E5B8]/20 dark:bg-[#438B3E]/15 border border-[#B8E5B8]/40 dark:border-[#438B3E]/30 text-center text-sm text-[#438B3E] dark:text-[#B8E5B8] font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4.5 shrink-0" />
              <span>Authentication verified successfully!</span>
            </div>

            <Link
              href="/login"
              className="group w-full h-12 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit OTP Inputs */}
            <div className="space-y-2">
              <OTPInput value={otp} onChange={setOtp} />
            </div>

            {resendStatus && (
              <div className="text-center text-xs font-medium text-[#438B3E] dark:text-[#B8E5B8] animate-auth-fade">
                {resendStatus}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || otp.some((d) => !d)}
              className="group w-full h-12 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Verifying code...</span>
                </>
              ) : (
                <>
                  <span>Verify code</span>
                  <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
                </>
              )}
            </Button>

            {/* Code Expiration / Security Message (bx.docx Section 10) */}
            <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#B8E5B8]/20 dark:bg-[#438B3E]/15 border border-[#B8E5B8]/40 dark:border-[#438B3E]/25 text-xs text-[#54585A] dark:text-[#9AA1B1] select-none">
              <ShieldCheck className="size-4 text-[#438B3E] dark:text-[#B8E5B8] shrink-0" strokeWidth={2} />
              <span className="font-medium">This code will expire in <span className="text-[#438B3E] dark:text-[#B8E5B8] font-bold">10:00</span></span>
            </div>

            {/* Resend and Back Navigation (bx.docx Section 11) */}
            <div className="pt-2 border-t border-[#EAE9F0] dark:border-white/5 flex items-center justify-between text-xs text-[#75787B] dark:text-muted-foreground flex-wrap gap-2">
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
                className="group font-semibold text-[#54585A] dark:text-[#9AA1B1] hover:text-foreground hover:underline inline-flex items-center gap-1 transition-colors duration-150"
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
