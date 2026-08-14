import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  description: string;
  showLogo?: boolean;
}

export default function AuthHeader({
  title,
  description,
  showLogo = true,
}: AuthHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center animate-auth-header">
      {showLogo && (
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-xl border border-[#DCE8DC] dark:border-white/10 bg-white dark:bg-[#19212D] p-2.5 shadow-xs">
            <Image
              src="/logo.png"
              alt="Zowasel"
              width={46}
              height={46}
              priority
              className="h-11 w-auto object-contain"
            />
          </div>
        </div>
      )}

      <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground leading-tight">
        {title}
      </h1>

      {/* Small PANTONE 7741 C accent line beneath heading (bx.docx Section 6 & 15) */}
      <div
        className="mt-2.5 mb-3 h-1 w-10 rounded-full bg-[#438B3E]"
        aria-hidden="true"
      />

      <p className="max-w-sm text-sm sm:text-[15px] leading-relaxed text-[#75787B] dark:text-muted-foreground">
        {description}
      </p>
    </header>
  );
}