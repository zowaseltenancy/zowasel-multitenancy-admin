"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  FolderKanban,
  Boxes,
  ShieldCheck,
} from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    router.push("/admin");
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] dark:bg-[#0D1117] text-foreground antialiased selection:bg-[#438B3E]/20 selection:text-[#438B3E]">
      {/* =========================================================================
          LEFT BRAND PANEL (~45% width on desktop)
          Dominant Background: PANTONE 7741 C (#438B3E)
          Restrained, elegant, enterprise vector accents (no photos/clutter)
          ========================================================================= */}
      <aside
        aria-label="Brand Overview"
        className="hidden lg:flex lg:w-[45%] min-h-screen flex-col justify-between relative overflow-hidden bg-[#438B3E] text-white p-10 xl:p-14 select-none animate-auth-left"
      >
        {/* Subtle Decorative Background Graphics (SVG) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#B8E5B8]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#30682c]/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-white/[0.03] blur-2xl" />

          {/* Faint Dot Grid Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.08]"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="brand-dot-grid"
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="#FFFFFF" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brand-dot-grid)" />
          </svg>

          {/* Faint Curved Lines & Restrained Geometric Contours */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.12]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 1000"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="850" cy="500" r="320" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="850" cy="500" r="480" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="850" cy="500" r="640" stroke="#B8E5B8" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="850" cy="500" r="800" stroke="#FFFFFF" strokeWidth="1" />

            <path
              d="M -100 200 C 250 180, 450 420, 900 350"
              stroke="#B8E5B8"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M -100 350 C 300 300, 500 600, 900 520"
              stroke="#FFFFFF"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M -100 800 C 200 700, 450 900, 900 780"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeDasharray="8 8"
              fill="none"
            />
          </svg>
        </div>

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-white/95 uppercase backdrop-blur-md shadow-xs">
            <span className="size-2 rounded-full bg-[#B8E5B8] animate-pulse" />
            <span>Enterprise Admin Console</span>
          </div>
          <div className="text-xs text-white/70 font-medium tracking-wide">
            v0.1
          </div>
        </div>

        {/* Centered Zowasel Branding & Core Message */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 py-8 max-w-lg mx-auto">
          {/* Zowasel Logo */}
          <div className="mb-4 flex items-center justify-center">
            <Image
              src="/zowasel-logo-white.png"
              alt="Zowasel Logo"
              width={220}
              height={60}
              priority
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
            />
          </div>

          <div className="mt-1 text-xs sm:text-sm font-bold tracking-[0.2em] text-[#B8E5B8] uppercase">
            MULTITENANCY PLATFORM
          </div>

          {/* Subtle Multi-Stop Accent Line: 7741 C, 359 C, 144 U */}
          <div
            className="my-5 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#438B3E] via-[#B8E5B8] to-[#ED8B00] shadow-xs"
            aria-hidden="true"
          />

          {/* Supporting Statement Copy */}
          <p className="max-w-md text-sm sm:text-base font-normal leading-relaxed text-white/95 mt-1 text-center">
            One workspace for managing your organizations, projects, and modules.
          </p>

          {/* Feature Indicators Row with Vertical Separators */}
          <div className="mt-8 flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md shadow-sm">
            {/* Organizations: PANTONE 144 U (#ED8B00) */}
            <div className="flex items-center gap-2 px-3 py-1">
              <Building2 className="size-4 text-[#ED8B00] shrink-0" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wide text-white/95">
                Organizations
              </span>
            </div>

            {/* Vertical Separator */}
            <div className="h-4 w-px bg-white/25" aria-hidden="true" />

            {/* Projects: PANTONE 359 C (#B8E5B8) */}
            <div className="flex items-center gap-2 px-3 py-1">
              <FolderKanban className="size-4 text-[#B8E5B8] shrink-0" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wide text-white/95">
                Projects
              </span>
            </div>

            {/* Vertical Separator */}
            <div className="h-4 w-px bg-white/25" aria-hidden="true" />

            {/* Modules: Light Green Variant (#96E396) */}
            <div className="flex items-center gap-2 px-3 py-1">
              <Boxes className="size-4 text-[#96E396] shrink-0" strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wide text-white/95">
                Modules
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Left Trust / Security Indicator */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-white/75">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#B8E5B8] shrink-0" strokeWidth={2} />
            <span>256-bit TLS Encrypted Session</span>
          </div>
          <span className="font-medium">Zowasel Enterprise Security</span>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT AUTH PANEL (~55% width on desktop)
          Background: Warm Cream / Off-White (#FAF8F5 in light, #0D1117 in dark)
          Subtle ambient texture, smooth modern theme toggle & centered login card
          ========================================================================= */}
      <section
        aria-label="Authentication Area"
        className="flex-1 lg:w-[55%] min-h-screen flex flex-col justify-between relative bg-[#FAF8F5] dark:bg-[#0D1117] transition-colors duration-200"
      >
        {/* Subtle Right Panel Ambient Dot Texture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#438B3E]/[0.03] dark:bg-[#438B3E]/[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ED8B00]/[0.02] dark:bg-[#ED8B00]/[0.04] rounded-full blur-3xl" />
          <svg
            className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] dark:opacity-[0.05]"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="cream-dot-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cream-dot-pattern)" />
          </svg>
        </div>

        {/* Top Bar with Responsive Branding and Theme Toggle */}
        <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 sm:py-6 animate-auth-fade">
          {/* Mobile/Tablet Only Mini Brand Header */}
          <div className="lg:hidden flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Zowasel Logo"
              width={36}
              height={36}
              priority
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="text-sm font-bold tracking-tight text-foreground uppercase block leading-none">
                ZOWASEL
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-[#438B3E] uppercase block">
                ADMIN PLATFORM
              </span>
            </div>
          </div>

          {/* Spacer for Desktop */}
          <div className="hidden lg:block" />

          {/* Modern Smooth Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content: Centered Login Card */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-4 sm:py-8">
          <div className="w-full max-w-[490px] mx-auto rounded-[22px] border border-[#DCE8DC] dark:border-white/10 bg-[#F7FAF7] dark:bg-[#141A22] p-8 sm:p-10 shadow-xl shadow-[#438B3E]/[0.03] dark:shadow-black/40 transition-all duration-200 animate-auth-card">
            <div className="space-y-6 sm:space-y-7">
              {/* Card Header */}
              <header className="flex flex-col items-center text-center animate-auth-header">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-xl border border-[#DCE8DC] dark:border-white/10 bg-white dark:bg-[#19212D] p-2.5 shadow-xs">
                    <Image
                      src="/logo.png"
                      alt="Zowasel"
                      width={44}
                      height={44}
                      priority
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground leading-tight">
                  Welcome back
                </h1>

                {/* Small PANTONE 7741 C accent line beneath the heading */}
                <div
                  className="mt-2.5 mb-3 h-1 w-10 rounded-full bg-[#438B3E]"
                  aria-hidden="true"
                />

                <p className="max-w-sm text-sm sm:text-[15px] leading-relaxed text-[#75787B] dark:text-muted-foreground">
                  Sign in to continue to your Zowasel admin workspace.
                </p>
              </header>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-foreground select-none"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75787B] dark:text-[#9AA1B1]">
                      <Mail className="size-4.5" strokeWidth={2} />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@zowasel.com"
                      autoComplete="username"
                      required
                      className="h-12 w-full rounded-xl border border-[#DCE8DC] dark:border-white/10 bg-white dark:bg-[#19212D] pl-11 pr-4 text-sm font-medium text-foreground transition-all duration-200 placeholder:text-[#75787B]/70 dark:placeholder:text-[#9AA1B1]/60 focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-foreground select-none"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75787B] dark:text-[#9AA1B1]">
                      <Lock className="size-4.5" strokeWidth={2} />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-12 w-full rounded-xl border border-[#DCE8DC] dark:border-white/10 bg-white dark:bg-[#19212D] pl-11 pr-11 text-sm font-medium text-foreground transition-all duration-200 placeholder:text-[#75787B]/70 dark:placeholder:text-[#9AA1B1]/60 focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 size-9 rounded-lg text-[#75787B] dark:text-[#9AA1B1] hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4.5 transition-transform duration-150" strokeWidth={2} />
                      ) : (
                        <Eye className="size-4.5 transition-transform duration-150" strokeWidth={2} />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Account Options */}
                <div className="flex items-center justify-between pt-1">
                  <label
                    htmlFor="remember-me"
                    className="flex items-center gap-2.5 text-sm font-medium text-[#54585A] dark:text-foreground/80 cursor-pointer select-none"
                  >
                    <Checkbox id="remember-me" name="remember" />
                    <span>Remember me</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#438B3E] hover:text-[#367632] hover:underline transition-colors duration-150"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Primary Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="group w-full h-12 rounded-xl bg-[#438B3E] hover:bg-[#367632] text-white font-semibold text-base shadow-md shadow-[#438B3E]/20 hover:shadow-lg hover:shadow-[#438B3E]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
                    </>
                  )}
                </Button>

                {/* Understated Security Indicator (Specification Section 17) */}
                <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#B8E5B8]/20 dark:bg-[#438B3E]/15 border border-[#B8E5B8]/40 dark:border-[#438B3E]/25 text-xs text-[#54585A] dark:text-[#9AA1B1] select-none">
                  <ShieldCheck className="size-4 text-[#438B3E] dark:text-[#B8E5B8] shrink-0" strokeWidth={2} />
                  <span className="font-medium">Secure admin access</span>
                </div>
              </form>

              {/* Support Section (Specification Section 18) */}
              <div className="pt-2 border-t border-[#EAE9F0] dark:border-white/5 text-center text-xs text-[#75787B] dark:text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
                <span>Need help?</span>
                <Link
                  href="mailto:support@zowasel.com?subject=Zowasel%20Admin%20Access%20Request"
                  className="font-semibold text-[#ED8B00] hover:text-[#C97200] hover:underline inline-flex items-center gap-1 transition-colors duration-150 group"
                >
                  <span>Contact your administrator</span>
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Platform Footer (Specification Section 20) */}
        <footer className="relative z-20 px-6 py-5 text-xs text-[#75787B] dark:text-[#9AA1B1] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EAE9F0] dark:border-white/5 mx-6 sm:mx-10 animate-auth-fade">
          <div>
            <span>© 2026 Zowasel Technologies. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a
              href="#privacy"
              className="text-[#75787B] dark:text-[#9AA1B1] hover:text-[#438B3E] dark:hover:text-[#B8E5B8] transition-colors duration-150"
            >
              Privacy Policy
            </a>
            <span className="text-[#DCE8DC] dark:text-white/10" aria-hidden="true">•</span>
            <a
              href="#terms"
              className="text-[#75787B] dark:text-[#9AA1B1] hover:text-[#438B3E] dark:hover:text-[#B8E5B8] transition-colors duration-150"
            >
              Terms of Service
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
