import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, Home } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { trackDonation } from "@/lib/analytics";
import GlobalNavigation from "@/components/GlobalNavigation";

export default function DonationSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const confirmPaymentMutation = trpc.donation.confirmPayment.useMutation({
    onSuccess: (data) => {
      setConfirmed(true);
      
      // Track donation event (use default amount as we don't have it in response)
      trackDonation(10, "BRL"); // Default tracking value
    },
    onError: (error) => {
      console.error("Error confirming payment:", error);
    },
  });

  useEffect(() => {
    // Get session_id from URL query params
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");

    if (sid) {
      setSessionId(sid);
      // Confirm payment with backend
      confirmPaymentMutation.mutate({ sessionId: sid });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50">
      <GlobalNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-6">
                  <Heart className="h-16 w-16 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Muito Obrigado! 💙
              </h1>
            </div>

            <p className="text-lg text-slate-600 mb-8">
              Sua doação foi processada com sucesso e significa muito para mim e para a Luluzinha!
            </p>

            {/* Thank You Message */}
            <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 mb-8">
              <p className="text-slate-700 leading-relaxed">
                Graças a você, posso continuar mantendo o <strong>ResumAI</strong> gratuito e
                ajudando mais pessoas a conquistarem seus sonhos profissionais. Você é incrível! 🚀
              </p>
            </div>

            {/* Donor Badge Info */}
            {confirmed && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8">
                <p className="text-blue-800 font-medium flex items-center justify-center gap-2">
                  <span className="text-2xl">⭐</span>
                  Você agora é um <strong>Apoiador Oficial</strong> do ResumAI!
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Currículos ilimitados + Badge exclusivo no seu perfil
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation("/")}
                size="lg"
                variant="default"
                className="gap-2"
              >
                <Home className="h-5 w-5" />
                Voltar ao Início
              </Button>
              <Button
                onClick={() => setLocation("/generator")}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                Criar Currículo
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-sm text-slate-500 mt-8">
              Um recibo foi enviado para o seu email. Se tiver qualquer dúvida, entre em contato!
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Compartilhe o ResumAI com seus amigos e ajude mais pessoas! 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
