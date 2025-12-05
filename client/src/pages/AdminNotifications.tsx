import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Bell,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminNotifications() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "warning" | "info" | "error">("all");

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Proteger rota - apenas admins podem acessar
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const { data: notifications, isLoading: notificationsLoading } =
    trpc.admin.getAdminNotifications.useQuery(undefined, {
      enabled: user?.role === "admin",
      refetchInterval: 30000, // Refresh every 30 seconds
    });

  // Filter notifications
  const filteredNotifications =
    notifications?.filter((n) => (filter === "all" ? true : n.type === filter)) || [];

  // Count by type
  const counts = {
    all: notifications?.length || 0,
    warning: notifications?.filter((n) => n.type === "warning").length || 0,
    info: notifications?.filter((n) => n.type === "info").length || 0,
    error: notifications?.filter((n) => n.type === "error").length || 0,
  };

  const getIcon = (type: "warning" | "info" | "error") => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getBadgeVariant = (type: "warning" | "info" | "error") => {
    switch (type) {
      case "warning":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  const getCardClass = (type: "warning" | "info" | "error") => {
    switch (type) {
      case "warning":
        return "border-l-4 border-l-amber-500";
      case "info":
        return "border-l-4 border-l-blue-500";
      case "error":
        return "border-l-4 border-l-red-500";
    }
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
            <Bell className="h-10 w-10 text-blue-600" />
            Notificações Administrativas
          </h1>
          <p className="text-muted-foreground">
            Alertas automáticos sobre atividades suspeitas e eventos importantes
          </p>
        </div>

        {/* Resumo */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all ${
              filter === "all" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Todas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{counts.all}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              filter === "warning" ? "ring-2 ring-amber-500" : ""
            }`}
            onClick={() => setFilter("warning")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Avisos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{counts.warning}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              filter === "info" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setFilter("info")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{counts.info}</div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              filter === "error" ? "ring-2 ring-red-500" : ""
            }`}
            onClick={() => setFilter("error")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Erros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{counts.error}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Notificações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notificações Recentes</CardTitle>
                <CardDescription>
                  Atualizadas automaticamente a cada 30 segundos
                </CardDescription>
              </div>
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="warning">Avisos</SelectItem>
                  <SelectItem value="info">Informações</SelectItem>
                  <SelectItem value="error">Erros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card key={notification.id} className={getCardClass(notification.type)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-lg">{notification.title}</h3>
                            <Badge className={getBadgeVariant(notification.type)}>
                              {notification.type === "warning"
                                ? "Aviso"
                                : notification.type === "info"
                                ? "Info"
                                : "Erro"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleString("pt-BR")}
                              {notification.userEmail && ` • ${notification.userEmail}`}
                            </p>
                            {notification.userId && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setLocation("/admin")}
                              >
                                Ver Usuário
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-xl font-semibold mb-2">Tudo tranquilo!</p>
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "Nenhuma notificação no momento"
                    : `Nenhuma notificação do tipo "${
                        filter === "warning" ? "Aviso" : filter === "info" ? "Info" : "Erro"
                      }"`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configurações de Alertas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Configurações de Alertas</CardTitle>
            <CardDescription>Personalize quando e como receber notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Alertas Automáticos Ativos:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Uso excessivo de recursos (10+ currículos/mês)</li>
                    <li>Novas doações nas últimas 24 horas</li>
                    <li>Usuários bloqueados no sistema</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Em Desenvolvimento:</strong> Notificações por email, detecção de múltiplas
                  tentativas de login, e alertas personalizados por tipo de evento.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
