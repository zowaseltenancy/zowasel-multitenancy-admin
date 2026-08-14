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
        "w-full max-w-[500px] mx-auto rounded-[22px] border border-[#DCE8DC] dark:border-white/10 bg-[#F7FAF7] dark:bg-[#141A22] p-8 sm:p-10 shadow-xl shadow-[#438B3E]/[0.03] dark:shadow-black/40 transition-all duration-200 animate-auth-card",
        className
      )}
    >
      <div className="space-y-6 sm:space-y-7">
        {children}
      </div>
    </div>
  );
}