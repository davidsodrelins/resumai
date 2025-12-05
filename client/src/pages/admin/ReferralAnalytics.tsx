import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Award, 
  DollarSign,
  BarChart3,
  Calendar,
  Trophy
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ReferralAnalytics() {
  const { data: overview } = trpc.referralAnalytics.getOverviewStats.useQuery();
  const { data: growth } = trpc.referralAnalytics.getGrowthByMonth.useQuery();
  const { data: topReferrers } = trpc.referralAnalytics.getTopReferrers.useQuery();
  const { data: roi } = trpc.referralAnalytics.getROIMetrics.useQuery();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 Analytics do Programa de Indicações</h1>
        <p className="text-lg text-gray-600">
          Métricas e insights do programa Indique e Ganhe
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview?.totalReferrers || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Usuários que indicaram</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total de Indicações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview?.totalReferrals || 0}</div>
            <p className="text-sm text-gray-500 mt-1">
              {overview?.convertedReferrals || 0} convertidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview?.conversionRate || 0}%</div>
            <p className="text-sm text-gray-500 mt-1">Indicações → Cadastros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Acesso Ilimitado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview?.unlimitedUsers || 0}</div>
            <p className="text-sm text-gray-500 mt-1">Usuários ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* ROI Metrics */}
      {roi && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              ROI do Programa
            </CardTitle>
            <CardDescription>
              Análise de custo-benefício do programa de indicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Novos Usuários</p>
                <p className="text-2xl font-bold">{roi.newUsers}</p>
                <p className="text-sm text-gray-500">Via indicações</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Custo Total</p>
                <p className="text-2xl font-bold text-red-600">R$ {roi.totalCost}</p>
                <p className="text-sm text-gray-500">
                  {roi.totalBonusResumes} bônus + {roi.unlimitedCount} ilimitados
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Benefício Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {roi.totalBenefit}</p>
                <p className="text-sm text-gray-500">Lifetime value estimado</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">ROI do Programa:</span>
                <span className={`text-3xl font-bold ${roi.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {roi.roi > 0 ? '+' : ''}{roi.roi}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {roi.roi >= 0 
                  ? '✅ Programa está gerando retorno positivo'
                  : '⚠️ Programa está com custo maior que benefício'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level Distribution */}
      {overview?.levelDistribution && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Distribuição por Nível
            </CardTitle>
            <CardDescription>
              Quantos usuários em cada nível do programa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {overview.levelDistribution.map((level: any) => {
                const levelEmojis: Record<string, string> = {
                  bronze: "🥉",
                  silver: "🥈",
                  gold: "🥇",
                  platinum: "💎",
                };
                const levelEmoji = levelEmojis[level.level] || "🏅";

                const levelNames: Record<string, string> = {
                  bronze: "Bronze",
                  silver: "Prata",
                  gold: "Ouro",
                  platinum: "Platina",
                };
                const levelName = levelNames[level.level] || level.level;

                return (
                  <div key={level.level} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-2">{levelEmoji}</div>
                    <div className="text-2xl font-bold">{level.count}</div>
                    <div className="text-sm text-gray-600">{levelName}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth by Month */}
      {growth && growth.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Crescimento Mensal
            </CardTitle>
            <CardDescription>
              Indicações e conversões nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growth.map((month: any) => {
                const conversionRate = month.total > 0 
                  ? Math.round((month.converted / month.total) * 100) 
                  : 0;

                return (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-600">
                      {new Date(month.month + '-01').toLocaleDateString('pt-BR', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full flex items-center justify-center text-xs text-white font-semibold"
                            style={{ width: `${Math.min((month.total / 50) * 100, 100)}%` }}
                          >
                            {month.total > 5 && `${month.total}`}
                          </div>
                        </div>
                        <span className="text-sm font-semibold w-16 text-right">
                          {month.total} total
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {month.converted} convertidas ({conversionRate}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Referrers */}
      {topReferrers && topReferrers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Top 20 Indicadores
            </CardTitle>
            <CardDescription>
              Usuários com mais indicações convertidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Nome</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4 text-center">Indicações</th>
                    <th className="pb-3 pr-4 text-center">Nível</th>
                    <th className="pb-3 pr-4 text-center">Bônus</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topReferrers.map((user: any, index: number) => {
                    const levelEmojis: Record<string, string> = {
                      bronze: "🥉",
                      silver: "🥈",
                      gold: "🥇",
                      platinum: "💎",
                    };
                    const levelEmoji = levelEmojis[user.referralLevel] || "🏅";

                    const hasUnlimited = user.unlimitedUntil && new Date(user.unlimitedUntil) > new Date();

                    return (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 pr-4 font-semibold">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                        </td>
                        <td className="py-3 pr-4">{user.name || "Sem nome"}</td>
                        <td className="py-3 pr-4 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 pr-4 text-center font-semibold">{user.totalReferrals}</td>
                        <td className="py-3 pr-4 text-center text-xl">{levelEmoji}</td>
                        <td className="py-3 pr-4 text-center">{user.bonusResumes}</td>
                        <td className="py-3 text-center">
                          {hasUnlimited ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Ilimitado
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
