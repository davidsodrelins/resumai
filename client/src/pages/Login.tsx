import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      console.log("✅ Login mutation bem-sucedido!");
      console.log("⏳ Aguardando 2 segundos para cookie ser setado...");
      
      // Wait 2 seconds for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("🔄 Invalidando queries de autenticação...");
      await utils.auth.me.invalidate();
      
      console.log("🔍 Verificando se usuário está autenticado...");
      
      // Poll auth.me to verify authentication
      let attempts = 0;
      const maxAttempts = 10;
      const pollInterval = 500; // 500ms
      
      const checkAuth = async (): Promise<boolean> => {
        try {
          const user = await utils.auth.me.fetch();
          console.log("👤 Resultado da verificação:", user ? `Usuário ${user.email} autenticado` : "Não autenticado");
          return !!user;
        } catch (error) {
          console.error("❌ Erro ao verificar autenticação:", error);
          return false;
        }
      };
      
      while (attempts < maxAttempts) {
        const isAuthenticated = await checkAuth();
        
        if (isAuthenticated) {
          console.log("🎉 Autenticação confirmada! Redirecionando...");
          window.location.href = "/generator";
          return;
        }
        
        attempts++;
        console.log(`⏳ Tentativa ${attempts}/${maxAttempts} - Aguardando...`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
      // If we get here, authentication failed after all attempts
      console.error("❌ Falha ao verificar autenticação após múltiplas tentativas");
      console.log("🔄 Forçando reload completo da página...");
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("❌ Erro ao fazer login:", error);
      alert(error.message || "Erro ao fazer login");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("📝 Tentando fazer login com:", email);
    
    if (!email || !password) {
      alert("Por favor, preencha email e senha");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Entrar no ResumAI</CardTitle>
          <CardDescription>
            Entre com sua conta para criar currículos profissionais com IA
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando informações...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/signup">
                <a className="text-blue-600 hover:underline font-medium">
                  Cadastre-se
                </a>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
