"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Expiration countdown: 10 minutes (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);

  // Resend cooldown timer: 60 seconds rate-limit
  const [resendCooldown, setResendCooldown] = useState(0);

  // Live countdown for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Live cooldown timer for Resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const cooldownTimer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (digits: string[]) => {
    setOtp(digits);
    if (errorMessage) setErrorMessage(null);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;

    setTimeLeft(600);
    setResendCooldown(60);
    setOtp(["", "", "", "", "", ""]);
    setErrorMessage(null);
    toast.success("A fresh 6-digit verification code has been sent to your email.");

    const firstInput = document.getElementById("otp-0") as HTMLInputElement | null;
    firstInput?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    if (timeLeft === 0) {
      setErrorMessage("This verification code has expired. Please request a new one.");
      toast.error("Code expired. Please click 'Resend code'.");
      return;
    }

    const code = otp.join("");
    if (code.length < 6 || otp.some((d) => !d)) {
      setErrorMessage("Please enter all 6 digits of your verification code.");
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    // Demo failure condition if entering "000000"
    if (code === "000000") {
      setErrorMessage("Invalid security code. Please check your email and try again.");
      toast.error("Invalid verification code.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Authentication verified successfully!");
    }, 600);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Verify your account"
          description={
            isSuccess
              ? "Your security code has been verified. You can now proceed to sign in."
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

            {/* 6 Digit OTP Inputs */}
            <div className="space-y-1.5">
              <OTPInput
                value={otp}
                onChange={handleOtpChange}
                hasError={!!errorMessage}
                disabled={isLoading || timeLeft === 0}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || otp.some((d) => !d) || timeLeft === 0}
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

            {/* Code Expiration / Security Message */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] select-none">
              {timeLeft > 0 ? (
                <>
                  <ShieldCheck className="size-3.5 text-[#438B3E] shrink-0" strokeWidth={2} />
                  <span className="font-medium text-[#54585A]">
                    This code will expire in{" "}
                    <span className="text-[#438B3E] font-bold tabular-nums">{formatTime(timeLeft)}</span>
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="size-3.5 text-destructive shrink-0" strokeWidth={2} />
                  <span className="font-semibold text-destructive">
                    This code has expired. Please request a new code.
                  </span>
                </>
              )}
            </div>

            {/* Resend and Back Navigation */}
            <div className="pt-1.5 border-t border-[#EAE9F0] flex items-center justify-between text-[11px] sm:text-xs text-[#75787B] flex-wrap gap-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="group font-semibold text-[#438B3E] hover:text-[#367632] hover:underline inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:text-[#75787B] disabled:no-underline"
              >
                <RotateCw className={`size-3.5 transition-transform duration-200 ${resendCooldown === 0 ? "group-hover:rotate-45" : ""}`} />
                <span>
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                </span>
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
