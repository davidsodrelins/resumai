import { useState } from "react";
import { Link } from "wouter";
import { 
  FileText, 
  Sparkles, 
  BarChart3, 
  Languages, 
  Download, 
  History, 
  GitCompare, 
  Mail, 
  Globe, 
  Lightbulb,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  category: string;
  isNew?: boolean;
  benefits: string[];
}

const features: Feature[] = [
  {
    id: "generator",
    title: "Gerador de Currículos IA",
    description: "Crie currículos profissionais em minutos com inteligência artificial. Suporte para 3 idiomas e 5 templates modernos.",
    icon: <FileText className="w-6 h-6" />,
    link: "/generator",
    category: "Geração",
    benefits: [
      "Geração automática com IA (Llama 3.3)",
      "5 templates profissionais",
      "3 idiomas (PT, EN, ES)",
      "Auto-save a cada 30 segundos"
    ]
  },
  {
    id: "ats-analysis",
    title: "Análise ATS",
    description: "Avalie a compatibilidade do seu currículo com sistemas de rastreamento de candidatos. Score de 0-100 com sugestões de melhoria.",
    icon: <BarChart3 className="w-6 h-6" />,
    link: "/analysis",
    category: "Análise",
    benefits: [
      "Score ATS de 0-100",
      "Análise de palavras-chave",
      "Sugestões de melhoria",
      "Aplicar correções com 1 clique"
    ]
  },
  {
    id: "soft-skills",
    title: "Análise de Soft Skills",
    description: "Identifique e destaque suas habilidades interpessoais com base nas experiências profissionais descritas.",
    icon: <Lightbulb className="w-6 h-6" />,
    link: "/analysis",
    category: "Análise",
    benefits: [
      "Detecção automática de soft skills",
      "Categorização por tipo",
      "Sugestões de como destacar",
      "Exemplos contextualizados"
    ]
  },
  {
    id: "multilingual",
    title: "Suporte Multilíngue",
    description: "Gere currículos em Português, Inglês ou Espanhol com tradução automática e adaptação cultural.",
    icon: <Languages className="w-6 h-6" />,
    link: "/generator",
    category: "Geração",
    benefits: [
      "Português (BR)",
      "Inglês (US/UK)",
      "Espanhol (ES/LATAM)",
      "Tradução contextual"
    ]
  },
  {
    id: "export",
    title: "Exportação Multi-formato",
    description: "Baixe seu currículo em PDF colorido, DOCX editável ou LaTeX para máxima personalização.",
    icon: <Download className="w-6 h-6" />,
    link: "/generator",
    category: "Exportação",
    benefits: [
      "PDF com cores do template",
      "DOCX editável",
      "LaTeX para customização",
      "Preservação de formatação"
    ]
  },
  {
    id: "history",
    title: "Histórico de Versões",
    description: "Acesse todos os currículos gerados, compare versões e restaure versões anteriores quando necessário.",
    icon: <History className="w-6 h-6" />,
    link: "/history",
    category: "Gerenciamento",
    benefits: [
      "Histórico ilimitado",
      "Busca por título",
      "Filtros por template/idioma",
      "Restauração de versões"
    ]
  },
  {
    id: "compare",
    title: "Comparação de Versões",
    description: "Compare duas versões do currículo lado a lado com destaque de diferenças em cores.",
    icon: <GitCompare className="w-6 h-6" />,
    link: "/compare",
    category: "Análise",
    benefits: [
      "Comparação lado a lado",
      "Destaque de diferenças",
      "Navegação entre mudanças",
      "Exportar versão escolhida"
    ]
  },
  {
    id: "cover-letter",
    title: "Gerador de Cartas",
    description: "Crie cartas de apresentação personalizadas com base no seu currículo e na vaga desejada.",
    icon: <Mail className="w-6 h-6" />,
    link: "/cover-letter",
    category: "Geração",
    benefits: [
      "Geração automática por IA",
      "Personalização por vaga",
      "3 templates visuais",
      "Exportação PDF/DOCX"
    ]
  },
  {
    id: "portfolio",
    title: "Portfolio Web",
    description: "Transforme seu currículo em um site profissional com hospedagem automática e URL pública.",
    icon: <Globe className="w-6 h-6" />,
    link: "/portfolio",
    category: "Exportação",
    isNew: true,
    benefits: [
      "3 templates responsivos",
      "Biografia gerada por IA",
      "SEO otimizado",
      "Hospedagem automática"
    ]
  },
  {
    id: "suggestions",
    title: "Sugestões de Melhoria",
    description: "Receba recomendações inteligentes para aprimorar cada seção do seu currículo.",
    icon: <Sparkles className="w-6 h-6" />,
    link: "/analysis",
    category: "Otimização",
    benefits: [
      "Análise seção por seção",
      "Sugestões contextualizadas",
      "Aplicação automática",
      "Melhoria contínua"
    ]
  }
];

const categories = ["Todos", "Geração", "Análise", "Otimização", "Exportação", "Gerenciamento"];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredFeatures = selectedCategory === "Todos" 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Recursos da Plataforma
            </h1>
            <p className="text-lg text-slate-600">
              Descubra todas as funcionalidades disponíveis para criar currículos profissionais e se destacar no mercado de trabalho.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  {feature.isNew && (
                    <Badge variant="default" className="bg-green-500">
                      NOVO
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={feature.link}>
                    <Button className="w-full mt-4" variant="outline">
                      Acessar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para criar seu currículo profissional?
          </h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Comece agora e aproveite todas as funcionalidades para se destacar no mercado de trabalho.
          </p>
          <Link href="/generator">
            <Button size="lg" variant="secondary">
              Criar Currículo Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
