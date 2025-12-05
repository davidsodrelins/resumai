import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BarChart3, PieChart, Activity, Clock, Users } from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminMetrics() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Proteger rota - apenas admins podem acessar
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const { data: metrics, isLoading: metricsLoading } = trpc.admin.getAdvancedMetrics.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  // Template distribution chart data
  const templateChartData = metrics
    ? {
        labels: metrics.templateDistribution.map((t) => {
          const names: Record<string, string> = {
            classic: "Clássico",
            modern: "Moderno",
            minimal: "Minimalista",
            executive: "Executivo",
            creative: "Criativo",
          };
          return names[t.template] || t.template;
        }),
        datasets: [
          {
            label: "Currículos",
            data: metrics.templateDistribution.map((t) => t.count),
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)", // blue
              "rgba(16, 185, 129, 0.8)", // green
              "rgba(251, 146, 60, 0.8)", // orange
              "rgba(139, 92, 246, 0.8)", // purple
              "rgba(236, 72, 153, 0.8)", // pink
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(251, 146, 60, 1)",
              "rgba(139, 92, 246, 1)",
              "rgba(236, 72, 153, 1)",
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  // Hourly activity chart data
  const hourlyChartData = metrics
    ? {
        labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
        datasets: [
          {
            label: "Novos Usuários",
            data: metrics.hourlyActivity,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se não for admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Acesso negado. Apenas administradores podem acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GlobalNavigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Métricas Avançadas</h1>
          <p className="text-muted-foreground">
            Análise detalhada de uso, conversão e atividade da plataforma
          </p>
        </div>

        {metricsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : metrics ? (
          <>
            {/* Métricas Rápidas */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    Taxa de Conversão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Usuários que se tornaram apoiadores</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Tempo Médio de Sessão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.avgSessionTime > 0 ? `${metrics.avgSessionTime}min` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.avgSessionTime > 0 ? "Por sessão de usuário" : "Rastreamento não implementado"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    Taxa de Retorno
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.returnRate > 0 ? `${metrics.returnRate.toFixed(1)}%` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.returnRate > 0 ? "Usuários que retornam" : "Rastreamento não implementado"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Distribuição por Template */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Distribuição por Template
                  </CardTitle>
                  <CardDescription>Quantidade de currículos criados por template visual</CardDescription>
                </CardHeader>
                <CardContent>
                  {templateChartData && metrics.templateDistribution.length > 0 ? (
                    <div className="h-80">
                      <Pie data={templateChartData} options={chartOptions} />
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">Sem dados disponíveis</p>
                  )}
                </CardContent>
              </Card>

              {/* Heatmap de Atividade por Horário */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Atividade por Horário
                  </CardTitle>
                  <CardDescription>Novos cadastros distribuídos ao longo do dia</CardDescription>
                </CardHeader>
                <CardContent>
                  {hourlyChartData ? (
                    <div className="h-80">
                      <Bar data={hourlyChartData} options={barChartOptions} />
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">Sem dados disponíveis</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Insights e Recomendações</CardTitle>
                <CardDescription>Análise automática baseada nas métricas coletadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.conversionRate < 5 && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <strong>Taxa de conversão baixa:</strong> Apenas {metrics.conversionRate.toFixed(1)}%
                        dos usuários se tornaram apoiadores. Considere melhorar a comunicação dos benefícios
                        ou criar incentivos adicionais.
                      </AlertDescription>
                    </Alert>
                  )}

                  {metrics.templateDistribution.length > 0 && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Template mais popular:</strong>{" "}
                        {
                          metrics.templateDistribution.reduce((prev, current) =>
                            prev.count > current.count ? prev : current
                          ).template
                        }{" "}
                        com{" "}
                        {
                          metrics.templateDistribution.reduce((prev, current) =>
                            prev.count > current.count ? prev : current
                          ).count
                        }{" "}
                        currículos criados.
                      </AlertDescription>
                    </Alert>
                  )}

                  {metrics.hourlyActivity.length > 0 && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Horário de pico:</strong> A maioria dos cadastros ocorre entre{" "}
                        {metrics.hourlyActivity.indexOf(Math.max(...metrics.hourlyActivity))}h e{" "}
                        {metrics.hourlyActivity.indexOf(Math.max(...metrics.hourlyActivity)) + 1}h. Considere
                        agendar comunicações importantes para esse período.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="text-center py-8 text-muted-foreground">Erro ao carregar métricas</p>
        )}
      </div>
    </div>
  );
}
