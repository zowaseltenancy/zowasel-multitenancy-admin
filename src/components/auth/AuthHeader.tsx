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
      )}

      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#262C3F] leading-tight">
        {title}
      </h1>

      {/* Small PANTONE 7741 C accent line beneath heading (bx.docx Section 6 & 15) */}
      <div
        className="mt-2 mb-2 h-1 w-9 rounded-full bg-[#438B3E]"
        aria-hidden="true"
      />

      <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-[#75787B]">
        {description}
      </p>
    </header>
  );
}