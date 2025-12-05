import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { Link } from "wouter";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Verificar se usuário já fechou antes
    const wasClosed = sessionStorage.getItem("floatingCTAClosed");
    if (wasClosed) {
      setIsClosed(true);
      return;
    }

    // Mostrar após 3 segundos de scroll
    const handleScroll = () => {
      if (window.scrollY > 300 && !isClosed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClosed]);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true);
    sessionStorage.setItem("floatingCTAClosed", "true");
  };

  if (!isVisible || isClosed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="relative">
        {/* Botão de Fechar */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg z-10"
          aria-label="Fechar"
        >
          <X className="h-3 w-3" />
        </button>

        {/* CTA Principal */}
        <Link href="/signup">
          <Button
            size="lg"
            className="shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-6 text-base font-semibold animate-pulse"
          >
            <Sparkles className="mr-2 h-5 w-5 animate-spin-slow" />
            Criar Currículo Grátis
          </Button>
        </Link>

        {/* Badge de Prova Social */}
        <div className="absolute -top-3 -left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          🔥 Grátis
        </div>
      </div>
    </div>
  );
}
