import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    // Get token from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Token inválido", {
        description: "Link de recuperação inválido ou expirado",
      });
    }
  }, []);

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setResetSuccess(true);
      toast.success("Senha redefinida!", {
        description: "Você já pode fazer login com sua nova senha",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        setLocation("/login");
      }, 3000);
    },
    onError: (error) => {
      toast.error("Erro ao redefinir senha", {
        description: error.message || "Token inválido ou expirado",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Senha muito curta", {
        description: "A senha deve ter no mínimo 6 caracteres",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Senhas não coincidem", {
        description: "As senhas digitadas são diferentes",
      });
      return;
    }

    if (!token) {
      toast.error("Token inválido", {
        description: "Link de recuperação inválido",
      });
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword });
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Senha Redefinida!</CardTitle>
            <CardDescription>
              Sua senha foi alterada com sucesso. Redirecionando para o login...
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/login" className="w-full">
              <Button className="w-full">
                Ir para Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha abaixo
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={resetPasswordMutation.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={resetPasswordMutation.isPending}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending || !token}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                Voltar para Login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
