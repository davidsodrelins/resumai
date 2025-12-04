import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Heart, Sparkles } from "lucide-react";

interface LimitReachedModalProps {
  open: boolean;
  onClose: () => void;
  onDonate: () => void;
  remaining: number;
  limit: number;
}

export function LimitReachedModal({ open, onClose, onDonate, remaining, limit }: LimitReachedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <DialogTitle className="text-xl">Limite Mensal Atingido</DialogTitle>
          </div>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p>
              Você atingiu o limite de <strong>{limit} currículos por mês</strong> do plano gratuito.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Apoie o ResumAI e tenha acesso ilimitado!
                  </h4>
                  <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      <span>✨ Currículos ilimitados para sempre</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      <span>⭐ Badge exclusivo de Apoiador</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      <span>❤️ Ajude a manter a plataforma gratuita para todos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>💡 Dica:</strong> Seu limite será resetado automaticamente no próximo mês. 
                Mas se você quiser continuar criando currículos agora, considere fazer uma doação! 
                Qualquer valor ajuda a manter o ResumAI funcionando. 🙏
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Entendi
          </Button>
          <Button
            onClick={onDonate}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            <Heart className="mr-2 h-4 w-4" />
            Apoiar Projeto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
