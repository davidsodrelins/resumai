import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import type { ResumeData } from "@shared/resumeTypes";
import GlobalNavigation from "@/components/GlobalNavigation";

export default function CoverLetter() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  // Mock resume data - in real app, this would come from selected resume
  const mockResumeData: ResumeData = {
    personalInfo: {
      fullName: "Seu Nome",
      email: "seu.email@example.com",
      phone: "+55 11 99999-9999",
      location: "São Paulo, Brasil",
      summary: "Profissional experiente com forte background em tecnologia",
    },
    experience: [
      {
        company: "Empresa Atual",
        position: "Cargo Atual",
        startDate: "2020",
        endDate: "Presente",
        description: "Descrição das responsabilidades",
        achievements: ["Conquista 1", "Conquista 2"],
      },
    ],
    education: [
      {
        institution: "Universidade",
        degree: "Bacharelado",
        field: "Ciência da Computação",
        startDate: "2015",
        endDate: "2019",
      },
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js"],
    languages: [],
    certifications: [],
    projects: [],
    additionalSections: [],
  };

  const generateMutation = trpc.coverLetter.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setEditedContent(data.content);
      toast.success("Carta de apresentação gerada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao gerar carta: " + error.message);
    },
  });

  const handleGenerate = () => {
    if (!companyName || !jobTitle) {
      toast.error("Por favor, preencha empresa e cargo");
      return;
    }

    generateMutation.mutate({
      resumeData: mockResumeData,
      companyName,
      jobTitle,
      jobDescription: jobDescription || undefined,
      language,
      additionalInfo: additionalInfo || undefined,
    });
  };

  const handleExportDOCX = () => {
    toast.info("Exportação DOCX em desenvolvimento");
  };

  const handleExportPDF = () => {
    toast.info("Exportação PDF em desenvolvimento");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Autenticação Necessária</CardTitle>
            <CardDescription>
              Você precisa estar autenticado para gerar cartas de apresentação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GlobalNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/generator">
                <a className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </a>
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-900">
                Gerador de Cartas de Apresentação
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Crie cartas personalizadas com IA para cada vaga que você se candidatar
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Vaga</CardTitle>
                  <CardDescription>
                    Preencha os detalhes da vaga para personalizar sua carta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa *</Label>
                    <Input
                      id="company"
                      placeholder="Nome da empresa"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job">Cargo *</Label>
                    <Input
                      id="job"
                      placeholder="Título da vaga"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição da Vaga (opcional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Cole aqui a descrição da vaga para melhor personalização..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional">Informações Adicionais (opcional)</Label>
                    <Textarea
                      id="additional"
                      placeholder="Adicione qualquer informação extra que queira incluir..."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending}
                    className="w-full"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Gerar Carta de Apresentação
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Preview da Carta</CardTitle>
                      <CardDescription>
                        {generatedContent
                          ? "Edite o conteúdo se necessário"
                          : "A carta aparecerá aqui após a geração"}
                      </CardDescription>
                    </div>
                    {generatedContent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Visualizar" : "Editar"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!generatedContent ? (
                    <div className="text-center py-12 text-slate-400">
                      <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Preencha o formulário e clique em "Gerar" para criar sua carta</p>
                    </div>
                  ) : isEditing ? (
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={20}
                      className="font-serif text-sm"
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                        {editedContent}
                      </div>
                    </div>
                  )}

                  {generatedContent && (
                    <div className="flex gap-2 mt-6">
                      <Button onClick={handleExportDOCX} variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar DOCX
                      </Button>
                      <Button onClick={handleExportPDF} variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
