import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const requirements: PasswordRequirement[] = useMemo(() => {
    return [
      {
        label: "Mínimo 6 caracteres",
        met: password.length >= 6,
      },
      {
        label: "Pelo menos uma letra maiúscula",
        met: /[A-Z]/.test(password),
      },
      {
        label: "Pelo menos um número",
        met: /[0-9]/.test(password),
      },
      {
        label: "Pelo menos um caractere especial (!@#$%^&*)",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    if (metCount === 0) return { label: "", color: "" };
    if (metCount <= 1) return { label: "Fraca", color: "text-red-600" };
    if (metCount <= 2) return { label: "Média", color: "text-yellow-600" };
    if (metCount <= 3) return { label: "Boa", color: "text-blue-600" };
    return { label: "Forte", color: "text-green-600" };
  }, [requirements]);

  const progressPercentage = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    return (metCount / requirements.length) * 100;
  }, [requirements]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Força da senha:</span>
          <span className={`font-medium ${strength.color}`}>{strength.label}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercentage <= 25
                ? "bg-red-500"
                : progressPercentage <= 50
                ? "bg-yellow-500"
                : progressPercentage <= 75
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {req.met ? (
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
