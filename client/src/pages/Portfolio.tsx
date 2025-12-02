import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, ExternalLink, Eye, Download, Share2, Copy, Check } from "lucide-react";


export default function Portfolio() {

  
  // State
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [template, setTemplate] = useState<"modern" | "minimalist" | "professional">("modern");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Queries
  const { data: resumes, isLoading: loadingResumes } = trpc.history.listResumes.useQuery();
  const { data: previewData, isLoading: loadingPreview, refetch: refetchPreview } = trpc.portfolio.preview.useQuery(
    {
      resumeData: resumes?.find((r: any) => r.id === selectedResumeId)?.resumeData || {},
      template,
      theme,
      primaryColor,
    },
    {
      enabled: !!selectedResumeId && !!resumes,
    }
  );

  // Mutations
  const generateMutation = trpc.portfolio.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedUrl(data.portfolioUrl);
      alert("Portfolio gerado com sucesso!");
    },
    onError: (error) => {
      alert(`Erro ao gerar portfolio: ${error.message}`);
    },
  });

  // Update preview when data changes
  useEffect(() => {
    if (previewData) {
      // Combine HTML, CSS, and JS into a single document
      const fullHtml = previewData.html.replace(
        '<link rel="stylesheet" href="styles.css">',
        `<style>${previewData.css}</style>`
      ).replace(
        '<script src="script.js"></script>',
        `<script>${previewData.js}</script>`
      );
      setPreviewHtml(fullHtml);
    }
  }, [previewData]);

  // Handlers
  const handleGenerate = () => {
    if (!selectedResumeId) {
      alert("Por favor, selecione um currículo para gerar o portfolio.");
      return;
    }

    const resumeData = resumes?.find((r: any) => r.id === selectedResumeId)?.resumeData;
    if (!resumeData) return;

    generateMutation.mutate({
      resumeData,
      template,
      theme,
      primaryColor,
    });
  };

  const handleCopyUrl = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      alert("URL copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareUrl = () => {
    if (navigator.share && generatedUrl) {
      navigator.share({
        title: "Meu Portfolio Profissional",
        text: "Confira meu portfolio profissional!",
        url: generatedUrl,
      }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      handleCopyUrl();
    }
  };

  const templateDescriptions = {
    modern: "Design vibrante com animações suaves e gradientes. Ideal para profissionais de tech e startups.",
    minimalist: "Layout limpo e focado no conteúdo. Perfeito para designers e profissionais criativos.",
    professional: "Design corporativo com sidebar fixa. Recomendado para executivos e cargos de liderança.",
  };

  if (loadingResumes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Gerador de Portfolio Web</h1>
        <p className="text-muted-foreground">
          Transforme seu currículo em um site profissional em segundos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Resume Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Selecione um Currículo</CardTitle>
              <CardDescription>
                Escolha o currículo que deseja transformar em portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="resume-select">Currículo</Label>
                <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                  <SelectTrigger id="resume-select">
                    <SelectValue placeholder="Selecione um currículo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes?.map((resume: any) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.resumeData.personalInfo.fullName} - {resume.model} ({resume.language})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {resumes && resumes.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Você ainda não tem currículos salvos. Gere um currículo primeiro.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>2. Escolha o Template</CardTitle>
              <CardDescription>
                Selecione o estilo visual do seu portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-select">Template</Label>
                  <Select value={template} onValueChange={(v) => setTemplate(v as any)}>
                    <SelectTrigger id="template-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="minimalist">Minimalista</SelectItem>
                      <SelectItem value="professional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {templateDescriptions[template]}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme-select">Tema</Label>
                    <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
                      <SelectTrigger id="theme-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color-picker">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color-picker"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>3. Gerar Portfolio</CardTitle>
              <CardDescription>
                Publique seu portfolio e obtenha uma URL pública
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGenerate}
                disabled={!selectedResumeId || generateMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando Portfolio...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Gerar e Publicar
                  </>
                )}
              </Button>

              {generatedUrl && (
                <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">Portfolio Publicado!</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-green-700 dark:text-green-300">
                      URL do Portfolio
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedUrl}
                        readOnly
                        className="bg-white dark:bg-gray-900 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyUrl}
                        title="Copiar URL"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(generatedUrl, "_blank")}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Portfolio
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareUrl}
                      className="flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card className="h-[800px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Visualização em tempo real do seu portfolio
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchPreview()}
                  disabled={!selectedResumeId || loadingPreview}
                >
                  {loadingPreview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              {loadingPreview ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : previewHtml ? (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Portfolio Preview"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Eye className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum Preview Disponível</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Selecione um currículo e configure o template para visualizar o preview do seu portfolio.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
