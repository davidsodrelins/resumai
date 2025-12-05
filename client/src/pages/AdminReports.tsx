import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminReports() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState<"monthly" | "users" | "growth">("monthly");
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Proteger rota - apenas admins podem acessar
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const { data: reportData, isLoading: reportLoading } = trpc.admin.exportReport.useQuery(
    { type: reportType },
    {
      enabled: user?.role === "admin" && !!reportType,
    }
  );

  useEffect(() => {
    if (reportData) {
      setPreviewData(reportData);
    }
  }, [reportData]);

  const downloadAsJSON = () => {
    if (!previewData) return;

    const dataStr = JSON.stringify(previewData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-${reportType}-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório JSON baixado com sucesso!");
  };

  const downloadAsCSV = () => {
    if (!previewData || !previewData.data) return;

    let csvContent = "";

    if (reportType === "monthly" && previewData.data.users) {
      csvContent = "Email,Nome,Data de Cadastro\n";
      previewData.data.users.forEach((u: any) => {
        csvContent += `${u.email},${u.name || ""},${new Date(u.createdAt).toLocaleString("pt-BR")}\n`;
      });
    } else if (reportType === "users" && previewData.data.users) {
      csvContent =
        "ID,Email,Nome,Role,Apoiador,Total Doado,Currículos/Mês,Data de Cadastro,Último Login\n";
      previewData.data.users.forEach((u: any) => {
        csvContent += `${u.id},${u.email},${u.name || ""},${u.role},${u.isDonor ? "Sim" : "Não"},R$ ${u.totalDonated},${u.resumesThisMonth},${new Date(u.createdAt).toLocaleString("pt-BR")},${new Date(u.lastSignedIn).toLocaleString("pt-BR")}\n`;
      });
    } else if (reportType === "growth" && previewData.data.growthData) {
      csvContent = "Data,Novos Usuários\n";
      previewData.data.growthData.forEach((d: any) => {
        csvContent += `${d.date},${d.count}\n`;
      });
    }

    const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-${reportType}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório CSV baixado com sucesso!");
  };

  const generatePDFNotice = () => {
    toast.info("Exportação PDF em desenvolvimento. Use JSON ou CSV por enquanto.");
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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FileText className="h-10 w-10 text-blue-600" />
            Exportação de Relatórios
          </h1>
          <p className="text-muted-foreground">
            Gere relatórios detalhados em PDF, Excel ou JSON para análise e apresentações
          </p>
        </div>

        {/* Seleção de Tipo de Relatório */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all ${
              reportType === "monthly" ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setReportType("monthly")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Relatório Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Estatísticas do mês atual: novos usuários, currículos criados e doações
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              reportType === "users" ? "ring-2 ring-green-500 bg-green-50" : ""
            }`}
            onClick={() => setReportType("users")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Lista de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Todos os usuários cadastrados com suas estatísticas completas
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              reportType === "growth" ? "ring-2 ring-purple-500 bg-purple-50" : ""
            }`}
            onClick={() => setReportType("growth")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Análise de Crescimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crescimento de usuários nos últimos 30 dias com gráficos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview e Exportação */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview do Relatório</CardTitle>
                <CardDescription>
                  {reportType === "monthly"
                    ? "Relatório Mensal"
                    : reportType === "users"
                    ? "Lista de Usuários"
                    : "Análise de Crescimento"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadAsJSON} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button onClick={downloadAsCSV} variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV/Excel
                </Button>
                <Button onClick={generatePDFNotice} variant="default">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reportLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Gerando relatório...</p>
              </div>
            ) : previewData ? (
              <div className="space-y-6">
                {/* Resumo */}
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">Resumo</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="font-semibold">{previewData.period}</p>
                    </div>
                    {reportType === "monthly" && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Novos Usuários</p>
                          <p className="font-semibold text-2xl text-blue-600">
                            {previewData.data.newUsers}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Novos Currículos</p>
                          <p className="font-semibold text-2xl text-green-600">
                            {previewData.data.newResumes}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Novas Doações</p>
                          <p className="font-semibold text-2xl text-purple-600">
                            {previewData.data.newDonations}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Receita Total</p>
                          <p className="font-semibold text-2xl text-amber-600">
                            R$ {previewData.data.totalRevenue.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                    {reportType === "users" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Usuários</p>
                        <p className="font-semibold text-2xl text-blue-600">
                          {previewData.data.totalUsers}
                        </p>
                      </div>
                    )}
                    {reportType === "growth" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Novos Usuários (30 dias)</p>
                        <p className="font-semibold text-2xl text-blue-600">
                          {previewData.data.totalNewUsers}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dados Detalhados */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Dados Detalhados</h3>
                  <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-auto">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(previewData.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                Selecione um tipo de relatório acima
              </p>
            )}
          </CardContent>
        </Card>

        {/* Informações */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Formatos Disponíveis:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>JSON:</strong> Formato completo com todos os dados estruturados
              </li>
              <li>
                <strong>CSV/Excel:</strong> Tabela compatível com Excel e Google Sheets
              </li>
              <li>
                <strong>PDF:</strong> Em desenvolvimento - use JSON ou CSV por enquanto
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
