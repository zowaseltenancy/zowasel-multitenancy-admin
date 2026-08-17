"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Boxes,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const STATEMENT_WORDS = [
  "One",
  "workspace",
  "for",
  "managing",
  "organizations,",
  "KYB",
  "verification,",
  "modules,",
  "and",
  "billing.",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.25,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const featureListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.85,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

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
    <main className="min-h-screen lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] text-foreground antialiased selection:bg-[#438B3E]/20 selection:text-[#438B3E] overflow-y-auto lg:overflow-hidden">
      {/* =========================================================================
          LEFT BRAND PANEL (~45% width on desktop)
          Dominant Background: PANTONE 7741 C (#2E6830)
          Restrained, elegant, enterprise vector accents (no photos/clutter)
          ========================================================================= */}
      <aside
        aria-label="Brand Overview"
        className="hidden lg:flex lg:w-[45%] h-full flex-col justify-between relative overflow-hidden bg-[#2E6830] text-white p-8 xl:p-10 select-none animate-auth-left"
      >
        {/* Subtle Decorative Background Graphics (SVG) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#B8E5B8]/12 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#1C461E]/60 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-white/[0.02] blur-2xl" />

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
                <circle cx="2" cy="2" r="1.5" fill="#B8E5B8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brand-dot-grid)" />
          </svg>

          {/* Spiral Curved Lines & Geometric Contours */}
          <svg
            className="absolute inset-0 w-full h-full opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 1000"
            fill="none"
          >
            <circle cx="850" cy="500" r="320" stroke="#ED8B00" strokeWidth="1.2" strokeDasharray="6 6" />
            <circle cx="850" cy="500" r="480" stroke="#ED8B00" strokeWidth="1" />
            <circle cx="850" cy="500" r="640" stroke="#ED8B00" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="850" cy="500" r="800" stroke="#ED8B00" strokeWidth="1" />

            <path
              d="M -100 200 C 250 180, 450 420, 900 350"
              stroke="#ED8B00"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M -100 350 C 300 300, 500 600, 900 520"
              stroke="#ED8B00"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M -100 800 C 200 700, 450 900, 900 780"
              stroke="#ED8B00"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              fill="none"
            />
          </svg>
        </div>

        {/* Top Spacer */}
        <div className="relative z-10" />

        {/* Centered Zowasel Branding & Core Message */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 py-4 max-w-lg mx-auto">
          {/* Zowasel Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 flex items-center justify-center"
          >
            <Image
              src="/zowasel-logo-white.png"
              alt="Zowasel Logo"
              width={200}
              height={55}
              priority
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-0.5 text-xs sm:text-sm font-bold tracking-[0.2em] text-[#B8E5B8] uppercase"
          >
            MULTITENANCY PLATFORM
          </motion.div>

          {/* Subtle Multi-Stop Accent Line: 7741 C, 359 C, 144 U */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="my-3.5 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#2E6830] via-[#B8E5B8] to-[#ED8B00] shadow-xs origin-center"
            aria-hidden="true"
          />

          {/* Supporting Statement Copy with Word-by-Word Appearing Text */}
          <motion.p
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md text-xs sm:text-sm font-normal leading-relaxed text-white/95 text-center flex flex-wrap justify-center gap-x-1.5 gap-y-0.5"
          >
            {STATEMENT_WORDS.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          {/* Feature Indicators Row with Staggered Appearance */}
          <motion.div
            variants={featureListVariants}
            initial="hidden"
            animate="visible"
            className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-white/90"
          >
            <motion.span
              variants={featureItemVariants}
              className="inline-flex items-center gap-1.5 font-medium tracking-wide"
            >
              <Building2 className="size-3.5 text-[#ED8B00] shrink-0" strokeWidth={2.2} />
              Organizations
            </motion.span>
            <motion.span
              variants={featureItemVariants}
              className="text-white/30 select-none"
              aria-hidden="true"
            >
              •
            </motion.span>
            <motion.span
              variants={featureItemVariants}
              className="inline-flex items-center gap-1.5 font-medium tracking-wide"
            >
              <ShieldCheck className="size-3.5 text-[#B8E5B8] shrink-0" strokeWidth={2.2} />
              KYB
            </motion.span>
            <motion.span
              variants={featureItemVariants}
              className="text-white/30 select-none"
              aria-hidden="true"
            >
              •
            </motion.span>
            <motion.span
              variants={featureItemVariants}
              className="inline-flex items-center gap-1.5 font-medium tracking-wide"
            >
              <Boxes className="size-3.5 text-[#96E396] shrink-0" strokeWidth={2.2} />
              Modules
            </motion.span>
            <motion.span
              variants={featureItemVariants}
              className="text-white/30 select-none"
              aria-hidden="true"
            >
              •
            </motion.span>
            <motion.span
              variants={featureItemVariants}
              className="inline-flex items-center gap-1.5 font-medium tracking-wide"
            >
              <CreditCard className="size-3.5 text-[#ED8B00] shrink-0" strokeWidth={2.2} />
              Billing
            </motion.span>
          </motion.div>
        </div>

        {/* Bottom Spacer */}
        <div className="relative z-10" />
      </aside>

      {/* =========================================================================
          RIGHT AUTH PANEL (~55% width on desktop)
          Background: Warm Cream / Off-White (#FAF8F5)
          Subtle ambient texture & centered login card
          ========================================================================= */}
      <section
        aria-label="Authentication Area"
        className="flex-1 lg:w-[55%] h-full flex flex-col justify-between relative bg-[#FAF8F5] transition-colors duration-200 overflow-y-auto lg:overflow-hidden"
      >
        {/* Subtle Right Panel Ambient Dot Texture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#438B3E]/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ED8B00]/[0.02] rounded-full blur-3xl" />
          <svg
            className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]"
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

        {/* Top Bar with Responsive Branding */}
        <header className="relative z-20 flex items-center justify-between px-6 py-3.5 sm:px-10 sm:py-4 animate-auth-fade">
          {/* Mobile/Tablet Only Mini Brand Header */}
          <div className="lg:hidden flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Zowasel Logo"
              width={32}
              height={32}
              priority
              className="h-7 w-auto object-contain"
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
        </header>

        {/* Main Content: Centered Login Card */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-2 xl:py-3">
          <div className="w-full max-w-[460px] mx-auto rounded-[20px] border border-[#DCE8DC] bg-[#F7FAF7] p-6 sm:p-8 shadow-xl shadow-[#438B3E]/[0.03] transition-all duration-200 animate-auth-card">
            <div className="space-y-4 sm:space-y-5">
              {/* Card Header */}
              <header className="flex flex-col items-center text-center animate-auth-header">
                <div className="mb-2.5 flex items-center justify-center">
                  <div className="rounded-xl border border-[#DCE8DC] bg-white p-2 shadow-xs">
                    <Image
                      src="/logo.png"
                      alt="Zowasel"
                      width={38}
                      height={38}
                      priority
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight">
                  Welcome back
                </h1>

                {/* Small PANTONE 7741 C accent line beneath the heading */}
                <div
                  className="mt-2 mb-2 h-1 w-9 rounded-full bg-[#438B3E]"
                  aria-hidden="true"
                />

                <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-[#75787B]">
                  Sign in to continue to your Zowasel admin workspace.
                </p>
              </header>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-foreground select-none"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75787B]">
                      <Mail className="size-4" strokeWidth={2} />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@zowasel.com"
                      autoComplete="username"
                      required
                      className="h-10.5 w-full rounded-xl border border-[#DCE8DC] bg-white pl-10 pr-4 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 placeholder:text-[#75787B]/70 focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-foreground select-none"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75787B]">
                      <Lock className="size-4" strokeWidth={2} />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-10.5 w-full rounded-xl border border-[#DCE8DC] bg-white pl-10 pr-10 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 placeholder:text-[#75787B]/70 focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-lg text-[#75787B] hover:text-foreground hover:bg-black/5 transition-colors duration-150 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4 transition-transform duration-150" strokeWidth={2} />
                      ) : (
                        <Eye className="size-4 transition-transform duration-150" strokeWidth={2} />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Account Options */}
                <div className="flex items-center justify-between pt-0.5">
                  <label
                    htmlFor="remember-me"
                    className="flex items-center gap-2 text-xs font-medium text-[#54585A] cursor-pointer select-none"
                  >
                    <Checkbox id="remember-me" name="remember" />
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
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
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
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Platform Footer */}
        <footer className="relative z-20 px-6 py-3 sm:px-10 sm:py-3.5 text-[11px] text-[#75787B] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#EAE9F0] mx-6 sm:mx-10 animate-auth-fade">
          <div>
            <span>© 2026 Zowasel Technologies. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a
              href="#privacy"
              className="text-[#75787B] hover:text-[#438B3E] transition-colors duration-150"
            >
              Privacy Policy
            </a>
            <span className="text-[#DCE8DC]" aria-hidden="true">•</span>
            <a
              href="#terms"
              className="text-[#75787B] hover:text-[#438B3E] transition-colors duration-150"
            >
              Terms of Service
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
