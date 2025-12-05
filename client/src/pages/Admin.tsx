import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Users,
  Heart,
  TrendingUp,
  FileText,
  DollarSign,
  UserCheck,
  UserX,
  Shield,
  Ban,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Filters and pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [donorFilter, setDonorFilter] = useState<"all" | "donor" | "non-donor">("all");

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Proteger rota - apenas admins podem acessar
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const utils = trpc.useUtils();

  // Queries
  const { data: globalStats, isLoading: statsLoading } = trpc.admin.getGlobalStats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: usersData, isLoading: usersLoading } = trpc.admin.getAllUsers.useQuery(
    {
      page,
      limit: 20,
      search: search || undefined,
      role: roleFilter,
      status: statusFilter,
      donorStatus: donorFilter,
    },
    {
      enabled: user?.role === "admin",
    }
  );

  const { data: growthData, isLoading: growthLoading } = trpc.admin.getGrowthData.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: activityLogs, isLoading: logsLoading } = trpc.admin.getActivityLogs.useQuery(
    { limit: 10 },
    {
      enabled: user?.role === "admin",
    }
  );

  // Mutations
  const promoteToAdminMutation = trpc.admin.promoteToAdmin.useMutation({
    onSuccess: () => {
      toast.success("Usuário promovido a admin com sucesso!");
      utils.admin.getAllUsers.invalidate();
      utils.admin.getGlobalStats.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao promover usuário");
    },
  });

  const demoteFromAdminMutation = trpc.admin.demoteFromAdmin.useMutation({
    onSuccess: () => {
      toast.success("Privilégios de admin removidos com sucesso!");
      utils.admin.getAllUsers.invalidate();
      utils.admin.getGlobalStats.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover privilégios");
    },
  });

  const blockUserMutation = trpc.admin.blockUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário bloqueado com sucesso!");
      utils.admin.getAllUsers.invalidate();
      utils.admin.getGlobalStats.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao bloquear usuário");
    },
  });

  const unblockUserMutation = trpc.admin.unblockUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário desbloqueado com sucesso!");
      utils.admin.getAllUsers.invalidate();
      utils.admin.getGlobalStats.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao desbloquear usuário");
    },
  });

  // Chart data
  const chartData = growthData
    ? {
        labels: growthData.map((d) => {
          const date = new Date(d.date);
          return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        }),
        datasets: [
          {
            label: "Novos Usuários",
            data: growthData.map((d) => d.count),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
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
          <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários, doações e estatísticas da plataforma</p>
        </div>

        {/* Estatísticas Globais */}
        {statsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : globalStats ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{globalStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{globalStats.newUsersThisMonth} este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  Total de Currículos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{globalStats.totalResumes}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{globalStats.newResumesThisMonth} este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-600" />
                  Apoiadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{globalStats.totalDonors}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {globalStats.totalPayments} doações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  Total Arrecadado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  R$ {(globalStats.totalDonations / 100).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {globalStats.totalAdmins} admins | {globalStats.totalBlocked} bloqueados
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Gráfico de Crescimento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Crescimento de Usuários (Últimos 30 Dias)</CardTitle>
            <CardDescription>Novos cadastros por dia</CardDescription>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : chartData ? (
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">Sem dados disponíveis</p>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>Pesquise, filtre e gerencie todos os usuários da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <Select
                value={roleFilter}
                onValueChange={(value: any) => {
                  setRoleFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Roles</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value: any) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={donorFilter}
                onValueChange={(value: any) => {
                  setDonorFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Apoiador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="donor">Apoiadores</SelectItem>
                  <SelectItem value="non-donor">Não Apoiadores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabela */}
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : usersData && usersData.users.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Nome</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Role</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Apoiador</th>
                        <th className="text-left py-3 px-4 font-medium">Currículos</th>
                        <th className="text-left py-3 px-4 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.users.map((u: any) => (
                        <tr key={u.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">{u.name || "-"}</td>
                          <td className="py-3 px-4">{u.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                u.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                u.isBlocked === 1
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {u.isBlocked === 1 ? "Bloqueado" : "Ativo"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {u.isDonor === 1 ? (
                              <span className="flex items-center gap-1 text-pink-600">
                                <Heart className="h-3 w-3 fill-current" />
                                R$ {(u.totalDonated / 100).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">{u.resumesThisMonth || 0}/mês</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {/* Promover/Rebaixar */}
                              {u.role === "user" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => promoteToAdminMutation.mutate({ userId: u.id })}
                                  disabled={promoteToAdminMutation.isPending}
                                  title="Promover a Admin"
                                >
                                  <Shield className="h-4 w-4" />
                                </Button>
                              )}
                              {u.role === "admin" && u.id !== user.id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => demoteFromAdminMutation.mutate({ userId: u.id })}
                                  disabled={demoteFromAdminMutation.isPending}
                                  title="Remover Admin"
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              )}

                              {/* Bloquear/Desbloquear */}
                              {u.id !== user.id && (
                                <>
                                  {u.isBlocked === 0 ? (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        if (confirm(`Tem certeza que deseja bloquear ${u.email}?`)) {
                                          blockUserMutation.mutate({ userId: u.id });
                                        }
                                      }}
                                      disabled={blockUserMutation.isPending}
                                      title="Bloquear Usuário"
                                    >
                                      <Ban className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => unblockUserMutation.mutate({ userId: u.id })}
                                      disabled={unblockUserMutation.isPending}
                                      title="Desbloquear Usuário"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(page - 1) * 20 + 1} a {Math.min(page * 20, usersData.total)} de{" "}
                    {usersData.total} usuários
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-sm">
                        Página {page} de {usersData.totalPages}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(usersData.totalPages, p + 1))}
                      disabled={page === usersData.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado</p>
            )}
          </CardContent>
        </Card>

        {/* Logs de Atividade */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de Atividade</CardTitle>
            <CardDescription>Últimas ações administrativas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : activityLogs && activityLogs.length > 0 ? (
              <div className="space-y-4">
                {activityLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Por {log.adminName || log.adminEmail} •{" "}
                        {new Date(log.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        log.action.includes("promote")
                          ? "bg-purple-100 text-purple-800"
                          : log.action.includes("block")
                          ? "bg-red-100 text-red-800"
                          : log.action.includes("unblock")
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">Nenhuma atividade registrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
