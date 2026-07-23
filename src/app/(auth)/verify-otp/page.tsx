import Link from "next/link";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  OTPInput,
} from "@/components/auth";

import { Button } from "@/components/ui/button";

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Verify Code"
          description="Enter the 6-digit verification code sent to your email."
        />

        <form className="space-y-6">
          <OTPInput />

          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            Verify Code
          </Button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <button
            type="button"
            className="text-primary hover:underline"
          >
            Resend Code
          </button>

          <Link
            href="/login"
            className="text-primary hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}