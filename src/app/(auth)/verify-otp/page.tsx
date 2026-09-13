"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  OTPInput,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { authErrorMessage, useForgotPassword, useVerifyOtp } from "@/features/auth/hooks/useAuth";
import { getResetEmail, setResetEmail, setResetOtp } from "@/lib/auth-session";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Expiration countdown. 5 minutes, matching the server's
  // ADMIN_PASSWORD_RESET_OTP_EXPIRES_MINUTES — a longer local timer would
  // invite users to submit a code the API has already discarded.
  const [timeLeft, setTimeLeft] = useState(300);

  // Resend cooldown timer: 60 seconds rate-limit
  const [resendCooldown, setResendCooldown] = useState(0);

  // Which account is being reset. Stashed by /forgot-password rather than read
  // from the query string, so the address is not sitting in browser history —
  // and so this page needs no Suspense boundary for useSearchParams.
  const [email, setEmail] = useState("");
  useEffect(() => {
    const stored = getResetEmail();
    if (stored) setEmail(stored);
  }, []);

  const forgotPassword = useForgotPassword();
  const verifyOtp = useVerifyOtp();
  // Derived rather than a separate flag — the previous useState was left over
  // from the mock submit and was never set, so the button never showed a
  // pending state.
  const isLoading = verifyOtp.isPending;

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

  const handleResend = async () => {
    if (resendCooldown > 0 || forgotPassword.isPending) return;

    if (!email) {
      setErrorMessage("We lost track of which account this is. Please start again.");
      toast.error("Please re-enter your email address.");
      router.push("/forgot-password");
      return;
    }

    try {
      // Same endpoint as the first request — it retires any unused code before
      // issuing a new one, so only one is ever live per admin.
      await forgotPassword.mutateAsync({ email });
      setResetEmail(email);
      setTimeLeft(300);
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      setErrorMessage(null);
      toast.success("A fresh 6-digit code has been sent. The previous one no longer works.");

      const firstInput = document.getElementById("otp-0") as HTMLInputElement | null;
      firstInput?.focus();
    } catch (error) {
      const message = authErrorMessage(error, "Unable to resend the code. Please try again.");
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    if (!email) {
      setErrorMessage("We lost track of which account this is. Please start again.");
      toast.error("Please re-enter your email address.");
      router.push("/forgot-password");
      return;
    }

    setErrorMessage(null);

    try {
      // POST /admin/auth/verify-otp. The endpoint checks the code without
      // consuming it, so a wrong or expired one fails here rather than after
      // the user has typed a new password twice on the next screen — the same
      // code is still submitted to /admin/auth/reset-password.
      await verifyOtp.mutateAsync({ email, otp: code });
      setResetOtp(code);
      setIsSuccess(true);
    } catch (error) {
      const message = authErrorMessage(
        error,
        "That code is invalid or has expired. Request a new one.",
      );
      setErrorMessage(message);
      toast.error(message);
      // Clear the boxes so a retry starts clean rather than editing a code
      // the server has already rejected.
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Verify your account"
          description={
            isSuccess
              ? "Code captured. Set your new password to finish — it is checked as you save."
              : "Enter the 6-digit code sent to your email to continue."
          }
        />

        {isSuccess ? (
          <div className="space-y-4 animate-auth-card">
            <div className="p-3.5 rounded-xl bg-[#B8E5B8]/20 border border-[#B8E5B8]/40 text-center text-xs sm:text-sm text-[#438B3E] font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Code captured. Next: choose a new password.</span>
            </div>

            <Link
              href="/reset-password"
              className="group w-full h-11 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Set a new password</span>
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
                className="group font-semibold text-[#54585A] hover:text-[#262C3F] hover:underline inline-flex items-center gap-1 transition-colors duration-150"
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
