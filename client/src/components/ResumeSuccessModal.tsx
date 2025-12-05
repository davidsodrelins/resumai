import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SocialShareButtons } from "./SocialShareButtons";
import { CheckCircle, Gift, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ResumeSuccessModalProps {
  open: boolean;
  onClose: () => void;
  resumeId?: string;
}

export default function ResumeSuccessModal({
  open,
  onClose,
  resumeId,
}: ResumeSuccessModalProps) {
  const shareTitle = "Acabei de criar meu currículo profissional com IA!";
  const shareDescription = 
    "Criei um currículo otimizado para ATS em apenas 5 minutos com o ResumAI. 🚀 Você também pode criar o seu gratuitamente!";
  const shareUrl = "https://resumai.davidsodre.com";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            🎉 Parabéns! Seu Currículo Está Pronto!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Agora é hora de compartilhar seu sucesso e ajudar seus amigos também!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Incentivo de Compartilhamento */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <Gift className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  🎁 Ganhe +2 Currículos Grátis!
                </p>
                <p className="text-sm text-gray-600">
                  Compartilhe nas redes sociais e ganhe 2 currículos extras para usar quando quiser.
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Compartilhamento */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Compartilhe com seus amigos:
            </p>
            <SocialShareButtons
              title={shareTitle}
              description={shareDescription}
              url={shareUrl}
            />
          </div>

          {/* Mensagens Pré-escritas por Plataforma */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              💬 Sugestões de mensagem:
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <span className="font-semibold">WhatsApp:</span>
                <p className="italic mt-1">
                  "Acabei de criar meu currículo profissional em 5 minutos com IA! 🚀 Experimente: {shareUrl}"
                </p>
              </div>
              <div>
                <span className="font-semibold">LinkedIn:</span>
                <p className="italic mt-1">
                  "Recomendo o ResumAI para quem está procurando emprego. Criei um currículo otimizado para ATS em minutos! #carreira #curriculo"
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Fechar
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full">
                Ver Meus Currículos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
