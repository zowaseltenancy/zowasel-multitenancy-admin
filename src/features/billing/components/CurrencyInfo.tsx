import { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
}

export default function CurrencyInfo({
  label,
  value,
}: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <div className="font-medium">
        {value}
      </div>
    </div>
  );
}