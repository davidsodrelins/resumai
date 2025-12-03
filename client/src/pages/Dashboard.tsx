import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, BarChart3, Calendar, TrendingUp, Award } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: resumes, isLoading } = trpc.history.listResumes.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    setLocation("/");
    return null;
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const totalResumes = resumes?.length || 0;
  
  // Calculate statistics
  const templateCounts = resumes?.reduce((acc, resume) => {
    acc[resume.template] = (acc[resume.template] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const languageCounts = resumes?.reduce((acc, resume) => {
    acc[resume.language] = (acc[resume.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const modelCounts = resumes?.reduce((acc, resume) => {
    acc[resume.model] = (acc[resume.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const mostUsedTemplate = Object.entries(templateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const mostUsedLanguage = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Recent resumes
  const recentResumes = resumes?.slice(0, 5) || [];

  // Calculate average creation per week (last 4 weeks)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const recentCount = resumes?.filter(r => new Date(r.createdAt) >= fourWeeksAgo).length || 0;
  const avgPerWeek = (recentCount / 4).toFixed(1);

  const templateNames: Record<string, string> = {
    classic: "Classic",
    modern: "Modern",
    minimal: "Minimal",
    executive: "Executive",
    creative: "Creative"
  };

  const languageNames: Record<string, string> = {
    pt: "Português",
    en: "English",
    es: "Español"
  };

  const modelNames: Record<string, string> = {
    reduced: "Reduzido",
    mixed: "Misto",
    complete: "Completo"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Acompanhe suas estatísticas e atividades na plataforma
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Currículos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResumes}</div>
              <p className="text-xs text-muted-foreground">
                Currículos gerados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Média Semanal
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPerWeek}</div>
              <p className="text-xs text-muted-foreground">
                Últimas 4 semanas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Template Favorito
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templateNames[mostUsedTemplate] || mostUsedTemplate}</div>
              <p className="text-xs text-muted-foreground">
                Mais utilizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Idioma Principal
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{languageNames[mostUsedLanguage] || mostUsedLanguage}</div>
              <p className="text-xs text-muted-foreground">
                Mais utilizado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Templates Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Template</CardTitle>
              <CardDescription>Currículos gerados por template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(templateCounts).map(([template, count]) => (
                  <div key={template} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{templateNames[template] || template}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / totalResumes) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Idioma</CardTitle>
              <CardDescription>Currículos gerados por idioma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(languageCounts).map(([language, count]) => (
                  <div key={language} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{languageNames[language] || language}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(count / totalResumes) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Resumes */}
        <Card>
          <CardHeader>
            <CardTitle>Currículos Recentes</CardTitle>
            <CardDescription>Seus últimos 5 currículos gerados</CardDescription>
          </CardHeader>
          <CardContent>
            {recentResumes.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum currículo gerado ainda</p>
                <Link href="/generator">
                  <Button className="mt-4">Criar Primeiro Currículo</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentResumes.map((resume) => (
                  <div key={resume.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{resume.title}</p>
                        <p className="text-xs text-slate-500">
                          {templateNames[resume.template]} • {languageNames[resume.language]} • {new Date(resume.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Link href={`/history`}>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
