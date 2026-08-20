export interface PasswordStrength {
  score: number;
  label: "None" | "Weak" | "Fair" | "Strong";
  color: string;
}

/**
 * Evaluates password strength based on length, character variety, and complexity.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "None", color: "bg-gray-200" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-amber-400" };
  if (score <= 3) return { score: 2, label: "Fair", color: "bg-[#ED8B00]" };
  return { score: 3, label: "Strong", color: "bg-[#438B3E]" };
}

/**
 * Validates whether two password strings match.
 */
export function validatePasswordMatch(password: string, confirmPassword: string): {
  isValid: boolean;
  error?: string;
} {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password." };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match." };
  }
  return { isValid: true };
}
