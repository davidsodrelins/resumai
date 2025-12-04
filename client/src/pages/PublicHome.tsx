import { Link } from "wouter";
import { FileText, Sparkles, Globe, Download, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PublicHome() {
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Crie Currículos Profissionais com
            <span className="text-blue-600"> Inteligência Artificial</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Transforme seu perfil do LinkedIn e experiências anteriores em currículos
            otimizados para ATS, disponíveis em três idiomas e três formatos profissionais.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              <Sparkles className="mr-2 h-5 w-5" />
              Começar Agora - É Grátis!
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            ✨ 5 currículos grátis por mês • Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Recursos Principais</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Geração Inteligente</CardTitle>
              <CardDescription>
                IA analisa suas experiências e cria currículos profissionais automaticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Otimização ATS</CardTitle>
              <CardDescription>
                Análise de compatibilidade com sistemas de rastreamento de candidatos (pontuação 0-100)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Multilíngue</CardTitle>
              <CardDescription>
                Gere currículos em Português, Inglês e Espanhol com um clique
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Múltiplos Formatos</CardTitle>
              <CardDescription>
                Exporte em PDF, DOCX e LaTeX com templates profissionais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Cartas de Apresentação</CardTitle>
              <CardDescription>
                Gere cartas personalizadas para cada vaga automaticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-pink-600 mb-2" />
              <CardTitle>Portfolio Web</CardTitle>
              <CardDescription>
                Transforme seu currículo em um site profissional hospedado gratuitamente
              </CardDescription>
            </CardHeader>
          </Card>
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
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">☕ Pagar um café</p>
                <p className="text-sm">R$ 5</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">🍫 Chocolate pra Luluzinha</p>
                <p className="text-sm">R$ 10</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">🥪 Pagar um sanduíche</p>
                <p className="text-sm">R$ 15</p>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Cada contribuição, por menor que seja, faz diferença e me motiva a continuar
              melhorando a plataforma para ajudar ainda mais pessoas. 💙
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-8">Ajudando Profissionais a Crescerem</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <p className="text-4xl font-bold text-blue-600">1000+</p>
            <p className="text-gray-600">Currículos Gerados</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-600">95%</p>
            <p className="text-gray-600">Taxa de Satisfação</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-600">3</p>
            <p className="text-gray-600">Idiomas Suportados</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 rounded-2xl p-12 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Pronto para criar seu currículo?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Junte-se a milhares de profissionais que já usam o ResumAI
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Criar Conta Grátis Agora
            </Button>
          </Link>
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
