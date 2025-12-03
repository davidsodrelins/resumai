import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, BarChart3, Calendar, TrendingUp, Award, TrendingDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

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

  // Calculate ATS score average from real data
  const atsScores = resumes?.map(r => r.atsScore).filter((score): score is number => score !== null && score !== undefined) || [];
  const avgAtsScore = atsScores.length > 0 
    ? (atsScores.reduce((a, b) => a + b, 0) / atsScores.length).toFixed(0)
    : 0;
  const atsTrend = atsScores.length >= 2 
    ? atsScores[atsScores.length - 1] > atsScores[0] ? 'up' : 'down'
    : 'neutral';
  const hasAtsData = atsScores.length > 0;

  // Calculate activity timeline (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Group resumes by date
  const activityByDate: Record<string, number> = {};
  resumes?.forEach(resume => {
    const date = new Date(resume.createdAt);
    if (date >= thirtyDaysAgo) {
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
    }
  });

  // Create array of last 30 days with counts
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    last30Days.push({
      date: dateKey,
      count: activityByDate[dateKey] || 0,
      label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    });
  }

  // Chart data for activity timeline
  const activityChartData = {
    labels: last30Days.map(d => d.label),
    datasets: [
      {
        label: 'Currículos Criados',
        data: last30Days.map(d => d.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Score ATS Médio
              </CardTitle>
              {hasAtsData ? (
                atsTrend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : atsTrend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                )
              ) : (
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              {hasAtsData ? (
                <>
                  <div className="text-2xl font-bold">{avgAtsScore}/100</div>
                  <p className="text-xs text-muted-foreground">
                    {atsTrend === 'up' ? 'Melhorando' : atsTrend === 'down' ? 'Em queda' : 'Estável'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-400">--</div>
                  <p className="text-xs text-muted-foreground">
                    Sem análises ainda
                  </p>
                </>
              )}
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
              <div className="h-64 flex items-center justify-center">
                {totalResumes > 0 ? (
                  <Pie
                    data={{
                      labels: Object.keys(templateCounts).map(t => templateNames[t] || t),
                      datasets: [{
                        data: Object.values(templateCounts),
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',  // blue
                          'rgba(168, 85, 247, 0.8)',  // purple
                          'rgba(34, 197, 94, 0.8)',   // green
                          'rgba(249, 115, 22, 0.8)',  // orange
                          'rgba(236, 72, 153, 0.8)',  // pink
                        ],
                        borderColor: [
                          'rgba(59, 130, 246, 1)',
                          'rgba(168, 85, 247, 1)',
                          'rgba(34, 197, 94, 1)',
                          'rgba(249, 115, 22, 1)',
                          'rgba(236, 72, 153, 1)',
                        ],
                        borderWidth: 2,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                ) : (
                  <p className="text-slate-500">Nenhum dado disponível</p>
                )}
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
              <div className="h-64 flex items-center justify-center">
                {totalResumes > 0 ? (
                  <Pie
                    data={{
                      labels: Object.keys(languageCounts).map(l => languageNames[l] || l),
                      datasets: [{
                        data: Object.values(languageCounts),
                        backgroundColor: [
                          'rgba(34, 197, 94, 0.8)',   // green
                          'rgba(59, 130, 246, 0.8)',  // blue
                          'rgba(249, 115, 22, 0.8)',  // orange
                        ],
                        borderColor: [
                          'rgba(34, 197, 94, 1)',
                          'rgba(59, 130, 246, 1)',
                          'rgba(249, 115, 22, 1)',
                        ],
                        borderWidth: 2,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                ) : (
                  <p className="text-slate-500">Nenhum dado disponível</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Atividade dos Últimos 30 Dias</CardTitle>
            <CardDescription>Currículos criados ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {totalResumes > 0 ? (
                <Line
                  data={activityChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.y} currículo${context.parsed.y !== 1 ? 's' : ''}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          precision: 0,
                        },
                        title: {
                          display: true,
                          text: 'Quantidade'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Data'
                        },
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500">Nenhum dado disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
