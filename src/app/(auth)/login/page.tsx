"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  EmailField,
  PasswordField,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { authErrorMessage, useLogin } from "@/features/auth/hooks/useAuth";
import { setStoredAdmin } from "@/lib/auth-session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const login = useLogin();
  // Driven by the mutation rather than a separate flag, so the button can never
  // disagree with whether a request is actually in flight.
  const isLoading = login.isPending;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage(null);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Please fill in all required fields correctly.");
      toast.error("Please resolve the errors below.");
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);

    try {
      // POST /admin/auth/login — stores the access token and the admin record
      // on success (see useLogin -> persistLogin). Only then is it safe to
      // navigate; the dashboard's requests all need that token.
      await login.mutateAsync({ email: email.trim(), password });
      toast.success("Signed in successfully!");
      router.push("/admin");
    } catch (error) {
      const message = authErrorMessage(
        error,
        "Invalid email or password. Please verify your credentials and try again.",
      );
      setErrorMessage(message);
      // The API deliberately does not say which half was wrong, so neither do
      // we — both fields are marked without claiming the password specifically.
      setFieldErrors({ email: "Invalid credentials", password: "Invalid credentials" });
      toast.error(message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          description="Sign in to continue to your Zowasel admin workspace."
        />

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Error Alert Banner */}
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

          {/* Email Field */}
          <EmailField
            value={email}
            onChange={handleEmailChange}
            error={fieldErrors.email}
          />

          {/* Password Field */}
          <PasswordField
            value={password}
            onChange={handlePasswordChange}
            error={fieldErrors.password}
          />

          {/* Account Options */}
          <div className="flex items-center justify-between pt-0.5">
            <label
              htmlFor="remember-me"
              className="flex items-center gap-2 text-xs font-medium text-[#54585A] cursor-pointer select-none"
            >
              <Checkbox
                id="remember-me"
                name="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <span>Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#438B3E] hover:text-[#367632] hover:underline transition-colors duration-150"
            >
              Forgot password?
            </Link>
          </div>

          {/* Primary Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="group w-full h-11 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-sm sm:text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4.5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={2.2}
                />
              </>
            )}
          </Button>

          {/* Understated Security Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#75787B] select-none">
            <ShieldCheck className="size-3.5 text-[#438B3E] shrink-0" strokeWidth={2} />
            <span className="font-medium text-[#54585A]">Secure admin access</span>
          </div>
        </form>

        {/* Support Section */}
        <div className="pt-1.5 border-t border-[#EAE9F0] text-center text-[11px] text-[#75787B] flex items-center justify-center gap-1.5 flex-wrap">
          <span>Need help?</span>
          <Link
            href="mailto:support@zowasel.com?subject=Zowasel%20Admin%20Access%20Request"
            className="font-semibold text-[#ED8B00] hover:text-[#C97200] hover:underline inline-flex items-center gap-1 transition-colors duration-150 group"
          >
            <span>Contact your administrator</span>
            <span
              className="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
