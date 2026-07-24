import { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
}

export default function TransactionInfo({
  label,
  value,
}: Props) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 font-medium">
        {value}
      </div>
    </div>
  );
}