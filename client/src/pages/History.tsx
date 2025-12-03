import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2, Download, Eye, Clock, ArrowLeft, GitCompare } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function History() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: resumes, isLoading, refetch } = trpc.history.listResumes.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const deleteMutation = trpc.history.deleteResume.useMutation({
    onSuccess: () => {
      toast.success("Currículo excluído com sucesso!");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao excluir currículo");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este currículo?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleView = (id: number) => {
    // Navigate to generator with resume ID to load it
    setLocation(`/generator?resumeId=${id}`);
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
              Você precisa estar autenticado para acessar o histórico de currículos.
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

  const getModelLabel = (model: string) => {
    const labels: Record<string, string> = {
      reduced: "Reduzido",
      mixed: "Misto",
      complete: "Completo",
    };
    return labels[model] || model;
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      pt: "Português",
      en: "Inglês",
      es: "Espanhol",
    };
    return labels[lang] || lang;
  };

  const getTemplateLabel = (template: string) => {
    const labels: Record<string, string> = {
      classic: "Clássico",
      modern: "Moderno",
      minimal: "Minimalista",
      executive: "Executivo",
      creative: "Criativo",
    };
    return labels[template] || template;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
              <FileText className="h-6 w-6" />
              Gerador de Currículos IA
            </a>
          </Link>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/compare">
                <a className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4" />
                  Comparar Versões
                </a>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/generator">
                <a className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Criar Novo Currículo
                </a>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Meus Currículos
            </h1>
            <p className="text-lg text-slate-600">
              Gerencie todos os seus currículos salvos em um só lugar
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Carregando currículos...</p>
            </div>
          ) : !resumes || resumes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Nenhum currículo salvo
                </h3>
                <p className="text-slate-600 mb-6">
                  Comece criando seu primeiro currículo profissional com IA
                </p>
                <Button asChild>
                  <Link href="/generator">
                    <a>Criar Currículo</a>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {resume.title}
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3" />
                          {format(new Date(resume.updatedAt), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </CardDescription>
                      </div>
                      {resume.isDraft && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                          Rascunho
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Modelo:</span>
                        <span>{getModelLabel(resume.model)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Idioma:</span>
                        <span>{getLanguageLabel(resume.language)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Template:</span>
                        <span>{getTemplateLabel(resume.template)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleView(resume.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(resume.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
