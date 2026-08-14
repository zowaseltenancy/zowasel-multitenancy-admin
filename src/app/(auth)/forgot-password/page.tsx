"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  EmailField,
} from "@/components/auth";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Forgot password?"
          description={
            isSubmitted
              ? "We've dispatched password recovery instructions to your email address."
              : "Enter your registered administrator email address and we'll send you a recovery link."
          }
        />

        {isSubmitted ? (
          <div className="space-y-5 animate-auth-card">
            <div className="p-4 rounded-xl bg-[#B8E5B8]/20 dark:bg-[#438B3E]/15 border border-[#B8E5B8]/40 dark:border-[#438B3E]/30 text-center text-sm text-[#438B3E] dark:text-[#B8E5B8] font-medium">
              Please check your email inbox for password recovery instructions.
            </div>

            <Link
              href="/login"
              className="group w-full h-12 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="size-4.5 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.2} />
              <span>Return to Sign in</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <EmailField />

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="group w-full h-12 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Sending link...</span>
                </>
              ) : (
                <>
                  <span>Send recovery link</span>
                  <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
                </>
              )}
            </Button>

            {/* Understated Security Indicator */}
            <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#B8E5B8]/20 dark:bg-[#438B3E]/15 border border-[#B8E5B8]/40 dark:border-[#438B3E]/25 text-xs text-[#54585A] dark:text-[#9AA1B1] select-none">
              <ShieldCheck className="size-4 text-[#438B3E] dark:text-[#B8E5B8] shrink-0" strokeWidth={2} />
              <span className="font-medium">Secure account recovery</span>
            </div>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="pt-2 border-t border-[#EAE9F0] dark:border-white/5 text-center text-xs text-[#75787B] dark:text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
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