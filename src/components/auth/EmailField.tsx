import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EmailFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  required?: boolean;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EmailField({
  id = "email",
  name = "email",
  label = "Email address",
  placeholder = "name@zowasel.com",
  defaultValue,
  disabled = false,
  autoComplete = "username",
  className,
  required = true,
  value,
  error,
  onChange,
}: EmailFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-foreground select-none"
      >
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#75787B]">
          <Mail className="size-4" strokeWidth={2} />
        </div>

        <Input
          id={id}
          name={name}
          type="email"
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          className={cn(
            "h-10.5 w-full rounded-xl border bg-white pl-10 pr-4 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 placeholder:text-[#75787B]/70 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs",
            error
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-4 focus-visible:ring-destructive/15"
              : "border-[#DCE8DC] focus-visible:border-[#438B3E] focus-visible:ring-4 focus-visible:ring-[#438B3E]/15"
          )}
        />
      </div>

      {error && (
        <p className="text-[11px] font-medium text-destructive animate-auth-fade" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}