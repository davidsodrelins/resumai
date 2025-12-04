import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const requestResetMutation = trpc.passwordReset.requestReset.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Digite seu email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await requestResetMutation.mutateAsync({ email });

      if (result.success) {
        setSuccess(true);
        setEmailSent(email);
        setEmail("");
        // Redirect to login after 5 seconds
        setTimeout(() => {
          setLocation("/login");
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao solicitar reset de senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🔑</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Esqueceu a Senha?
            </h1>
            <p className="text-gray-600 mt-2">
              Digite seu email para receber um link de reset
            </p>
          </div>

          {/* Success State */}
          {success && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Email de reset enviado com sucesso!
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Próximos passos:</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                  <li>Verifique seu email ({emailSent})</li>
                  <li>Clique no link de reset de senha</li>
                  <li>Digite sua nova senha</li>
                  <li>Faça login com a nova senha</li>
                </ul>
              </div>

              <p className="text-xs text-gray-600 text-center">
                Redirecionando para login em alguns segundos...
              </p>

              <Button
                onClick={() => setLocation("/login")}
                variant="outline"
                className="w-full"
              >
                Voltar ao Login Agora
              </Button>
            </div>
          )}

          {/* Error State */}
          {error && !success && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enviaremos um link de reset para este email
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Link de Reset"
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Lembrou sua senha?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/login")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Voltar ao login
                  </button>
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-xs text-yellow-900">
                  <strong>💡 Dica:</strong> O link de reset expira em 15 minutos
                  por segurança. Se expirar, solicite um novo link.
                </p>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
