import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const verifyMutation = trpc.auth.verifyEmail.useMutation();
  const resendMutation = trpc.auth.resendVerificationEmail.useMutation();

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Token de verificação não encontrado na URL");
        return;
      }

      try {
        await verifyMutation.mutateAsync({ token });
        setStatus("success");
        setMessage("Email verificado com sucesso!");
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          setLocation("/dashboard");
        }, 3000);
      } catch (error: any) {
        const errorMessage = error.message || "Erro ao verificar email";
        
        if (errorMessage.includes("expirado")) {
          setStatus("expired");
          setMessage("Token expirado. Solicite um novo link de verificação.");
        } else {
          setStatus("error");
          setMessage(errorMessage);
        }
      }
    };

    verifyEmail();
  }, []);

  const handleResendEmail = async () => {
    if (!email) {
      alert("Por favor, digite seu email");
      return;
    }

    setResendLoading(true);
    try {
      await resendMutation.mutateAsync({ email });
      setMessage("Email de verificação reenviado com sucesso! Verifique sua caixa de entrada.");
      setStatus("success");
    } catch (error: any) {
      setMessage(error.message || "Erro ao reenviar email");
      setStatus("error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Mail className="w-12 h-12 mx-auto text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Verificar Email</h1>
          </div>

          {/* Loading State */}
          {status === "loading" && (
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
              <p className="text-gray-600">Verificando seu email...</p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              </div>
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {message}
                </AlertDescription>
              </Alert>
              {message.includes("reenviado") ? (
                <p className="text-sm text-gray-600 text-center">
                  Clique no link no email para verificar sua conta.
                </p>
              ) : (
                <p className="text-sm text-gray-600 text-center">
                  Redirecionando para o dashboard em 3 segundos...
                </p>
              )}
              <Button
                onClick={() => setLocation("/dashboard")}
                className="w-full"
              >
                Ir para Dashboard
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="space-y-4">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-red-600" />
              </div>
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {message}
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Não conseguiu verificar? Reenvie o email de verificação:
                </p>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  className="w-full"
                  variant="outline"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    "Reenviar Email"
                  )}
                </Button>
              </div>
              <Button
                onClick={() => setLocation("/login")}
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          )}

          {/* Expired State */}
          {status === "expired" && (
            <div className="space-y-4">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-yellow-600" />
              </div>
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  {message}
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Digite seu email para receber um novo link:
                </p>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  className="w-full"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    "Enviar Novo Link"
                  )}
                </Button>
              </div>
              <Button
                onClick={() => setLocation("/login")}
                className="w-full"
                variant="outline"
              >
                Voltar ao Login
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
