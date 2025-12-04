import { useMemo } from "react";
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthTextColor,
} from "@/lib/passwordStrength";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Barra de força */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600">
            Força da senha
          </span>
          <span
            className={`text-xs font-semibold ${getPasswordStrengthTextColor(
              strength.color
            )}`}
          >
            {strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getPasswordStrengthColor(
              strength.color
            )}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>

        {/* Pontuação */}
        <div className="text-xs text-gray-500">
          Pontuação: {strength.score}/100
        </div>
      </div>

      {/* Requisitos */}
      {showRequirements && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Requisitos:</p>
          <div className="grid grid-cols-2 gap-2">
            {/* Mínimo de 8 caracteres */}
            <div className="flex items-center gap-2">
              {strength.requirements.minLength ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs ${
                  strength.requirements.minLength
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                8+ caracteres
              </span>
            </div>

            {/* Letras maiúsculas */}
            <div className="flex items-center gap-2">
              {strength.requirements.hasUppercase ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs ${
                  strength.requirements.hasUppercase
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                Maiúsculas
              </span>
            </div>

            {/* Letras minúsculas */}
            <div className="flex items-center gap-2">
              {strength.requirements.hasLowercase ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs ${
                  strength.requirements.hasLowercase
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                Minúsculas
              </span>
            </div>

            {/* Números */}
            <div className="flex items-center gap-2">
              {strength.requirements.hasNumbers ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs ${
                  strength.requirements.hasNumbers
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                Números
              </span>
            </div>

            {/* Caracteres especiais */}
            <div className="flex items-center gap-2 col-span-2">
              {strength.requirements.hasSpecialChars ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs ${
                  strength.requirements.hasSpecialChars
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                Caracteres especiais (!@#$%^&*)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((item, index) => (
            <p key={index} className="text-xs text-amber-600">
              • {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
