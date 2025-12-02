import { Cloud, CloudOff, Loader2, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

export function AutoSaveIndicator({ isSaving, lastSaved, error }: AutoSaveIndicatorProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <CloudOff className="w-4 h-4" />
        <span>Erro ao salvar</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Salvando...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Check className="w-4 h-4 text-green-600" />
        <span>
          Salvo {formatDistanceToNow(lastSaved, { addSuffix: true, locale: ptBR })}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Cloud className="w-4 h-4" />
      <span>Não salvo</span>
    </div>
  );
}
