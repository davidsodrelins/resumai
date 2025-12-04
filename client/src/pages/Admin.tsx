import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Users, Heart, TrendingUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

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

  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: recentUsers, isLoading: usersLoading } = trpc.admin.getRecentUsers.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const promoteUserMutation = trpc.admin.promoteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário promovido a admin com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao promover usuário");
    },
  });

  const demoteUserMutation = trpc.admin.demoteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário rebaixado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao rebaixar usuário");
    },
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário deletado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao deletar usuário");
    },
  });

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

        {/* Estatísticas */}
        {statsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : stats ? (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Usuários cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Apoiadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDonors}</div>
                <p className="text-xs text-muted-foreground mt-1">Usuários que doaram</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Doado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats.totalDonations.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Valor total em doações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground mt-1">Usuários com role admin</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Usuários Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <CardDescription>Últimos usuários cadastrados na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : recentUsers && recentUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Nome</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Doador</th>
                      <th className="text-left py-3 px-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u: any) => (
                      <tr key={u.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">{u.name}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            u.isDonor ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {u.isDonor ? "Sim" : "Não"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {u.role === "user" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => promoteUserMutation.mutate({ userId: u.id })}
                                disabled={promoteUserMutation.isPending}
                              >
                                Promover
                              </Button>
                            )}
                            {u.role === "admin" && u.id !== user.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => demoteUserMutation.mutate({ userId: u.id })}
                                disabled={demoteUserMutation.isPending}
                              >
                                Rebaixar
                              </Button>
                            )}
                            {u.id !== user.id && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja deletar ${u.name}?`)) {
                                    deleteUserMutation.mutate({ userId: u.id });
                                  }
                                }}
                                disabled={deleteUserMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
