import Link from "next/link";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  EmailField,
  PasswordField,
} from "@/components/auth";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          description="Sign in to continue to the Zowasel Admin Platform."
        />

        <form className="space-y-6">
          <EmailField />

          <PasswordField />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox />
              <span>Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Need help accessing your account?{" "}
          <Link
            href="#"
            className="font-medium text-primary hover:underline"
          >
            Contact Administrator
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}