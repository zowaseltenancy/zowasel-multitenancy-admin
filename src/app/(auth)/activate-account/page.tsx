import Link from "next/link";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  PasswordField,
} from "@/components/auth";

import { Button } from "@/components/ui/button";

export default function ActivateAccountPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Activate Your Account"
          description="Welcome to Zowasel. Create a password to activate your account and complete your account setup."
        />

        <form className="space-y-6">
          <PasswordField
            label="Create Password"
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
            Activate Account
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already activated your account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}