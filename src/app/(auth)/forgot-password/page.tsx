import Link from "next/link";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  EmailField,
} from "@/components/auth";

import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Forgot Password?"
          description="Enter the email associated with your account and we'll send you a verification code."
        />

        <form className="space-y-6">
          <EmailField />

          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            Send Code
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}