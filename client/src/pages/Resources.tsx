import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import GlobalNavigation from "@/components/GlobalNavigation";
import {
  FileText,
  TrendingUp,
  Lightbulb,
  Globe,
  Download,
  History,
  GitCompare,
  Mail,
  Briefcase,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const resources = [
  {
    id: "generator",
    title: "Gerador de Currículos IA",
    description: "Crie currículos profissionais com inteligência artificial",
    icon: FileText,
    category: "Geração",
    benefits: [
      "5 templates visuais profissionais",
      "Suporte para 3 idiomas (PT, EN, ES)",
      "Auto-save automático a cada 30 segundos",
      "Editor interativo com drag-and-drop",
    ],
    link: "/generator",
    color: "blue",
  },
  {
    id: "ats",
    title: "Análise ATS",
    description: "Otimize seu currículo para sistemas de rastreamento",
    icon: TrendingUp,
    category: "Análise",
    benefits: [
      "Pontuação de 0-100 com breakdown detalhado",
      "Sugestões de melhoria automáticas",
      "Aplicação em lote de otimizações",
      "Análise de formatação e keywords",
    ],
    link: "/analysis",
    color: "green",
  },
  {
    id: "soft-skills",
    title: "Análise de Soft Skills",
    description: "Identifique e destaque suas habilidades interpessoais",
    icon: Lightbulb,
    category: "Análise",
    benefits: [
      "Detecção automática de soft skills",
      "Categorização por área profissional",
      "Exemplos específicos de demonstração",
      "Coverage score de habilidades relevantes",
    ],
    link: "/analysis",
    color: "purple",
  },
  {
    id: "multilingual",
    title: "Suporte Multilíngue",
    description: "Gere currículos em múltiplos idiomas",
    icon: Globe,
    category: "Geração",
    benefits: [
      "Português, Inglês e Espanhol",
      "Tradução contextual via IA",
      "Adaptação cultural automática",
      "Formatação específica por idioma",
    ],
    link: "/generator",
    color: "orange",
  },
  {
    id: "export",
    title: "Exportação Multi-formato",
    description: "Baixe seus currículos em diversos formatos",
    icon: Download,
    category: "Exportação",
    benefits: [
      "PDF colorido com paleta do template",
      "DOCX editável no Word",
      "LaTeX com metadados para IA",
      "Cores consistentes com preview",
    ],
    link: "/generator",
    color: "indigo",
  },
  {
    id: "history",
    title: "Histórico de Versões",
    description: "Gerencie todos os seus currículos salvos",
    icon: History,
    category: "Gerenciamento",
    benefits: [
      "Busca e filtros avançados",
      "Organização por template e idioma",
      "Restauração de versões anteriores",
      "Exclusão segura com confirmação",
    ],
    link: "/history",
    color: "slate",
  },
  {
    id: "compare",
    title: "Comparação de Versões",
    description: "Compare diferentes versões lado a lado",
    icon: GitCompare,
    category: "Gerenciamento",
    benefits: [
      "Visualização lado a lado",
      "Destaque de diferenças",
      "Exportação de versões comparadas",
      "Análise de mudanças",
    ],
    link: "/compare",
    color: "cyan",
  },
  {
    id: "cover-letter",
    title: "Gerador de Cartas",
    description: "Crie cartas de apresentação personalizadas",
    icon: Mail,
    category: "Geração",
    benefits: [
      "Personalização por vaga",
      "3 templates profissionais",
      "Integração com dados do currículo",
      "Otimização para ATS",
    ],
    link: "/cover-letter",
    color: "pink",
  },
  {
    id: "portfolio",
    title: "Portfolio Web",
    description: "Transforme seu currículo em um site profissional",
    icon: Briefcase,
    category: "Geração",
    benefits: [
      "3 templates responsivos",
      "Biografia gerada por IA",
      "Hospedagem automática no S3",
      "SEO otimizado com Open Graph",
    ],
    link: "/portfolio",
    color: "emerald",
    badge: "NOVO",
  },
  {
    id: "improvements",
    title: "Sugestões de Melhoria",
    description: "Receba sugestões inteligentes via IA",
    icon: Sparkles,
    category: "Otimização",
    benefits: [
      "Análise por seção do currículo",
      "Sugestões de alto impacto",
      "Aplicação automática",
      "Preview antes/depois",
    ],
    link: "/analysis",
    color: "amber",
  },
];

const categories = ["Todos", "Geração", "Análise", "Otimização", "Exportação", "Gerenciamento"];

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredResources =
    selectedCategory === "Todos"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
      green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
      orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
      indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
      slate: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
      cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
      pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
      emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
      amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GlobalNavigation />

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Recursos da Plataforma</h1>
          <p className="text-sm text-slate-600">
            Descubra todas as funcionalidades disponíveis
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Resources Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            const colors = getColorClasses(resource.color);

            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg ${colors.bg} ${colors.text} border ${colors.border}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    {resource.badge && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {resource.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {resource.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className={`mt-1 ${colors.text}`}>•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href={resource.link}>
                      <a>Acessar</a>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Pronto para criar seu currículo profissional?
            </CardTitle>
            <CardDescription className="text-blue-50">
              Comece agora e tenha acesso a todas essas funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" variant="secondary">
              <Link href="/generator">
                <a className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Criar Currículo Agora
                </a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
