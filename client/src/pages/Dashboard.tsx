import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import {
  FileText,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  ArrowLeft,
  BarChart3,
  Clock,
  Globe,
  Layout,
} from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  // Load user's resumes
  const { data: resumes, isLoading: resumesLoading } = trpc.history.listResumes.useQuery();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  // Calculate statistics
  const totalResumes = resumes?.length || 0;
  const resumesThisMonth = resumes?.filter((r) => {
    const createdDate = new Date(r.createdAt);
    const now = new Date();
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  }).length || 0;

  // Group by template
  const templateStats = resumes?.reduce((acc, resume) => {
    const template = resume.template || "classic";
    acc[template] = (acc[template] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Group by language
  const languageStats = resumes?.reduce((acc, resume) => {
    const lang = resume.language || "pt";
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Group by model
  const modelStats = resumes?.reduce((acc, resume) => {
    const model = resume.model || "complete";
    acc[model] = (acc[model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Recent activity (last 5 resumes)
  const recentResumes = resumes?.slice(0, 5) || [];

  const templateNames: Record<string, string> = {
    classic: "Clássico",
    modern: "Moderno",
    minimalist: "Minimalista",
    creative: "Criativo",
    professional: "Profissional",
  };

  const languageNames: Record<string, string> = {
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",
  };

  const modelNames: Record<string, string> = {
    reduced: "Reduzido",
    mixed: "Misto",
    complete: "Completo",
  };

  if (authLoading || resumesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">
                Visão geral da sua atividade
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <a className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </a>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Olá, {user?.name}! 👋
          </h2>
          <p className="text-slate-600">
            Aqui está um resumo da sua atividade na plataforma.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Currículos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResumes}</div>
              <p className="text-xs text-muted-foreground">
                Todos os currículos criados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumesThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Currículos criados em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Template Favorito</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(templateStats).length > 0
                  ? templateNames[
                      Object.entries(templateStats).sort((a, b) => b[1] - a[1])[0][0]
                    ]
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Mais utilizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Idioma Principal</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(languageStats).length > 0
                  ? languageNames[
                      Object.entries(languageStats).sort((a, b) => b[1] - a[1])[0][0]
                    ]
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Mais utilizado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-12">
          {/* Templates Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Distribuição por Template
              </CardTitle>
              <CardDescription>
                Quantidade de currículos por template visual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(templateStats).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(templateStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([template, count]) => (
                      <div key={template} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium">
                            {templateNames[template] || template}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(count / totalResumes) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 text-center py-8">
                  Nenhum currículo criado ainda
                </p>
              )}
            </CardContent>
          </Card>

          {/* Languages Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Distribuição por Idioma
              </CardTitle>
              <CardDescription>
                Quantidade de currículos por idioma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(languageStats).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(languageStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([lang, count]) => (
                      <div key={lang} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">
                            {languageNames[lang] || lang}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${(count / totalResumes) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 text-center py-8">
                  Nenhum currículo criado ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Seus últimos 5 currículos criados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentResumes.length > 0 ? (
              <div className="space-y-4">
                {recentResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{resume.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {templateNames[resume.template] || resume.template}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {languageNames[resume.language] || resume.language}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(resume.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/history">
                        <a>Ver Detalhes</a>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">
                  Você ainda não criou nenhum currículo
                </p>
                <Button asChild>
                  <Link href="/generator">
                    <a>Criar Primeiro Currículo</a>
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Criar Novo Currículo</CardTitle>
              <CardDescription>
                Comece um novo currículo do zero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/generator">
                  <a className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Criar Agora
                  </a>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Ver Histórico</CardTitle>
              <CardDescription>
                Acesse todos os seus currículos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/history">
                  <a className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Ver Histórico
                  </a>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Análise ATS</CardTitle>
              <CardDescription>
                Otimize seu currículo para ATS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/analysis">
                  <a className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Analisar
                  </a>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
