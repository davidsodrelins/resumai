import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, FileText, Calendar, Globe, Layout } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ResumePreview {
  id: number;
  title: string;
  template: string;
  language: string;
  model: string;
  updatedAt: Date;
  isDraft?: boolean;
}

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: ResumePreview | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  resume,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem("skipDeleteConfirmation", "true");
    }
    onConfirm();
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

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      pt: "Português",
      en: "Inglês",
      es: "Espanhol",
    };
    return labels[lang] || lang;
  };

  const getModelLabel = (model: string) => {
    const labels: Record<string, string> = {
      reduced: "Reduzido",
      mixed: "Misto",
      complete: "Completo",
    };
    return labels[model] || model;
  };

  if (!resume) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-xl">Confirmar Exclusão</DialogTitle>
          </div>
          <DialogDescription>
            Esta ação não pode ser desfeita. O currículo será permanentemente removido.
          </DialogDescription>
        </DialogHeader>

        {/* Preview do currículo */}
        <div className="border rounded-lg p-4 bg-slate-50 space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 line-clamp-2">
                {resume.title}
              </h3>
              {resume.isDraft && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                  Rascunho
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Layout className="h-4 w-4" />
              <span>{getTemplateLabel(resume.template)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="h-4 w-4" />
              <span>{getLanguageLabel(resume.language)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FileText className="h-4 w-4" />
              <span>{getModelLabel(resume.model)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(resume.updatedAt), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Checkbox "Não mostrar novamente" */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="dontShowAgain"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <Label
            htmlFor="dontShowAgain"
            className="text-sm text-slate-600 cursor-pointer select-none"
          >
            Não mostrar esta confirmação novamente
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Excluindo...
              </>
            ) : (
              "Excluir Currículo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
