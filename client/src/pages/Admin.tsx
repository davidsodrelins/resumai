import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  BarChart3,
  Mail,
  Heart,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface AdminStats {
  totalUsers: number;
  totalDonors: number;
  totalDonations: number;
  totalResumesGenerated: number;
  emailsVerified: number;
  emailsPending: number;
  recentUsers: Array<{
    id: number;
    email: string;
    name: string;
    createdAt: string;
    emailVerified: boolean;
    isDonor: boolean;
  }>;
}

export function Admin() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAdminStats = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }

    // Check if user is admin
    if (user.role !== "admin") {
      setError("Acesso negado. Você não tem permissão para acessar o painel admin.");
      setLoading(false);
      return;
    }

    if (getAdminStats.data) {
      setStats(getAdminStats.data);
      setLoading(false);
    }

    if (getAdminStats.isLoading) {
      setLoading(true);
    }

    if (getAdminStats.error) {
      setError(getAdminStats.error.message);
      setLoading(false);
    }
  }, [user, getAdminStats.data, getAdminStats.isLoading, getAdminStats.error, setLocation]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="p-8">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
            <Button onClick={() => setLocation("/")} className="w-full mt-4">
              Voltar ao Início
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600">Bem-vindo, {user.name}! Aqui você pode gerenciar a plataforma.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>

          {/* Total Donors */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Apoiadores</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDonors}</p>
              </div>
              <Heart className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </Card>

          {/* Total Donations */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doações Totais</p>
                <p className="text-3xl font-bold text-gray-900">R$ {(stats.totalDonations / 100).toFixed(2)}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>

          {/* Total Resumes */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Currículos Gerados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalResumesGenerated}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </Card>

          {/* Emails Verified */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Verificados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.emailsVerified}</p>
              </div>
              <Mail className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>

          {/* Emails Pending */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.emailsPending}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Recent Users */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Usuários Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Verificado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Apoiador</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{user.email}</td>
                    <td className="py-3 px-4 text-gray-900">{user.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.emailVerified ? "✓ Sim" : "✗ Não"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.isDonor
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.isDonor ? "❤️ Sim" : "Não"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-blue-100 rounded transition">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded transition">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Export Data */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exportar Dados</h2>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Usuários (CSV)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Doações (CSV)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Relatório (PDF)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
