import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({
  children,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[460px] mx-auto rounded-[20px] border border-[#DCE8DC] bg-[#F7FAF7] p-6 sm:p-8 shadow-xl shadow-[#438B3E]/[0.03] transition-all duration-200 animate-auth-card",
        className
      )}
    >
      <div className="space-y-4 sm:space-y-5">
        {children}
      </div>
    </div>
  );
}