import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, XCircle, Lightbulb, TrendingUp, FileText } from "lucide-react";
import { toast } from "sonner";
import type { ResumeData } from "@shared/resumeTypes";

export default function Analysis() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [activeTab, setActiveTab] = useState("ats");

  // ATS Analysis
  const { data: atsScore, isLoading: atsLoading } = trpc.analysis.atsScore.useQuery(
    { resumeData: resumeData! },
    { enabled: !!resumeData && activeTab === "ats" }
  );

  // AI Improvements
  const improvementsMutation = trpc.analysis.improvements.useMutation();
  const applySuggestionMutation = trpc.analysis.applySuggestion.useMutation();

  // Keyword Matching
  const keywordMatchMutation = trpc.analysis.keywordMatch.useMutation();

  const handleLoadResume = () => {
    // Load resume from localStorage or history
    const savedResume = localStorage.getItem("currentResume");
    if (savedResume) {
      try {
        const parsed = JSON.parse(savedResume);
        setResumeData(parsed);
        toast.success("Currículo carregado com sucesso!");
      } catch (error) {
        toast.error("Erro ao carregar currículo");
      }
    } else {
      toast.error("Nenhum currículo encontrado. Gere um currículo primeiro.");
    }
  };

  const handleGenerateImprovements = async () => {
    if (!resumeData) return;

    try {
      const result = await improvementsMutation.mutateAsync({
        resumeData,
        language: "pt",
      });
      toast.success(`${result.summary.totalSuggestions} sugestões geradas!`);
    } catch (error) {
      toast.error("Erro ao gerar sugestões");
    }
  };

  const handleApplySuggestion = async (suggestion: any) => {
    if (!resumeData) return;

    try {
      const updated = await applySuggestionMutation.mutateAsync({
        resumeData,
        suggestion,
      });
      setResumeData(updated);
      toast.success("Sugestão aplicada com sucesso!");
    } catch (error) {
      toast.error("Erro ao aplicar sugestão");
    }
  };

  const handleApplyAllSuggestions = async (suggestions: any[]) => {
    if (!resumeData || suggestions.length === 0) return;

    try {
      let updatedResume = resumeData;
      for (const suggestion of suggestions) {
        updatedResume = await applySuggestionMutation.mutateAsync({
          resumeData: updatedResume,
          suggestion,
        });
      }
      setResumeData(updatedResume);
      toast.success(`${suggestions.length} sugestões aplicadas com sucesso!`);
    } catch (error) {
      toast.error("Erro ao aplicar sugestões");
    }
  };

  const handleKeywordAnalysis = async () => {
    if (!resumeData || !jobDescription.trim()) {
      toast.error("Adicione a descrição da vaga");
      return;
    }

    try {
      await keywordMatchMutation.mutateAsync({
        resumeData,
        jobDescription,
      });
      toast.success("Análise de palavras-chave concluída!");
    } catch (error) {
      toast.error("Erro ao analisar palavras-chave");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Análise e Otimização</h1>
              <p className="text-sm text-slate-600">
                Analise e melhore seu currículo com IA
              </p>
            </div>
            {!resumeData && (
              <Button onClick={handleLoadResume}>
                <FileText className="mr-2 h-4 w-4" />
                Carregar Currículo
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!resumeData ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum currículo carregado</CardTitle>
              <CardDescription>
                Carregue um currículo para começar a análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLoadResume} size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Carregar Currículo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ats">
                <TrendingUp className="mr-2 h-4 w-4" />
                Análise ATS
              </TabsTrigger>
              <TabsTrigger value="improvements">
                <Lightbulb className="mr-2 h-4 w-4" />
                Sugestões IA
              </TabsTrigger>
              <TabsTrigger value="keywords">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Palavras-Chave
              </TabsTrigger>
            </TabsList>

            {/* ATS Analysis Tab */}
            <TabsContent value="ats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pontuação ATS</CardTitle>
                  <CardDescription>
                    Compatibilidade do seu currículo com sistemas de rastreamento de candidatos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {atsLoading ? (
                    <div className="text-center py-8">Analisando...</div>
                  ) : atsScore ? (
                    <>
                      {/* Overall Score */}
                      <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary">
                          <span className="text-4xl font-bold text-primary">
                            {atsScore.overall}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Pontuação Geral</h3>
                          <p className="text-sm text-muted-foreground">
                            {atsScore.overall >= 80
                              ? "Excelente! Seu currículo está muito bem otimizado."
                              : atsScore.overall >= 60
                              ? "Bom! Algumas melhorias podem aumentar suas chances."
                              : "Atenção! Seu currículo precisa de otimizações importantes."}
                          </p>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Formatação</span>
                            <span className="font-semibold">{atsScore.breakdown.formatting}/25</span>
                          </div>
                          <Progress value={(atsScore.breakdown.formatting / 25) * 100} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Palavras-chave</span>
                            <span className="font-semibold">{atsScore.breakdown.keywords}/25</span>
                          </div>
                          <Progress value={(atsScore.breakdown.keywords / 25) * 100} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Verbos de Ação</span>
                            <span className="font-semibold">{atsScore.breakdown.actionVerbs}/25</span>
                          </div>
                          <Progress value={(atsScore.breakdown.actionVerbs / 25) * 100} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Quantificação</span>
                            <span className="font-semibold">{atsScore.breakdown.quantification}/25</span>
                          </div>
                          <Progress value={(atsScore.breakdown.quantification / 25) * 100} />
                        </div>
                      </div>

                      {/* Suggestions */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Sugestões de Melhoria</h4>
                        <div className="space-y-3">
                          {atsScore.suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="flex gap-3 p-4 rounded-lg border bg-card"
                            >
                              {suggestion.category === "critical" ? (
                                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                              ) : suggestion.category === "important" ? (
                                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium">{suggestion.title}</h5>
                                  <Badge
                                    variant={
                                      suggestion.category === "critical"
                                        ? "destructive"
                                        : suggestion.category === "important"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {suggestion.category === "critical"
                                      ? "Crítico"
                                      : suggestion.category === "important"
                                      ? "Importante"
                                      : "Opcional"}
                                  </Badge>
                                  <Badge variant="outline">+{suggestion.impact} pts</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {suggestion.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Carregue um currículo para ver a análise
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Improvements Tab */}
            <TabsContent value="improvements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sugestões de Melhorias com IA</CardTitle>
                  <CardDescription>
                    Análise inteligente para otimizar seu currículo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    onClick={handleGenerateImprovements}
                    disabled={improvementsMutation.isPending}
                    size="lg"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {improvementsMutation.isPending
                      ? "Analisando..."
                      : "Gerar Sugestões com IA"}
                  </Button>

                  {improvementsMutation.data && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {improvementsMutation.data.summary.totalSuggestions} Sugestões Encontradas
                        </h4>
                        <div className="flex gap-2">
                          <Badge variant="destructive">
                            {improvementsMutation.data.summary.highImpact} Alto Impacto
                          </Badge>
                          <Badge variant="default">
                            {improvementsMutation.data.summary.mediumImpact} Médio
                          </Badge>
                          <Badge variant="secondary">
                            {improvementsMutation.data.summary.lowImpact} Baixo
                          </Badge>
                        </div>
                      </div>

                      {improvementsMutation.data.summary.highImpact > 0 && (
                        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="space-y-1">
                            <h5 className="font-semibold text-primary">Aplicar Todas as Sugestões de Alto Impacto</h5>
                            <p className="text-sm text-muted-foreground">
                              Otimize seu currículo automaticamente aplicando as {improvementsMutation.data.summary.highImpact} sugestões mais importantes
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              const highImpactSuggestions = improvementsMutation.data!.suggestions.filter(
                                (s) => s.impact === "high"
                              );
                              handleApplyAllSuggestions(highImpactSuggestions);
                            }}
                            disabled={applySuggestionMutation.isPending}
                            variant="default"
                          >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            {applySuggestionMutation.isPending ? "Aplicando..." : "Aplicar Todas"}
                          </Button>
                        </div>
                      )}

                      <div className="space-y-3">
                        {improvementsMutation.data.suggestions.map((suggestion) => (
                          <Card key={suggestion.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-base">
                                    {suggestion.type === "action_verb"
                                      ? "Verbo de Ação"
                                      : suggestion.type === "quantification"
                                      ? "Quantificação"
                                      : suggestion.type === "bullet_optimization"
                                      ? "Otimização de Bullet Point"
                                      : "Densidade de Conteúdo"}
                                  </CardTitle>
                                  <CardDescription>{suggestion.explanation}</CardDescription>
                                </div>
                                <Badge
                                  variant={
                                    suggestion.impact === "high"
                                      ? "destructive"
                                      : suggestion.impact === "medium"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {suggestion.impact === "high"
                                    ? "Alto Impacto"
                                    : suggestion.impact === "medium"
                                    ? "Médio"
                                    : "Baixo"}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Original:
                                  </span>
                                  <p className="text-sm p-3 bg-muted rounded-md">
                                    {suggestion.original}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <span className="text-sm font-medium text-green-600">
                                    Melhorado:
                                  </span>
                                  <p className="text-sm p-3 bg-green-50 border border-green-200 rounded-md">
                                    {suggestion.improved}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleApplySuggestion(suggestion)}
                                disabled={applySuggestionMutation.isPending}
                                variant="outline"
                                size="sm"
                              >
                                Aplicar Sugestão
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Keywords Tab */}
            <TabsContent value="keywords" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Palavras-Chave</CardTitle>
                  <CardDescription>
                    Compare seu currículo com a descrição da vaga
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição da Vaga</label>
                    <Textarea
                      placeholder="Cole aqui a descrição completa da vaga..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleKeywordAnalysis}
                    disabled={keywordMatchMutation.isPending || !jobDescription.trim()}
                    size="lg"
                  >
                    {keywordMatchMutation.isPending ? "Analisando..." : "Analisar Compatibilidade"}
                  </Button>

                  {keywordMatchMutation.data && (
                    <div className="space-y-6">
                      {/* Match Percentage */}
                      <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary">
                          <span className="text-4xl font-bold text-primary">
                            {keywordMatchMutation.data.matchPercentage}%
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Compatibilidade</h3>
                          <p className="text-sm text-muted-foreground">
                            {keywordMatchMutation.data.matchedKeywords} de{" "}
                            {keywordMatchMutation.data.totalKeywords} palavras-chave encontradas
                          </p>
                        </div>
                      </div>

                      {/* Keywords List */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Palavras-Chave Analisadas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {keywordMatchMutation.data.keywords.slice(0, 20).map((keyword, index) => (
                            <div
                              key={index}
                              className={`flex items-start gap-3 p-3 rounded-lg border ${
                                keyword.present
                                  ? "bg-green-50 border-green-200"
                                  : "bg-red-50 border-red-200"
                              }`}
                            >
                              {keyword.present ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm">{keyword.keyword}</span>
                                  <Badge
                                    variant={
                                      keyword.importance === "high"
                                        ? "destructive"
                                        : keyword.importance === "medium"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {keyword.importance === "high"
                                      ? "Alta"
                                      : keyword.importance === "medium"
                                      ? "Média"
                                      : "Baixa"}
                                  </Badge>
                                </div>
                                {keyword.present && keyword.locations.length > 0 && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Encontrado em: {keyword.locations.join(", ")}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Suggestions */}
                      {keywordMatchMutation.data.suggestions.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Sugestões de Otimização</h4>
                          <div className="space-y-3">
                            {keywordMatchMutation.data.suggestions.map((suggestion, index) => (
                              <div key={index} className="p-4 rounded-lg border bg-card">
                                <div className="flex items-start gap-3">
                                  <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">
                                        {suggestion.keyword}
                                      </span>
                                      <Badge
                                        variant={
                                          suggestion.priority === "high"
                                            ? "destructive"
                                            : "default"
                                        }
                                      >
                                        {suggestion.priority === "high"
                                          ? "Prioridade Alta"
                                          : "Prioridade Média"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {suggestion.suggestion}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
