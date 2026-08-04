import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

/**
 * Restroom-pictogram style silhouettes matching the manwoman.jpg reference.
 * Male: Head circle, rounded shoulders/torso, straight arms, split legs.
 * Female: Head circle, flared A-line dress with angled arms, straight legs.
 */

export function MaleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4 shrink-0", className)}>
      {/* Head */}
      <circle cx="12" cy="4" r="2.5" />
      {/* Torso */}
      <path d="M9.5 7.5h5a2 2 0 0 1 2 2v5.5h-9v-5.5a2 2 0 0 1 2-2z" />
      {/* Left Arm */}
      <rect x="7" y="8" width="1.8" height="7.5" rx="0.9" />
      {/* Right Arm */}
      <rect x="15.2" y="8" width="1.8" height="7.5" rx="0.9" />
      {/* Left Leg */}
      <rect x="9.5" y="14.2" width="2" height="7.8" rx="1" />
      {/* Right Leg */}
      <rect x="12.5" y="14.2" width="2" height="7.8" rx="1" />
    </svg>
  );
}

export function FemaleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4 shrink-0", className)}>
      {/* Head */}
      <circle cx="12" cy="4" r="2.5" />
      {/* Flared Dress / Skirt */}
      <path d="M12 7.5c-1.2 0-2.2.6-2.7 1.6l-3.5 6.8c-.3.6.1 1.3.8 1.3h10.8c.7 0 1.1-.7.8-1.3l-3.5-6.8c-.5-1-1.5-1.6-2.7-1.6z" />
      {/* Left Arm (angled along dress) */}
      <rect x="7" y="8" width="1.6" height="7" rx="0.8" transform="rotate(18 7.8 11.5)" />
      {/* Right Arm (angled along dress) */}
      <rect x="15.4" y="8" width="1.6" height="7" rx="0.8" transform="rotate(-18 16.2 11.5)" />
      {/* Left Leg */}
      <rect x="9.5" y="16" width="2" height="6.2" rx="1" />
      {/* Right Leg */}
      <rect x="12.5" y="16" width="2" height="6.2" rx="1" />
    </svg>
  );
}

interface GenderIconProps extends IconProps {
  gender?: "male" | "female" | "other" | string;
}

export default function GenderIcon({ gender, className }: GenderIconProps) {
  const normalizedGender = gender?.toLowerCase();

  if (normalizedGender === "male") {
    return <MaleIcon className={cn("text-sky-500 dark:text-sky-400", className)} />;
  }

  if (normalizedGender === "female") {
    return <FemaleIcon className={cn("text-pink-500 dark:text-pink-400", className)} />;
  }

  return null;
}

