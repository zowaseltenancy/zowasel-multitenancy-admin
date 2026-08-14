import { ReactNode } from "react";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden bg-[#FAF8F5] dark:bg-[#0D1117] text-foreground antialiased selection:bg-[#438B3E]/20 selection:text-[#438B3E] transition-colors duration-200">
      {/* Subtle Background Ambient Accents & Dot Grid (bx.docx Section 1) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#438B3E]/[0.04] dark:bg-[#438B3E]/[0.07] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#ED8B00]/[0.03] dark:bg-[#ED8B00]/[0.05] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />

        {/* Faint Dotted Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="bx-dot-grid"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bx-dot-grid)" />
        </svg>

        {/* Faint Circular Arcs */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="600" cy="400" r="340" stroke="#438B3E" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="600" cy="400" r="500" stroke="#438B3E" strokeWidth="1" />
          <circle cx="600" cy="400" r="660" stroke="#B8E5B8" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Top Header with Brand Badge & Theme Toggle (bx.docx Section 5) */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 sm:py-6 animate-auth-fade">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[#438B3E] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-[#75787B] dark:text-[#9AA1B1] uppercase">
            Zowasel Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Centered Main Authentication Card Container (bx.docx Section 3) */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-6 sm:py-10">
        <div className="w-full max-w-[500px]">
          {children}
        </div>
      </div>

      {/* Bottom Footer (bx.docx Section 14 & 23) */}
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
    </main>
  );
}