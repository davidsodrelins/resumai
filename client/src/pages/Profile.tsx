import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, FileText, Calendar, Heart, TrendingUp, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import GlobalNavigation from "@/components/GlobalNavigation";
import { useState } from "react";
import DonationModal from "@/components/DonationModal";

export default function Profile() {
  const { user } = useAuth();
  const [showDonationModal, setShowDonationModal] = useState(false);
  
  const { data: usageStats, isLoading: loadingUsage } = trpc.usage.getStats.useQuery();
  const { data: donationTotal, isLoading: loadingDonations } = trpc.donation.getTotal.useQuery();
  // isDonor is included in donationTotal response

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <GlobalNavigation />
        <div className="container mx-auto py-20 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">Você precisa estar logado para ver seu perfil.</p>
        </div>
      </div>
    );
  }

  const usagePercentage = usageStats ? (usageStats.resumesThisMonth / usageStats.limit) * 100 : 0;
  const remaining = usageStats ? usageStats.limit - usageStats.resumesThisMonth : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <GlobalNavigation />
      
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                {user.name}
                {donationTotal && donationTotal.isDonor && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Apoiador
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email || 'Usuário do ResumAI'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Uso Mensal
                </CardTitle>
                <CardDescription>
                  Acompanhe quantos currículos você criou este mês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {loadingUsage ? "Carregando..." : `${usageStats?.resumesThisMonth || 0} de ${usageStats?.limit || 5} currículos`}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {remaining} restantes
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-3" />
                </div>

                {(!donationTotal || !donationTotal.isDonor) && remaining <= 2 && remaining > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      <strong>⚠️ Atenção:</strong> Você está próximo do limite mensal. 
                      Considere apoiar o projeto para ter acesso ilimitado!
                    </p>
                  </div>
                )}

                {(!donationTotal || !donationTotal.isDonor) && remaining === 0 && (
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-900 dark:text-red-100">
                      <strong>🚫 Limite atingido:</strong> Você não pode criar mais currículos este mês. 
                      Apoie o projeto para ter acesso ilimitado!
                    </p>
                  </div>
                )}

                {donationTotal && donationTotal.isDonor && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <strong>✨ Apoiador:</strong> Você tem acesso ilimitado a todos os recursos do ResumAI. Obrigado pelo apoio!
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Seu limite será resetado automaticamente no próximo mês
                </div>
              </CardContent>
            </Card>

            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resumo de Atividade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {usageStats?.resumesThisMonth || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Currículos Criados
                  </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {usageStats?.resumesThisMonth || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Este Mês
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Donation Info */}
          <div className="space-y-6">
            {/* Donor Badge */}
            {donationTotal && donationTotal.isDonor ? (
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                    <Award className="w-5 h-5" />
                    Status de Apoiador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Apoiador Ativo
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Obrigado por apoiar o ResumAI!
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">Currículos ilimitados</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">Badge exclusivo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">Prioridade no suporte</span>
                    </div>
                  </div>

                  {donationTotal && donationTotal.total > 0 && (
                    <>
                      <Separator />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          R$ {(donationTotal.total / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total doado
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Apoie o ResumAI
                  </CardTitle>
                  <CardDescription>
                    Ajude a manter a plataforma gratuita para todos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ao apoiar o projeto, você ganha:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      <span>✨ Currículos ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      <span>⭐ Badge de Apoiador</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      <span>❤️ Ajude a comunidade</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => setShowDonationModal(true)}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Fazer Doação
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/generator">
                    <FileText className="mr-2 h-4 w-4" />
                    Criar Novo Currículo
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/history">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Histórico
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        open={showDonationModal}
        onOpenChange={setShowDonationModal}
      />
    </div>
  );
}
