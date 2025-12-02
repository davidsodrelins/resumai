import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Download } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Compare() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const [selectedVersion1, setSelectedVersion1] = useState<string>("");
  const [selectedVersion2, setSelectedVersion2] = useState<string>("");

  const { data: resumes, isLoading } = trpc.history.listResumes.useQuery();
  const exportPDFMutation = trpc.resume.exportPDF.useMutation();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const resume1 = resumes?.find(r => r.id.toString() === selectedVersion1);
  const resume2 = resumes?.find(r => r.id.toString() === selectedVersion2);

  const handleExport = async (resumeId: string, title: string) => {
    try {
      const resume = resumes?.find(r => r.id.toString() === resumeId);
      if (!resume) {
        toast.error("Currículo não encontrado");
        return;
      }

      const result = await exportPDFMutation.mutateAsync({
        resumeData: resume.resumeData as any,
        template: resume.template || 'classic'
      });

      if (result.success && result.url) {
        window.open(result.url, '_blank');
        toast.success("PDF gerado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao exportar PDF");
      console.error(error);
    }
  };

  const renderField = (label: string, value1: any, value2: any) => {
    const isDifferent = JSON.stringify(value1) !== JSON.stringify(value2);
    
    return (
      <div className="grid grid-cols-2 gap-4 py-3 border-b">
        <div className="font-medium text-sm text-muted-foreground col-span-2">{label}</div>
        <div className={`${isDifferent ? 'bg-red-50 dark:bg-red-950/20 p-2 rounded' : ''}`}>
          <div className="text-sm">{value1 || "-"}</div>
        </div>
        <div className={`${isDifferent ? 'bg-green-50 dark:bg-green-950/20 p-2 rounded' : ''}`}>
          <div className="text-sm">{value2 || "-"}</div>
        </div>
      </div>
    );
  };

  const renderArrayField = (label: string, array1: any[], array2: any[]) => {
    const isDifferent = JSON.stringify(array1) !== JSON.stringify(array2);
    
    return (
      <div className="grid grid-cols-2 gap-4 py-3 border-b">
        <div className="font-medium text-sm text-muted-foreground col-span-2">{label}</div>
        <div className={`${isDifferent ? 'bg-red-50 dark:bg-red-950/20 p-2 rounded' : ''}`}>
          <ul className="text-sm space-y-1">
            {array1?.map((item, idx) => (
              <li key={idx} className="list-disc list-inside">{typeof item === 'string' ? item : JSON.stringify(item)}</li>
            ))}
            {(!array1 || array1.length === 0) && <li className="text-muted-foreground">Nenhum item</li>}
          </ul>
        </div>
        <div className={`${isDifferent ? 'bg-green-50 dark:bg-green-950/20 p-2 rounded' : ''}`}>
          <ul className="text-sm space-y-1">
            {array2?.map((item, idx) => (
              <li key={idx} className="list-disc list-inside">{typeof item === 'string' ? item : JSON.stringify(item)}</li>
            ))}
            {(!array2 || array2.length === 0) && <li className="text-muted-foreground">Nenhum item</li>}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Comparar Versões</h1>
            <p className="text-muted-foreground">
              Compare duas versões do seu currículo lado a lado
            </p>
          </div>
          <Link href="/history">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Version Selectors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecione as Versões</CardTitle>
            <CardDescription>
              Escolha duas versões para comparar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Versão 1 (Antiga)</label>
                <Select value={selectedVersion1} onValueChange={setSelectedVersion1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma versão" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes?.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id.toString()}>
                        {resume.title} - {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true, locale: ptBR })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Versão 2 (Nova)</label>
                <Select value={selectedVersion2} onValueChange={setSelectedVersion2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma versão" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes?.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id.toString()}>
                        {resume.title} - {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true, locale: ptBR })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison View */}
        {resume1 && resume2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Comparação Detalhada</CardTitle>
                  <CardDescription>
                    <span className="inline-block bg-red-100 dark:bg-red-950/30 px-2 py-1 rounded text-xs mr-2">Vermelho = Versão Antiga</span>
                    <span className="inline-block bg-green-100 dark:bg-green-950/30 px-2 py-1 rounded text-xs">Verde = Versão Nova</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport(selectedVersion1, resume1.title)}
                    disabled={exportPDFMutation.isPending}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar V1
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport(selectedVersion2, resume2.title)}
                    disabled={exportPDFMutation.isPending}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar V2
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Metadata */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Informações Gerais</h3>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="font-medium text-sm">Versão 1 (Antiga)</div>
                    <div className="font-medium text-sm">Versão 2 (Nova)</div>
                  </div>
                  {renderField("Título", resume1.title, resume2.title)}
                  {renderField("Modelo", resume1.model, resume2.model)}
                  {renderField("Idioma", resume1.language, resume2.language)}
                  {renderField("Template", resume1.template, resume2.template)}
                </div>

                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Informações Pessoais</h3>
                  {renderField("Nome", resume1.resumeData?.personalInfo?.fullName, resume2.resumeData?.personalInfo?.fullName)}
                  {renderField("Email", resume1.resumeData?.personalInfo?.email, resume2.resumeData?.personalInfo?.email)}
                  {renderField("Telefone", resume1.resumeData?.personalInfo?.phone, resume2.resumeData?.personalInfo?.phone)}
                  {renderField("Localização", resume1.resumeData?.personalInfo?.location, resume2.resumeData?.personalInfo?.location)}
                  {renderField("LinkedIn", resume1.resumeData?.personalInfo?.linkedin, resume2.resumeData?.personalInfo?.linkedin)}
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Resumo Profissional</h3>
                  {renderField("Resumo", resume1.resumeData?.personalInfo?.summary, resume2.resumeData?.personalInfo?.summary)}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Habilidades</h3>
                  {renderArrayField("Skills", resume1.resumeData?.skills || [], resume2.resumeData?.skills || [])}
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Experiência Profissional</h3>
                  {renderField(
                    "Número de Experiências",
                    resume1.resumeData?.experience?.length || 0,
                    resume2.resumeData?.experience?.length || 0
                  )}
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Educação</h3>
                  {renderField(
                    "Número de Formações",
                    resume1.resumeData?.education?.length || 0,
                    resume2.resumeData?.education?.length || 0
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!resume1 && !resume2 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Selecione duas versões para começar a comparação
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
