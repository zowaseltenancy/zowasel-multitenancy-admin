import { Input } from "@/components/ui/input";

interface EmailFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
}

export default function EmailField({
  id = "email",
  name = "email",
  label = "Email Address",
  placeholder = "Enter your email address",
  defaultValue,
  disabled = false,
}: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <Input
        id={id}
        name={name}
        type="email"
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        autoComplete="username"
      />
    </div>
  );
}