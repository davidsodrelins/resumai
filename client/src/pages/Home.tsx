import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { FileText, Globe, Sparkles, Download, Edit, Zap, Layout, HelpCircle, User, LogOut } from "lucide-react";
import { Link } from "wouter";
import GuidedTour from "@/components/GuidedTour";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [runTour, setRunTour] = useState(false);

  const handleRestartTour = () => {
    localStorage.removeItem('hasSeenTour');
    setRunTour(true);
    setTimeout(() => setRunTour(false), 100); // Reset after triggering
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Guided Tour */}
      {isAuthenticated && <GuidedTour run={runTour || true} />}
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">Gerador de Currículos IA</h1>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/resources">
                <Button variant="ghost" size="sm">Recursos</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleRestartTour}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Refazer Tour</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/auth/logout" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/generator">
                <Button>Criar Currículo</Button>
              </Link>
            </div>
          ) : (
            <Button asChild>
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Crie Currículos Profissionais com Inteligência Artificial
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Transforme seu perfil do LinkedIn e experiências anteriores em currículos otimizados para ATS, 
            disponíveis em três idiomas e três formatos profissionais.
          </p>
          
          {isAuthenticated ? (
            <Link href="/generator">
              <Button size="lg" className="text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Começar Agora
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href={getLoginUrl()}>
                <Sparkles className="mr-2 h-5 w-5" />
                Começar Gratuitamente
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Recursos Principais
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Processamento com IA</CardTitle>
              <CardDescription>
                Utilize o poder do Llama IA para extrair e organizar suas informações profissionais automaticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>3 Idiomas</CardTitle>
              <CardDescription>
                Gere currículos em Português, Inglês e Espanhol com tradução profissional automática
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>3 Modelos</CardTitle>
              <CardDescription>
                Escolha entre currículo Reduzido, Misto ou Completo dependendo da oportunidade
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Edit className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Editor Interativo</CardTitle>
              <CardDescription>
                Edite seções, adicione informações e personalize seu currículo em tempo real
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Exportação DOCX e PDF</CardTitle>
              <CardDescription>
                Baixe seus currículos em formatos profissionais prontos para envio
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle>Otimizado para ATS</CardTitle>
              <CardDescription>
                Currículos otimizados para sistemas de rastreamento de candidatos e IA de recrutamento
              </CardDescription>
            </CardHeader>
          </Card>

          <Link href="/portfolio">
            <Card className="border-2 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Layout className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  Portfolio Web
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">NOVO</span>
                </CardTitle>
                <CardDescription>
                  Transforme seu currículo em um site profissional com 3 templates modernos
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-16">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Como Funciona
        </h3>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Forneça suas Informações</h4>
              <p className="text-slate-600">
                Insira o link do seu perfil do LinkedIn, faça upload de currículos anteriores e adicione 
                instruções específicas sobre o que você deseja destacar.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Processamento Inteligente</h4>
              <p className="text-slate-600">
                Nossa IA analisa todas as informações, extrai dados relevantes e organiza seu histórico 
                profissional de forma estruturada e otimizada.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Escolha Modelo e Idioma</h4>
              <p className="text-slate-600">
                Selecione entre currículo Reduzido, Misto ou Completo e escolha o idioma desejado: 
                Português, Inglês ou Espanhol.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Edite e Exporte</h4>
              <p className="text-slate-600">
                Visualize o preview, faça ajustes no editor interativo e exporte seu currículo 
                profissional em DOCX ou PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Pronto para Criar seu Currículo Perfeito?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Comece agora e tenha currículos profissionais em minutos
          </p>
          
          {isAuthenticated ? (
            <Link href="/generator">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Criar Meu Currículo
              </Button>
            </Link>
          ) : (
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a href={getLoginUrl()}>Começar Gratuitamente</a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2024 Gerador de Currículos IA. Powered by Llama AI.</p>
        </div>
      </footer>
    </div>
  );
}
