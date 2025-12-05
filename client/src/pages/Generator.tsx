import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { trackResumeCreated, trackResumeDownload } from "../lib/analytics";
import { FileText, Upload, Loader2, Download, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { ResumeEditor } from "@/components/ResumeEditor";
import { TemplateSelector } from "@/components/TemplateSelector";
import { ResumePreview } from "@/components/ResumePreview";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { useAutoSave } from '@/hooks/useAutoSave';
import { LimitReachedModal } from '@/components/LimitReachedModal';
import DonationModal from '@/components/DonationModal';
import ResumeSuccessModal from '@/components/ResumeSuccessModal';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ATSScoreBadge from "@/components/ATSScoreBadge";
import GlobalNavigation from "@/components/GlobalNavigation";
import type { ResumeTemplate } from "@/../../shared/resumeTypes";

export default function Generator() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Step 1: Input data
  const [userPrompt, setUserPrompt] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFilesText, setUploadedFilesText] = useState<string[]>([]);
  
  // Step 2: Generated data
  const [extractedData, setExtractedData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'select' | 'preview'>('input');
  
  // Step 3: Selection
  const [selectedModel, setSelectedModel] = useState<'reduced' | 'mixed' | 'complete'>('complete');
  const [selectedLanguage, setSelectedLanguage] = useState<'pt' | 'en' | 'es'>('pt');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('classic');
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [resumeDraft, setResumeDraft, clearResumeDraft] = useLocalStorage<any>('resume-draft', null);
  const [draftMetadata, setDraftMetadata, clearDraftMetadata] = useLocalStorage<any>('resume-draft-metadata', null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const saveResumeMutation = trpc.history.saveResume.useMutation();
  const uploadFileMutation = trpc.resume.uploadFile.useMutation();
  const processInputsMutation = trpc.resume.processInputs.useMutation();
  const generateResumeMutation = trpc.resume.generateResume.useMutation();
  const exportDOCXMutation = trpc.resume.exportDOCX.useMutation();
  const exportPDFMutation = trpc.resume.exportPDF.useMutation();
  const exportLatexMutation = trpc.resume.exportLatex.useMutation();

  // Auto-save functionality
  const autoSave = useAutoSave({
    data: generatedResume,
    onSave: async (data) => {
      if (!data) return;
      await saveResumeMutation.mutateAsync({
        resumeData: data,
        model: selectedModel,
        language: selectedLanguage,
        template: selectedTemplate,
        title: `Rascunho - ${new Date().toLocaleString('pt-BR')}`,
      });
    },
    delay: 30000, // 30 seconds
    enabled: currentStep === 'preview' && !!generatedResume,
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    if (resumeDraft && !generatedResume) {
      setGeneratedResume(resumeDraft);
      setCurrentStep('preview');
      
      // Restore metadata if available
      if (draftMetadata) {
        if (draftMetadata.model) setSelectedModel(draftMetadata.model);
        if (draftMetadata.language) setSelectedLanguage(draftMetadata.language);
        if (draftMetadata.template) setSelectedTemplate(draftMetadata.template);
      }
      
      toast.info('Rascunho recuperado do armazenamento local');
    }
  }, []);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const file of newFiles) {
      try {
        toast.info(`Processando ${file.name}...`);
        
        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        const result = await uploadFileMutation.mutateAsync({
          fileUrl: dataUrl,
          mimeType: file.type
        });

        if (result.success && result.text) {
          setUploadedFilesText(prev => [...prev, result.text!]);
          toast.success(`${file.name} processado com sucesso`);
        }
      } catch (error) {
        toast.error(`Erro ao processar ${file.name}`);
        console.error(error);
      }
    }
  };

  const handleProcessInputs = async () => {
    if (!userPrompt.trim()) {
      toast.error("Por favor, forneça instruções sobre seu currículo");
      return;
    }

    try {
      toast.info("Processando suas informações com IA...");
      
      const result = await processInputsMutation.mutateAsync({
        userPrompt,
        linkedinUrl: linkedinUrl || undefined,
        uploadedFilesText: uploadedFilesText.length > 0 ? uploadedFilesText : undefined
      });

      if (result.success && result.data) {
        setExtractedData(result.data);
        setCurrentStep('select');
        toast.success("Informações processadas com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao processar informações. Tente novamente.");
      console.error(error);
    }
  };

  const handleGenerateResume = async () => {
    if (!extractedData) return;

    try {
      toast.info(`Gerando currículo ${selectedModel} em ${selectedLanguage.toUpperCase()}...`);
      
      const result = await generateResumeMutation.mutateAsync({
        data: extractedData,
        modelType: selectedModel,
        language: selectedLanguage
      });

      if (result.success && result.resume) {
        setGeneratedResume(result.resume);
        setResumeDraft(result.resume);
        setDraftMetadata({
          model: selectedModel,
          language: selectedLanguage,
          template: selectedTemplate
        });
        setCurrentStep('preview');
        
        // Track resume creation
        trackResumeCreated(selectedModel, selectedLanguage);
        
        // Show success modal with sharing options
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      if (error.message === 'LIMIT_REACHED') {
        setShowLimitModal(true);
      } else {
        toast.error("Erro ao gerar currículo. Tente novamente.");
        console.error(error);
      }
    }
  };

  const handleExportDOCX = async () => {
    if (!generatedResume) return;

    try {
      toast.info("Gerando arquivo DOCX...");
      
      const result = await exportDOCXMutation.mutateAsync({
        resumeData: generatedResume
      });

      if (result.success && result.url) {
        window.open(result.url, '_blank');
        toast.success("DOCX gerado! Download iniciado.");
      }
    } catch (error) {
      toast.error("Erro ao exportar DOCX. Tente novamente.");
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    if (!generatedResume) return;

    try {
      toast.info("Gerando arquivo PDF...");
      
      const result = await exportPDFMutation.mutateAsync({
        resumeData: generatedResume,
        template: selectedTemplate
      });

      if (result.success && result.url) {
        window.open(result.url, '_blank');
        toast.success("PDF gerado! Download iniciado.");
      }
    } catch (error) {
      toast.error("Erro ao exportar PDF. Tente novamente.");
      console.error(error);
    }
  };

  const handleExportLatex = async () => {
    if (!generatedResume) return;

    try {
      toast.info("Gerando arquivo LaTeX...");
      
      const result = await exportLatexMutation.mutateAsync({
        resumeData: generatedResume,
        language: selectedLanguage
      });

      if (result.latex) {
        // Create blob and download
        const blob = new Blob([result.latex], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedResume.personalInfo.fullName.replace(/\s+/g, '_')}_resume.tex`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("LaTeX gerado! Download iniciado.");
      }
    } catch (error) {
      toast.error("Erro ao exportar LaTeX. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <GlobalNavigation />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep === 'input' ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'input' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                1
              </div>
              <span>Entrada</span>
            </div>
            <div className="w-16 h-1 bg-slate-200"></div>
            <div className={`flex items-center gap-2 ${currentStep === 'select' ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'select' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                2
              </div>
              <span>Seleção</span>
            </div>
            <div className="w-16 h-1 bg-slate-200"></div>
            <div className={`flex items-center gap-2 ${currentStep === 'preview' ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'preview' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                3
              </div>
              <span>Preview</span>
            </div>
          </div>
        </div>

        {/* Step 1: Input */}
        {currentStep === 'input' && (
          <Card>
            <CardHeader>
              <CardTitle>Forneça suas Informações</CardTitle>
              <CardDescription>
                Insira suas informações profissionais para gerar currículos otimizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Instruções e Informações *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Descreva sua experiência profissional, objetivos de carreira, habilidades principais e qualquer informação relevante que você gostaria de incluir no currículo..."
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-sm text-slate-500">
                  Quanto mais detalhes você fornecer, melhor será o resultado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">URL do LinkedIn (opcional)</Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/seu-perfil"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Currículos Anteriores (opcional)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-sm text-slate-600 mb-2">
                      Clique para fazer upload ou arraste arquivos
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF ou DOCX (máx. 10MB cada)
                    </p>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 p-2 rounded">
                        <FileText className="h-4 w-4" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleProcessInputs} 
                disabled={processInputsMutation.isPending}
                className="w-full"
                size="lg"
              >
                {processInputsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Processar Informações'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Selection */}
        {currentStep === 'select' && (
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Modelo e Idioma</CardTitle>
              <CardDescription>
                Selecione o tipo de currículo e o idioma desejado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Visual Selection */}
              <div className="space-y-2">
                <Label>Template Visual</Label>
                <TemplateSelector 
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Modelo de Currículo</Label>
                <Select value={selectedModel} onValueChange={(value: any) => setSelectedModel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reduced">
                      Reduzido - Informações essenciais (1 página)
                    </SelectItem>
                    <SelectItem value="mixed">
                      Misto - Últimas 2 experiências completas (1-2 páginas)
                    </SelectItem>
                    <SelectItem value="complete">
                      Completo - Todas as informações (2-3 páginas)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select value={selectedLanguage} onValueChange={(value: any) => setSelectedLanguage(value)}>
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

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('input')}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleGenerateResume}
                  disabled={generateResumeMutation.isPending}
                  className="flex-1"
                >
                  {generateResumeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Currículo'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Preview */}
        {currentStep === 'preview' && generatedResume && (
          <div className="space-y-6">
            {/* Editor Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Editar Currículo</CardTitle>
                    <CardDescription>
                      Faça ajustes nas informações do seu currículo
                    </CardDescription>
                  </div>
                  <AutoSaveIndicator 
                    isSaving={autoSave.isSaving}
                    lastSaved={autoSave.lastSaved}
                    error={autoSave.error}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ResumeEditor 
                  resumeData={{
                    ...generatedResume,
                    skills: generatedResume.skills?.flatMap((s: any) => s.items || []) || [],
                    languages: generatedResume.languages?.map((l: any) => ({
                      name: l.language,
                      proficiency: l.proficiency,
                    })) || [],
                    certifications: generatedResume.certifications?.map((c: any) => ({
                      name: c.name,
                      issuer: c.issuer,
                      date: c.date || "",
                      expiryDate: c.expiryDate,
                    })) || [],
                  }}
                  onUpdate={(updatedData) => {
                    setGeneratedResume(updatedData);
                    setResumeDraft(updatedData);
                    setDraftMetadata({
                      model: selectedModel,
                      language: selectedLanguage,
                      template: selectedTemplate
                    });
                  }}
                />
              </CardContent>
            </Card>
            
            {/* Preview Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Preview do Currículo</CardTitle>
                    <CardDescription>
                      Revise seu currículo e faça o download
                    </CardDescription>
                  </div>
                  {generatedResume && (
                    <ATSScoreBadge 
                      resumeData={{
                        ...generatedResume,
                        skills: generatedResume.skills?.flatMap((s: any) => s.items || []) || [],
                        languages: generatedResume.languages?.map((l: any) => ({
                          language: l.language || l,
                          proficiency: l.proficiency || "Fluente"
                        })) || []
                      }}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ResumePreview 
                  resumeData={{
                    ...generatedResume,
                    skills: generatedResume.skills?.flatMap((s: any) => s.items || []) || [],
                    languages: generatedResume.languages?.map((l: any) => ({
                      name: l.language,
                      proficiency: l.proficiency,
                    })) || [],
                    certifications: generatedResume.certifications?.map((c: any) => ({
                      name: c.name,
                      issuer: c.issuer,
                      date: c.date || "",
                      expiryDate: c.expiryDate,
                    })) || [],
                  }}
                  template={selectedTemplate}
                  language={selectedLanguage}
                />
                {/* Old preview code removed - now using ResumePreview component */}
                <div className="hidden">
                  {/* Personal Info */}
                  {generatedResume.personalInfo && (
                    <div className="mb-6 text-center border-b pb-4">
                      {generatedResume.personalInfo.fullName && (
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                          {generatedResume.personalInfo.fullName}
                        </h2>
                      )}
                      <div className="text-sm text-slate-600 space-y-1">
                        {generatedResume.personalInfo.email && <p>{generatedResume.personalInfo.email}</p>}
                        {generatedResume.personalInfo.phone && <p>{generatedResume.personalInfo.phone}</p>}
                        {generatedResume.personalInfo.location && <p>{generatedResume.personalInfo.location}</p>}
                      </div>
                      {generatedResume.personalInfo.summary && (
                        <p className="mt-4 text-slate-700 text-justify">
                          {generatedResume.personalInfo.summary}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Experience */}
                  {generatedResume.experience && generatedResume.experience.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">
                        {selectedLanguage === 'pt' ? 'EXPERIÊNCIA PROFISSIONAL' : selectedLanguage === 'en' ? 'WORK EXPERIENCE' : 'EXPERIENCIA PROFESIONAL'}
                      </h3>
                      {generatedResume.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-slate-900">{exp.position}</h4>
                              <p className="text-slate-700">{exp.company}</p>
                            </div>
                            <p className="text-sm text-slate-600 italic">
                              {exp.startDate} - {exp.endDate || (selectedLanguage === 'pt' ? 'Presente' : selectedLanguage === 'en' ? 'Present' : 'Presente')}
                            </p>
                          </div>
                          <p className="text-sm text-slate-700 mt-2">{exp.description}</p>
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                              {exp.achievements.map((ach: string, i: number) => (
                                <li key={i}>{ach}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {generatedResume.education && generatedResume.education.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">
                        {selectedLanguage === 'pt' ? 'EDUCAÇÃO' : selectedLanguage === 'en' ? 'EDUCATION' : 'EDUCACIÓN'}
                      </h3>
                      {generatedResume.education.map((edu: any, idx: number) => (
                        <div key={idx} className="mb-3">
                          <h4 className="font-semibold text-slate-900">
                            {edu.degree}{edu.field ? ` em ${edu.field}` : ''}
                          </h4>
                          <p className="text-slate-700">{edu.institution}</p>
                          {(edu.startDate || edu.endDate) && (
                            <p className="text-sm text-slate-600 italic">
                              {edu.startDate || ''} - {edu.endDate || (selectedLanguage === 'pt' ? 'Presente' : selectedLanguage === 'en' ? 'Present' : 'Presente')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {generatedResume.skills && generatedResume.skills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">
                        {selectedLanguage === 'pt' ? 'HABILIDADES' : selectedLanguage === 'en' ? 'SKILLS' : 'HABILIDADES'}
                      </h3>
                      {generatedResume.skills.map((skill: any, idx: number) => (
                        <div key={idx} className="mb-2">
                          <span className="font-semibold text-slate-900">{skill.category}:</span>{' '}
                          <span className="text-slate-700">{skill.items && Array.isArray(skill.items) ? skill.items.join(', ') : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('select')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleExportDOCX}
                    disabled={exportDOCXMutation.isPending}
                    variant="outline"
                    className="flex-1"
                  >
                    {exportDOCXMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Baixar DOCX
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleExportPDF}
                    disabled={exportPDFMutation.isPending}
                    variant="outline"
                    className="flex-1"
                  >
                    {exportPDFMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Baixar PDF
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleExportLatex}
                    disabled={exportLatexMutation.isPending}
                    className="flex-1"
                  >
                    {exportLatexMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Baixar LaTeX
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <LimitReachedModal
        open={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onDonate={() => {
          setShowLimitModal(false);
          setShowDonationModal(true);
        }}
        remaining={0}
        limit={5}
      />
      
      <DonationModal
        open={showDonationModal}
        onOpenChange={setShowDonationModal}
      />
      
      <ResumeSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
