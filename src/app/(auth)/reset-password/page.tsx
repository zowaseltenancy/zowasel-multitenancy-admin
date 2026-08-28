"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  PasswordField,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { getPasswordStrength, validatePasswordMatch } from "@/lib/password";
import { authErrorMessage, useResetPassword } from "@/features/auth/hooks/useAuth";
import { clearResetState, getResetEmail, getResetOtp } from "@/lib/auth-session";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const router = useRouter();
  const resetPassword = useResetPassword();
  const isLoading = resetPassword.isPending;

  // Carried from /forgot-password and /verify-otp. Read in an effect because
  // localStorage does not exist during the server render.
  const [credentials, setCredentials] = useState<{ email: string; otp: string } | null>(null);
  useEffect(() => {
    const email = getResetEmail();
    const otp = getResetOtp();
    if (email && otp) {
      setCredentials({ email, otp });
      return;
    }
    // Landing here directly has nothing to spend — send them back rather than
    // showing a form that cannot succeed.
    toast.error("Request a reset code before setting a new password.");
    router.replace("/forgot-password");
  }, [router]);

  const strength = getPasswordStrength(newPassword);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);
    if (errorMessage) setErrorMessage(null);
    if (errors.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: undefined }));
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters.";
    }

    const matchCheck = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchCheck.isValid) {
      newErrors.confirmPassword = matchCheck.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const topError = newErrors.confirmPassword || newErrors.newPassword || "Please resolve the password errors below.";
      setErrorMessage(topError);
      toast.error(topError);
      return;
    }

    setErrors({});
    setErrorMessage(null);

    if (!credentials) {
      toast.error("Request a reset code before setting a new password.");
      router.replace("/forgot-password");
      return;
    }

    try {
      // This is where the OTP is actually checked — the admin flow verifies the
      // code and sets the password in one call. A wrong, expired, already-used
      // or mismatched code all come back as the same 401, by design.
      await resetPassword.mutateAsync({
        email: credentials.email,
        otp: credentials.otp,
        newPassword,
        confirmPassword,
      });
      // The code is single-use and every session was just revoked server-side,
      // so nothing here is worth keeping.
      clearResetState();
      setIsSuccess(true);
      toast.success("Password reset. Sign in with your new password.");
    } catch (error) {
      const message = authErrorMessage(
        error,
        "That reset code is invalid or has expired. Request a new one.",
      );
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Reset your password"
          description={
            isSuccess
              ? "Your password has been updated, and every other session was signed out. Sign in with your new password."
              : "Create a strong new password to secure your administrator account."
          }
        />

        {isSuccess ? (
          <div className="space-y-4 animate-auth-card">
            <div className="p-3.5 rounded-xl bg-[#B8E5B8]/20 border border-[#B8E5B8]/40 text-center text-xs sm:text-sm text-[#438B3E] font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Password updated successfully!</span>
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

            {/* New Password */}
            <div className="space-y-1.5">
              <PasswordField
                id="new-password"
                name="newPassword"
                label="New password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                value={newPassword}
                error={errors.newPassword}
                onChange={handleNewPasswordChange}
              />

              {/* Password Strength Meter */}
              {newPassword && (
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
                id="confirm-password"
                name="confirmPassword"
                label="Confirm new password"
                placeholder="Confirm your new password"
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
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span>Reset password</span>
                  <CheckCircle2 className="size-4 transition-transform duration-200 group-hover:scale-105" strokeWidth={2.2} />
                </>
              )}
            </Button>

            {/* Understated Security Indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#75787B] select-none">
              <ShieldCheck className="size-3.5 text-[#438B3E] shrink-0" strokeWidth={2} />
              <span className="font-medium text-[#54585A]">256-bit encrypted credential update</span>
            </div>
          </form>
        )}

        {/* Back to Sign In Link */}
        <div className="pt-1.5 border-t border-[#EAE9F0] text-center text-[11px] sm:text-xs text-[#75787B] flex items-center justify-center gap-1.5 flex-wrap">
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