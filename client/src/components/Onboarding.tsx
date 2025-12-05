import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function Onboarding() {
  useEffect(() => {
    // Verificar se é a primeira visita
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    
    if (!hasSeenOnboarding) {
      // Aguardar 1 segundo para garantir que a página carregou
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const startOnboarding = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          popover: {
            title: "👋 Bem-vindo ao ResumAI!",
            description: "Vamos fazer um tour rápido para você conhecer as principais funcionalidades. Leva apenas 1 minuto!",
          },
        },
        {
          element: "[data-tour='create-resume']",
          popover: {
            title: "🚀 Criar Currículo",
            description: "Comece aqui! Clique para criar seu primeiro currículo profissional otimizado com IA em apenas 5 minutos.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='dashboard']",
          popover: {
            title: "📊 Dashboard",
            description: "Veja suas estatísticas, currículos criados este mês e acesse rapidamente suas criações.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='history']",
          popover: {
            title: "📁 Histórico",
            description: "Todos os seus currículos ficam salvos aqui. Você pode editar, duplicar ou comparar versões a qualquer momento.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='referral']",
          popover: {
            title: "🎁 Indique e Ganhe",
            description: "Indique amigos e ganhe recompensas! Quanto mais indicações, mais benefícios você desbloqueia (até currículos ilimitados PARA SEMPRE!).",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='blog']",
          popover: {
            title: "📝 Blog",
            description: "Dicas de carreira, como otimizar seu currículo e se destacar no mercado de trabalho.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='profile']",
          popover: {
            title: "👤 Perfil",
            description: "Gerencie sua conta, veja seu plano atual e configure suas preferências.",
            side: "left",
            align: "start",
          },
        },
        {
          popover: {
            title: "✅ Pronto para Começar!",
            description: "Agora você está pronto para criar currículos incríveis! Clique em 'Criar Currículo' para começar. Boa sorte! 🚀",
          },
        },
      ],
      onDestroyStarted: () => {
        // Marcar como visto quando o tour for fechado
        localStorage.setItem("hasSeenOnboarding", "true");
        driverObj.destroy();
      },
    });

    driverObj.drive();
  };

  // Permitir reiniciar o tour manualmente
  (window as any).startOnboarding = startOnboarding;

  return null;
}
