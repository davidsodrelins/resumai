import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Gift, 
  Trophy, 
  Copy, 
  Check, 
  Share2, 
  Crown,
  Star,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false);
  const { data: referralStats } = trpc.referral.getRewardStats.useQuery();
  const { data: leaderboard } = trpc.referral.getLeaderboard.useQuery();

  const { data: codeData } = trpc.referral.getMyReferralCode.useQuery();
  const referralCode = codeData?.code || "LOADING";
  const referralLink = `https://resumai.davidsodre.com/signup?ref=${referralCode}`;
  const totalReferrals = referralStats?.totalReferrals || 0;
  const activeReferrals = totalReferrals; // Todas as indicações são ativas

  // Definir nível atual baseado em indicações
  const getCurrentLevel = (count: number) => {
    if (count >= 20) return { name: "Platina", icon: Crown, color: "text-purple-600", bg: "bg-purple-100" };
    if (count >= 10) return { name: "Ouro", icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-100" };
    if (count >= 5) return { name: "Prata", icon: Star, color: "text-gray-600", bg: "bg-gray-100" };
    return { name: "Bronze", icon: Award, color: "text-orange-600", bg: "bg-orange-100" };
  };

  // Calcular progresso para próximo nível
  const getProgressToNextLevel = (count: number) => {
    if (count >= 20) return { current: count, target: count, percent: 100, nextLevel: "Máximo" };
    if (count >= 10) return { current: count, target: 20, percent: ((count - 10) / 10) * 100, nextLevel: "Platina" };
    if (count >= 5) return { current: count, target: 10, percent: ((count - 5) / 5) * 100, nextLevel: "Ouro" };
    return { current: count, target: 5, percent: (count / 5) * 100, nextLevel: "Prata" };
  };

  const currentLevel = getCurrentLevel(totalReferrals);
  const progress = getProgressToNextLevel(totalReferrals);
  const LevelIcon = currentLevel.icon;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const shareOnWhatsApp = () => {
    const message = `🚀 Descubra o ResumAI! Crie currículos profissionais com IA em 5 minutos. Use meu link e ganhe benefícios: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">🎁 Programa de Indicações</h1>
        <p className="text-lg text-gray-600">
          Indique amigos, ganhe recompensas e desbloqueie benefícios exclusivos!
        </p>
      </div>

      {/* Nível Atual e Progresso */}
      <Card className="mb-8 border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 ${currentLevel.bg} rounded-full flex items-center justify-center`}>
                <LevelIcon className={`h-8 w-8 ${currentLevel.color}`} />
              </div>
              <div>
                <CardTitle className="text-2xl">Nível {currentLevel.name}</CardTitle>
                <CardDescription className="text-base">
                  {totalReferrals} indicações ativas • {activeReferrals} convertidas
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              {totalReferrals} indicações
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {progress.nextLevel !== "Máximo" ? (
            <>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso para {progress.nextLevel}</span>
                <span className="font-semibold">{progress.current}/{progress.target}</span>
              </div>
              <Progress value={progress.percent} className="h-3 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                Faltam {progress.target - progress.current} indicações para o próximo nível!
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-purple-600">
                🎉 Parabéns! Você atingiu o nível máximo!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link de Indicação */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Seu Link de Indicação
          </CardTitle>
          <CardDescription>
            Compartilhe este link com seus amigos para ganhar recompensas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 text-sm"
            />
            <Button onClick={handleCopyLink} variant="outline">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={shareOnWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </Button>
            <Button onClick={shareOnLinkedIn} className="flex-1 bg-blue-700 hover:bg-blue-800">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Níveis e Recompensas */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">🏆 Níveis e Recompensas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bronze */}
          <Card className={totalReferrals >= 1 ? "border-2 border-orange-300" : ""}>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-center text-orange-600">🥉 Bronze</CardTitle>
              <CardDescription className="text-center">1-4 indicações</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>+2 currículos por indicação</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>Badge "Amigo do ResumAI"</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Prata */}
          <Card className={totalReferrals >= 5 ? "border-2 border-gray-400 shadow-lg" : ""}>
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-gray-600" />
              </div>
              <CardTitle className="text-center text-gray-600">🥈 Prata</CardTitle>
              <CardDescription className="text-center">5-9 indicações</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  <span>Currículos ilimitados por 1 mês</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  <span>Badge "Embaixador Prata"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  <span>Acesso antecipado a novos templates</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Ouro */}
          <Card className={totalReferrals >= 10 ? "border-2 border-yellow-400 shadow-lg" : ""}>
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-center text-yellow-600">🥇 Ouro</CardTitle>
              <CardDescription className="text-center">10-19 indicações</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Currículos ilimitados por 3 meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Badge "Embaixador Ouro"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Consultoria de carreira 1-on-1 (30 min)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Platina */}
          <Card className={totalReferrals >= 20 ? "border-2 border-purple-400 shadow-xl" : ""}>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-center text-purple-600">💎 Platina</CardTitle>
              <CardDescription className="text-center">20+ indicações</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="font-bold">Currículos ilimitados PARA SEMPRE</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Badge "Lenda do ResumAI"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Consultoria de carreira mensal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Seu nome no Hall da Fama</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            🏆 Top 10 Indicadores do Mês
          </CardTitle>
          <CardDescription>
            Os maiores embaixadores do ResumAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-3">
                {leaderboard.map((user: any, index: number) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    index === 0 ? "bg-yellow-50 border-2 border-yellow-200" :
                    index === 1 ? "bg-gray-50 border-2 border-gray-200" :
                    index === 2 ? "bg-orange-50 border-2 border-orange-200" :
                    "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200 font-bold text-lg">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.totalReferrals} indicações</p>
                  </div>
                  <Badge variant="secondary">
                    {getCurrentLevel(user.totalReferrals).name}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Seja o primeiro no leaderboard! Comece a indicar agora.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
