import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, X, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Verificar se já mostrou antes (localStorage)
    const alreadyShown = localStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Detectar movimento do mouse saindo da página
    const handleMouseLeave = (e: MouseEvent) => {
      // Se o mouse sair pela parte superior da página
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Gift className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            ⏰ Espera! Antes de Ir...
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Não perca a chance de criar seu currículo profissional GRÁTIS!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Oferta Especial */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🎁 Oferta Especial
            </h3>
            <p className="text-gray-700 mb-4">
              Crie seu primeiro currículo <span className="font-bold text-blue-600">GRÁTIS</span> agora e ganhe:
            </p>
            <ul className="text-left space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>5 currículos grátis por mês</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Otimização ATS automática</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>3 idiomas (PT, EN, ES)</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>Portfolio web gratuito</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              ✨ Sem cartão de crédito • Cancele quando quiser
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-3">
            <Link href="/signup" onClick={handleClose}>
              <Button size="lg" className="w-full text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Sparkles className="mr-2 h-5 w-5" />
                Criar Meu Currículo Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Não, obrigado. Vou continuar procurando emprego sem ajuda.
            </Button>
          </div>

          {/* Prova Social */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              🌟 <span className="font-semibold">15.234+ profissionais</span> já criaram seus currículos
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Avaliação 4.9/5 baseado em 1.234 reviews
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
