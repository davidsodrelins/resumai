import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function ResetPassword() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const resetPasswordMutation = trpc.passwordReset.resetPassword.useMutation();
  const validateTokenQuery = trpc.passwordReset.validateToken.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");

    if (!tokenParam) {
      setError("Token não fornecido. Verifique o link de reset.");
      setLoading(false);
      return;
    }

    setToken(tokenParam);
    setLoading(false);
  }, []);

  // Validate token
  useEffect(() => {
    if (validateTokenQuery.data) {
      setTokenValid(validateTokenQuery.data.valid);
      if (!validateTokenQuery.data.valid) {
        setError("Token inválido ou expirado. Solicite um novo reset de senha.");
      }
    }
  }, [validateTokenQuery.data]);

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }

    if (newPassword.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não correspondem");
      return;
    }

    setValidating(true);
    setError("");

    try {
      const result = await resetPasswordMutation.mutateAsync({
        token,
        newPassword,
        confirmPassword,
      });

      if (result.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha");
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <p className="text-center mt-4 text-gray-600">Carregando...</p>
        </Card>
      </div>
    );
  }

  if (!tokenValid && validateTokenQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <p className="text-center mt-4 text-gray-600">Validando token...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Redefinir Senha
            </h1>
            <p className="text-gray-600 mt-2">
              Digite sua nova senha abaixo
            </p>
          </div>

          {/* Success State */}
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Senha redefinida com sucesso! Redirecionando para login...
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Token Invalid */}
          {!tokenValid && !validateTokenQuery.isLoading && (
            <div className="space-y-4">
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Token inválido ou expirado
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => navigate("/forgot-password")}
                className="w-full"
              >
                Solicitar novo reset
              </Button>
            </div>
          )}

          {/* Form */}
          {tokenValid && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={validating}
                  className="w-full"
                  minLength={8}
                />
                <PasswordStrengthIndicator password={newPassword} showRequirements={true} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={validating}
                  className={`w-full ${
                    confirmPassword && !passwordsMatch
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-600 mt-1">
                    As senhas não correspondem
                  </p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="text-xs text-green-600 mt-1">✓ Senhas correspondem</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  validating ||
                  !newPassword ||
                  !confirmPassword ||
                  !passwordsMatch
                }
                className="w-full"
              >
                {validating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  "Redefinir Senha"
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Lembrou sua senha?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Voltar ao login
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
