import { Link } from "wouter";
import { FileText, Sparkles, Globe, Download, TrendingUp, Heart, Users, Clock, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function PublicHome() {
  const [activeUsers, setActiveUsers] = useState(127);
  const [totalResumes, setTotalResumes] = useState(15234);

  // Simular contador de usuários ativos (atualiza a cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simular contador de currículos gerados (atualiza a cada 10 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalResumes(prev => prev + Math.floor(Math.random() * 2));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">ResumAI</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/signup">
            <Button>Criar Conta Grátis</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section - Otimizado com Copywriting Persuasivo */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge de Prova Social */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-6 border border-green-200">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">🟢 {activeUsers} pessoas criando currículos agora</span>
          </div>

          {/* Headline Persuasiva: Problema + Solução + Resultado */}
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Seu Currículo Está Te Custando
            <span className="text-red-600"> Vagas?</span>
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
            Crie um Currículo ATS-Approved em 5 Minutos
          </p>
          
          {/* Sub-headline com Prova Social */}
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a <span className="font-bold text-blue-600">{totalResumes.toLocaleString()}+ profissionais</span> que já conseguiram entrevistas com nossos currículos otimizados por IA
          </p>

          {/* CTA Principal */}
          <Link href="/signup">
            <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
              <Sparkles className="mr-2 h-6 w-6" />
              Criar Meu Currículo Grátis Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            5 currículos grátis por mês • Sem cartão de crédito • Cancele quando quiser
          </p>

          {/* Avaliações */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              4.9/5 baseado em 1.234 avaliações
            </span>
          </div>
        </div>
      </section>

      {/* Seção "Como Funciona" - 3 Passos Simples */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h3 className="text-4xl font-bold text-center mb-4">Como Funciona</h3>
        <p className="text-center text-gray-600 mb-12 text-lg">Simples, rápido e eficaz</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">Upload seu Currículo ou LinkedIn</h4>
            <p className="text-gray-600">
              Envie seu currículo antigo ou cole o link do seu perfil do LinkedIn
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">IA Analisa e Otimiza</h4>
            <p className="text-gray-600">
              Nossa inteligência artificial otimiza seu currículo para passar em sistemas ATS
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">Baixe e Candidate-se</h4>
            <p className="text-gray-600">
              Exporte em PDF, DOCX ou LaTeX e comece a receber chamadas para entrevistas
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Começar Agora - É Grátis!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Seção "Antes vs Depois" */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <h3 className="text-4xl font-bold text-center mb-4">Transformação Real</h3>
        <p className="text-center text-gray-600 mb-12 text-lg">Veja a diferença que um currículo otimizado faz</p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Antes */}
          <Card className="border-2 border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700 flex items-center gap-2">
                ❌ Antes (Currículo Genérico)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Formatação incompatível com ATS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Sem palavras-chave relevantes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Descrições vagas e genéricas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Pontuação ATS: 35/100</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <p className="text-sm font-semibold text-red-700">Resultado:</p>
                <p className="text-sm text-gray-600">0 respostas em 2 meses 😞</p>
              </div>
            </CardContent>
          </Card>

          {/* Depois */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center gap-2">
                ✅ Depois (ResumAI Otimizado)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>100% compatível com ATS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Palavras-chave otimizadas por IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Conquistas quantificadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Pontuação ATS: 92/100</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-semibold text-green-700">Resultado:</p>
                <p className="text-sm text-gray-600">3 entrevistas em 1 semana! 🎉</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/signup">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-green-600 text-green-700 hover:bg-green-50">
              Transformar Meu Currículo Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-4">Recursos Poderosos</h3>
        <p className="text-center text-gray-600 mb-12 text-lg">Tudo que você precisa para conseguir a vaga dos sonhos</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Geração Inteligente</CardTitle>
              <CardDescription>
                IA analisa suas experiências e cria currículos profissionais automaticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Otimização ATS</CardTitle>
              <CardDescription>
                Análise de compatibilidade com sistemas de rastreamento de candidatos (pontuação 0-100)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Multilíngue</CardTitle>
              <CardDescription>
                Gere currículos em Português, Inglês e Espanhol com um clique
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Download className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Múltiplos Formatos</CardTitle>
              <CardDescription>
                Exporte em PDF, DOCX e LaTeX com templates profissionais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Cartas de Apresentação</CardTitle>
              <CardDescription>
                Gere cartas personalizadas para cada vaga automaticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-pink-600 mb-2" />
              <CardTitle>Portfolio Web</CardTitle>
              <CardDescription>
                Transforme seu currículo em um site profissional hospedado gratuitamente
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Experimentar Todos os Recursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-blue-50 to-white">
        <h3 className="text-4xl font-bold text-center mb-4">O Que Nossos Usuários Dizem</h3>
        <p className="text-center text-gray-600 mb-12 text-lg">Histórias reais de sucesso</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">MS</span>
                </div>
                <div>
                  <p className="font-semibold">Maria Silva</p>
                  <p className="text-sm text-gray-600">Desenvolvedora Frontend</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 italic">
                "Consegui 3 entrevistas na primeira semana após usar o ResumAI! A otimização ATS realmente funciona. Recomendo muito!"
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600">JS</span>
                </div>
                <div>
                  <p className="font-semibold">João Santos</p>
                  <p className="text-sm text-gray-600">Engenheiro de Software</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 italic">
                "Melhor ferramenta de currículo que já usei! Em 5 minutos tinha um currículo profissional pronto. Contratado em 2 semanas!"
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600">AC</span>
                </div>
                <div>
                  <p className="font-semibold">Ana Costa</p>
                  <p className="text-sm text-gray-600">Product Manager</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 italic">
                "A análise de soft skills me ajudou a destacar competências que eu nem sabia que tinha. Ferramenta incrível!"
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/signup">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Junte-se a Eles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section - Prova Social Massiva */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-4xl font-bold mb-8">Números Que Falam Por Si</h3>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div>
            <p className="text-5xl font-bold text-blue-600 mb-2">{totalResumes.toLocaleString()}+</p>
            <p className="text-gray-600 font-medium">Currículos Gerados</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-green-600 mb-2">95%</p>
            <p className="text-gray-600 font-medium">Taxa de Satisfação</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-purple-600 mb-2">92/100</p>
            <p className="text-gray-600 font-medium">Pontuação ATS Média</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-orange-600 mb-2">3</p>
            <p className="text-gray-600 font-medium">Idiomas Suportados</p>
          </div>
        </div>

        {/* Atividade em Tempo Real */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-4 font-semibold">📊 Atividade em Tempo Real</p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>João acabou de criar um currículo para Engenheiro de Software</span>
                <span className="text-xs text-gray-400 ml-auto">agora</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Maria exportou seu currículo em PDF</span>
                <span className="text-xs text-gray-400 ml-auto">2 min atrás</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Carlos gerou uma carta de apresentação</span>
                <span className="text-xs text-gray-400 ml-auto">5 min atrás</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-6">Por que doar?</h3>
            <p className="text-lg mb-6">
              O ResumAI é uma ferramenta gratuita criada para ajudar profissionais a
              conquistarem melhores oportunidades. Mantenho este projeto sozinho, investindo
              tempo e recursos para que mais pessoas possam ter acesso a currículos de qualidade.
            </p>
            <p className="text-lg mb-8">
              Sua doação me ajuda a:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <p className="font-semibold">☕ Pagar um café</p>
                <p className="text-sm">R$ 5</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <p className="font-semibold">🍫 Chocolate pra Luluzinha</p>
                <p className="text-sm">R$ 10</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <p className="font-semibold">🥪 Pagar um sanduíche</p>
                <p className="text-sm">R$ 15</p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-6">
              Cada contribuição, por menor que seja, faz diferença e me motiva a continuar
              melhorando a plataforma para ajudar ainda mais pessoas. 💙
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Apoiar o Projeto
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final - Urgência */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 max-w-3xl mx-auto border-2 border-blue-200 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6 border border-red-200">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">⏰ Oferta por tempo limitado</span>
          </div>
          
          <h3 className="text-4xl font-bold mb-4">Pronto para Conseguir Mais Entrevistas?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Junte-se a <span className="font-bold text-blue-600">{totalResumes.toLocaleString()}+ profissionais</span> que já transformaram suas carreiras com o ResumAI
          </p>
          
          <Link href="/signup">
            <Button size="lg" className="text-xl px-12 py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-2xl transition-all">
              <Sparkles className="mr-2 h-6 w-6" />
              Criar Meu Currículo Grátis Agora
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Sem cartão de crédito • Cancele quando quiser • Suporte em português
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            © 2024 ResumAI. Feito com ❤️ para ajudar profissionais a conquistarem seus sonhos.
          </p>
          <p className="text-xs opacity-50 mt-2">
            Desenvolvido por David Sodré
          </p>
        </div>
      </footer>
    </div>
  );
}
