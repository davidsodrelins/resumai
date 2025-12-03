import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlobalNavigation from "@/components/GlobalNavigation";

export default function SoftSkills() {
  const { user, loading: authLoading } = useAuth();
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  
  // Buscar último currículo do usuário
  const { data: resumes } = trpc.history.listResumes.useQuery(undefined, {
    enabled: !!user,
  });
  
  // Analisar soft skills
  const analyzeMutation = trpc.analysis.analyzeSoftSkills.useMutation();
  
  const latestResume = resumes?.[0];
  const analysis = analyzeMutation.data;
  
  const handleAnalyze = async () => {
    if (!latestResume) {
      toast.error("Nenhum currículo encontrado. Crie um currículo primeiro.");
      return;
    }
    
    try {
      await analyzeMutation.mutateAsync({
        resumeData: latestResume.resumeData,
        language: "pt",
      });
      toast.success("Análise de soft skills concluída!");
    } catch (error) {
      toast.error("Erro ao analisar soft skills");
      console.error(error);
    }
  };
  
  const handleApplySkill = (skill: any) => {
    // TODO: Implementar aplicação da skill no currículo
    toast.success(`Soft skill "${skill.skill}" aplicada com sucesso!`);
    // Aqui você integraria com o editor de currículo para inserir o texto
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Faça login para continuar</h2>
        <Button onClick={() => window.location.href = "/api/oauth/login"}>
          Fazer Login
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <GlobalNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Análise de Soft Skills</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Identifique soft skills presentes no seu currículo e receba sugestões contextualizadas 
              de como adicionar habilidades relevantes para sua área
            </p>
            
            {!analysis && (
              <Button 
                size="lg" 
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending || !latestResume}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Analisar Meu Currículo
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Analysis Results */}
          {analysis && (
            <>
              {/* Coverage Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Pontuação de Cobertura</CardTitle>
                  <CardDescription>
                    Percentual de soft skills relevantes presentes no seu currículo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-5xl font-bold text-primary">
                      {analysis.summary.coverageScore}%
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {analysis.summary.totalDetected} detectadas
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {analysis.summary.totalSuggested} sugeridas
                      </p>
                    </div>
                  </div>
                  <Progress value={analysis.summary.coverageScore} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {analysis.summary.coverageScore >= 80 && "Excelente! Seu currículo demonstra uma ampla gama de soft skills."}
                    {analysis.summary.coverageScore >= 60 && analysis.summary.coverageScore < 80 && "Bom! Considere adicionar algumas das soft skills sugeridas abaixo."}
                    {analysis.summary.coverageScore < 60 && "Há oportunidades de melhoria. Adicione as soft skills sugeridas para fortalecer seu perfil."}
                  </p>
                </CardContent>
              </Card>
              
              {/* Detected Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Soft Skills Detectadas</CardTitle>
                  <CardDescription>
                    Habilidades identificadas no seu currículo atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.detectedSkills.map((skill: any, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Suggested Skills */}
              {analysis.suggestedSkills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Soft Skills Sugeridas</CardTitle>
                    <CardDescription>
                      Habilidades relevantes que você pode adicionar ao seu currículo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.suggestedSkills.map((suggestion: any, index: number) => (
                      <Collapsible
                        key={index}
                        open={expandedSkill === suggestion.skill}
                        onOpenChange={() => setExpandedSkill(
                          expandedSkill === suggestion.skill ? null : suggestion.skill
                        )}
                      >
                        <Card className="border-2 hover:border-primary/50 transition-colors">
                          <CollapsibleTrigger className="w-full">
                            <CardHeader className="cursor-pointer">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg">{suggestion.skill}</CardTitle>
                                    <Badge variant={
                                      suggestion.importance === "high" ? "destructive" :
                                      suggestion.importance === "medium" ? "default" : "secondary"
                                    }>
                                      {suggestion.importance === "high" && "Alta Prioridade"}
                                      {suggestion.importance === "medium" && "Média Prioridade"}
                                      {suggestion.importance === "low" && "Baixa Prioridade"}
                                    </Badge>
                                  </div>
                                  <CardDescription className="mt-2">
                                    {suggestion.reason}
                                  </CardDescription>
                                </div>
                                {expandedSkill === suggestion.skill ? (
                                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                                )}
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <CardContent className="space-y-4 pt-0">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-muted-foreground">
                                  Exemplo Contextualizado:
                                </h4>
                                <p className="text-sm bg-slate-50 p-3 rounded-md border">
                                  {suggestion.example}
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-muted-foreground">
                                  Texto Pronto para Inserir:
                                </h4>
                                <p className="text-sm bg-primary/5 p-3 rounded-md border border-primary/20">
                                  {suggestion.insertionText}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-muted-foreground">
                                  Seção sugerida: <strong>{suggestion.suggestedSection === "summary" ? "Resumo" : "Experiência"}</strong>
                                </span>
                                <Button
                                  onClick={() => handleApplySkill(suggestion)}
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Aplicar Soft Skill
                                </Button>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* Actions */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleAnalyze}>
                  Analisar Novamente
                </Button>
                <Button asChild>
                  <a href="/generator">Editar Currículo</a>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
