"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  EmailField,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { authErrorMessage, useForgotPassword } from "@/features/auth/hooks/useAuth";
import { setResetEmail } from "@/lib/auth-session";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const forgotPassword = useForgotPassword();
  const isLoading = forgotPassword.isPending;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage(null);
    if (emailError) setEmailError(undefined);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    if (!email.trim()) {
      setEmailError("Email address is required.");
      setErrorMessage("Please enter your registered email address.");
      toast.error("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      setErrorMessage("Invalid email format. Please check and try again.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setEmailError(undefined);
    setErrorMessage(null);

    const normalised = email.trim().toLowerCase();

    try {
      // POST /admin/auth/forgot-password. Always 200, whether or not the
      // address belongs to an admin — the endpoint refuses to confirm which
      // emails exist, so the confirmation copy below stays deliberately vague.
      await forgotPassword.mutateAsync({ email: normalised });
      // Stashed so /verify-otp and /reset-password can spend the code without
      // the user retyping their address.
      setResetEmail(normalised);
      setIsSubmitted(true);
      toast.success("If that email belongs to an admin account, a reset code has been sent.");
    } catch (error) {
      const message = authErrorMessage(error, "Unable to send the reset code. Please try again.");
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Forgot password?"
          description={
            isSubmitted
              ? "If that address belongs to an admin account, a 6-digit code is on its way. It expires in 5 minutes."
              : "Enter your registered administrator email address and we'll send you a 6-digit verification code."
          }
        />

        {isSubmitted ? (
          <div className="space-y-4 animate-auth-card">
            <div className="p-3.5 rounded-xl bg-[#B8E5B8]/20 border border-[#B8E5B8]/40 text-center text-xs sm:text-sm text-[#438B3E] font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Check your inbox for the 6-digit code.</span>
            </div>

            <Link
              href={`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`}
              className="group w-full h-11 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Enter the code</span>
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

            <EmailField
              value={email}
              onChange={handleEmailChange}
              error={emailError}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="group w-full h-11 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4.5 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <>
                  <span>Send reset code</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
                </>
              )}
            </Button>

            {/* Understated Security Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#75787B] select-none">
              <ShieldCheck className="size-3.5 text-[#438B3E] shrink-0" strokeWidth={2} />
              <span className="font-medium text-[#54585A]">Secure account recovery</span>
            </div>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="pt-1.5 border-t border-[#EAE9F0] text-center text-[11px] sm:text-xs text-[#75787B] flex items-center justify-center gap-1.5 flex-wrap">
          <span>Remember your password?</span>
          <Link
            href="/login"
            className="group font-semibold text-[#438B3E] hover:text-[#367632] hover:underline inline-flex items-center gap-1 transition-colors duration-150"
          >
            <ArrowLeft className="size-3.5 inline transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}