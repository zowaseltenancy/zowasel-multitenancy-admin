interface Props {
  label: string;

  value: string;
}

export default function SubscriptionInfo({
  label,
  value,
}: Props) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 font-medium">
        {value}
      </p>
    </div>
  );
}
