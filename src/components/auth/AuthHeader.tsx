import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export default function AuthHeader({
  title,
  description,
}: AuthHeaderProps) {
  return (
    <header className="mb-10 flex flex-col items-center text-center">
      <Image
        src="/logo.png"
        alt="Zowasel"
        width={64}
        height={64}
        priority
        className="mb-6 h-16 w-auto"
      />

      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>

      <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </header>
  );
}