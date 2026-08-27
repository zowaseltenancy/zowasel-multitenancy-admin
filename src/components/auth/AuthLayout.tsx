"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2,
  Boxes,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

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
      ease: [0.22, 1, 0.36, 1] as const,
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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] text-foreground antialiased selection:bg-[#438B3E]/20 selection:text-[#438B3E] overflow-y-auto lg:overflow-hidden">
      {/* =========================================================================
          LEFT BRAND PANEL (~45% width on desktop)
          Dominant Background: PANTONE 7741 C (#2E6830)
          Restrained, elegant, enterprise vector accents
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
                id="layout-brand-dot-grid"
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="#B8E5B8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#layout-brand-dot-grid)" />
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
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
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
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] as const }}
            className="mt-0.5 text-xs sm:text-sm font-bold tracking-[0.2em] text-[#B8E5B8] uppercase"
          >
            MULTITENANCY PLATFORM
          </motion.div>

          {/* Subtle Multi-Stop Accent Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
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
          Subtle ambient texture & centered card
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
                id="layout-cream-dot-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#layout-cream-dot-pattern)" />
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

        {/* Main Content: Centered Auth Card */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-2 xl:py-3">
          {children}
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