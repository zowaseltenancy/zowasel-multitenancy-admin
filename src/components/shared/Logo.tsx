import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Zowasel"
      width={56}
      height={56}
      priority
      className={className}
    />
  );
}