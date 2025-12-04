/**
 * Calcula a força de uma senha em uma escala de 0-100
 * Retorna um objeto com pontuação, nível e feedback
 */
export interface PasswordStrengthResult {
  score: number; // 0-100
  level: "fraca" | "média" | "forte" | "muito-forte";
  color: "red" | "yellow" | "blue" | "green";
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
}

export function calculatePasswordStrength(
  password: string
): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];

  // Requisitos
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  // Pontuação por comprimento
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Pontuação por tipos de caracteres
  if (requirements.hasUppercase) score += 15;
  if (requirements.hasLowercase) score += 15;
  if (requirements.hasNumbers) score += 15;
  if (requirements.hasSpecialChars) score += 15;

  // Feedback baseado em requisitos não atendidos
  if (!requirements.minLength) {
    feedback.push("Mínimo de 8 caracteres");
  }
  if (!requirements.hasUppercase) {
    feedback.push("Adicione letras maiúsculas");
  }
  if (!requirements.hasLowercase) {
    feedback.push("Adicione letras minúsculas");
  }
  if (!requirements.hasNumbers) {
    feedback.push("Adicione números");
  }
  if (!requirements.hasSpecialChars) {
    feedback.push("Adicione caracteres especiais (!@#$%^&*)");
  }

  // Determinar nível e cor
  let level: "fraca" | "média" | "forte" | "muito-forte";
  let color: "red" | "yellow" | "blue" | "green";

  if (score < 30) {
    level = "fraca";
    color = "red";
  } else if (score < 60) {
    level = "média";
    color = "yellow";
  } else if (score < 85) {
    level = "forte";
    color = "blue";
  } else {
    level = "muito-forte";
    color = "green";
  }

  return {
    score: Math.min(score, 100),
    level,
    color,
    feedback,
    requirements,
  };
}

/**
 * Retorna a cor em formato Tailwind baseado no nível
 */
export function getPasswordStrengthColor(
  color: "red" | "yellow" | "blue" | "green"
): string {
  const colors = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };
  return colors[color];
}

/**
 * Retorna a cor de texto baseado no nível
 */
export function getPasswordStrengthTextColor(
  color: "red" | "yellow" | "blue" | "green"
): string {
  const colors = {
    red: "text-red-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    green: "text-green-600",
  };
  return colors[color];
}
