import Link from "next/link";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  PasswordField,
} from "@/components/auth";

import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Reset Password"
          description="Create a new password to secure your account."
        />

        <form className="space-y-6">
          <PasswordField
            label="New Password"
            autoComplete="new-password"
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
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