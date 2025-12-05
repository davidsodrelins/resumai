import { useState } from "react";
import { trpc } from "@/lib/trpc";
import GlobalNavigation from "@/components/GlobalNavigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Lock, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");

  const { data: progress, isLoading } = trpc.achievements.getProgress.useQuery();
  const { data: stats } = trpc.achievements.getStats.useQuery();

  const rarityColors: Record<string, string> = {
    common: "bg-slate-400 text-white",
    rare: "bg-blue-500 text-white",
    epic: "bg-purple-500 text-white",
    legendary: "bg-amber-500 text-white",
  };

  const rarityLabels: Record<string, string> = {
    common: "Comum",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
  };

  const categoryLabels: Record<string, string> = {
    resumes: "Currículos",
    referrals: "Indicações",
    donations: "Doações",
    optimization: "Otimização",
    special: "Especial",
  };

  const filteredProgress = progress?.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.achievement.category === selectedCategory;
    const matchesRarity = selectedRarity === "all" || item.achievement.rarity === selectedRarity;
    return matchesCategory && matchesRarity;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <GlobalNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Carregando conquistas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GlobalNavigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-amber-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Conquistas
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Desbloqueie conquistas e mostre seu progresso!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Desbloqueadas</p>
                <p className="text-3xl font-bold mt-1">
                  {stats?.totalUnlocked || 0}
                </p>
              </div>
              <Trophy className="h-12 w-12 opacity-80" />
            </div>
            <Progress 
              value={((stats?.totalUnlocked || 0) / (stats?.totalAvailable || 1)) * 100} 
              className="mt-4 bg-blue-400"
            />
            <p className="text-xs mt-2 opacity-90">
              {stats?.totalUnlocked || 0} de {stats?.totalAvailable || 0}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Épicas</p>
                <p className="text-3xl font-bold mt-1">
                  {stats?.byRarity?.epic?.unlocked || 0}
                </p>
              </div>
              <Sparkles className="h-12 w-12 opacity-80" />
            </div>
            <p className="text-xs mt-4 opacity-90">
              de {stats?.byRarity?.epic?.total || 0} disponíveis
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Lendárias</p>
                <p className="text-3xl font-bold mt-1">
                  {stats?.byRarity?.legendary?.unlocked || 0}
                </p>
              </div>
              <Star className="h-12 w-12 opacity-80" />
            </div>
            <p className="text-xs mt-4 opacity-90">
              de {stats?.byRarity?.legendary?.total || 0} disponíveis
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Progresso Geral</p>
                <p className="text-3xl font-bold mt-1">
                  {Math.round(((stats?.totalUnlocked || 0) / (stats?.totalAvailable || 1)) * 100)}%
                </p>
              </div>
              <Trophy className="h-12 w-12 opacity-80" />
            </div>
            <Progress 
              value={((stats?.totalUnlocked || 0) / (stats?.totalAvailable || 1)) * 100} 
              className="mt-4 bg-green-400"
            />
          </Card>
        </div>

        {/* Filters */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              Todas
            </TabsTrigger>
            <TabsTrigger value="resumes" onClick={() => setSelectedCategory("resumes")}>
              Currículos
            </TabsTrigger>
            <TabsTrigger value="referrals" onClick={() => setSelectedCategory("referrals")}>
              Indicações
            </TabsTrigger>
            <TabsTrigger value="donations" onClick={() => setSelectedCategory("donations")}>
              Doações
            </TabsTrigger>
            <TabsTrigger value="optimization" onClick={() => setSelectedCategory("optimization")}>
              Otimização
            </TabsTrigger>
            <TabsTrigger value="special" onClick={() => setSelectedCategory("special")}>
              Especial
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Rarity Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedRarity("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRarity === "all"
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Todas as Raridades
          </button>
          {Object.entries(rarityLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedRarity(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedRarity === key
                  ? rarityColors[key]
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgress?.map((item, index) => (
            <Card
              key={index}
              className={`p-6 transition-all hover:shadow-lg ${
                item.unlocked
                  ? "bg-gradient-to-br from-white to-slate-50 border-2 border-amber-400"
                  : "bg-white opacity-75"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`text-5xl ${
                    item.unlocked ? "grayscale-0" : "grayscale opacity-40"
                  }`}
                >
                  {item.achievement.icon}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge className={rarityColors[item.achievement.rarity]}>
                    {rarityLabels[item.achievement.rarity]}
                  </Badge>
                  {item.unlocked && (
                    <Badge className="bg-green-500 text-white">
                      <Trophy className="h-3 w-3 mr-1" />
                      Desbloqueada
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-slate-800">
                {item.achievement.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {item.achievement.description}
              </p>

              {!item.unlocked && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progresso</span>
                    <span className="font-semibold text-slate-800">
                      {item.current} / {item.required}
                    </span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                  <p className="text-xs text-slate-500 text-right">
                    {item.progress}% concluído
                  </p>
                </div>
              )}

              {item.unlocked && (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Trophy className="h-4 w-4" />
                  <span>Conquistada!</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredProgress?.length === 0 && (
          <Card className="p-12 text-center">
            <Lock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Nenhuma conquista encontrada com esses filtros.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
