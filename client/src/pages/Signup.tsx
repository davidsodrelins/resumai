import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Loader2 } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const utils = trpc.useUtils();

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: async () => {
      console.log("✅ Signup mutation bem-sucedido!");
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
          console.log("🎉 Autenticação confirmada! Redirecionando para dashboard...");
          window.location.href = "/dashboard";
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
      console.error("❌ Erro ao criar conta:", error);
      alert(error.message || "Erro ao criar conta");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("📝 Tentando criar conta com:", email);
    
    if (!name || !email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    signupMutation.mutate({ name, email, password });
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
          <CardTitle className="text-2xl font-bold">Criar Conta no ResumAI</CardTitle>
          <CardDescription>
            Crie currículos profissionais gratuitamente com inteligência artificial
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={signupMutation.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={signupMutation.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={signupMutation.isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={signupMutation.isPending}
                required
              />
            </div>
            
            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
              <p className="font-medium mb-1">✨ Plano Gratuito:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>5 currículos por mês</li>
                <li>Análise ATS e sugestões IA</li>
                <li>Exportação PDF, DOCX e LaTeX</li>
              </ul>
              <p className="mt-2 text-xs">
                💝 Doe para ter currículos ilimitados e apoiar o projeto!
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta Grátis"
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Fazer login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
