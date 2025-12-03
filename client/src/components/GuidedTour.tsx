import { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface GuidedTourProps {
  run?: boolean;
  onFinish?: () => void;
}

export default function GuidedTour({ run = false, onFinish }: GuidedTourProps) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    
    if (!hasSeenTour && run) {
      // Wait a bit before starting the tour
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [run]);

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Bem-vindo ao Gerador de Currículos IA! 🎉</h3>
          <p>Vamos fazer um tour rápido pelas principais funcionalidades da plataforma.</p>
        </div>
      ),
      placement: "center",
    },
    {
      target: '[href="/generator"]',
      content: (
        <div>
          <h4 className="font-bold mb-2">1. Criar Currículo</h4>
          <p>Comece aqui! Faça upload do seu currículo atual ou cole o link do seu LinkedIn para gerar um novo currículo profissional.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[href="/resources"]',
      content: (
        <div>
          <h4 className="font-bold mb-2">2. Recursos</h4>
          <p>Explore todas as funcionalidades disponíveis: análise ATS, gerador de cartas, portfolio web e muito mais!</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[href="/dashboard"]',
      content: (
        <div>
          <h4 className="font-bold mb-2">3. Dashboard</h4>
          <p>Acompanhe suas estatísticas: total de currículos, score ATS médio, templates favoritos e atividade recente.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "body",
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Pronto para começar! 🚀</h3>
          <p className="mb-3">Agora você conhece os principais recursos da plataforma.</p>
          <p className="text-sm text-slate-600">Dica: Você pode refazer este tour a qualquer momento clicando em "Ajuda" no menu.</p>
        </div>
      ),
      placement: "center",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem("hasSeenTour", "true");
      onFinish?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#3b82f6",
          textColor: "#1e293b",
          backgroundColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          arrowColor: "#ffffff",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: "#3b82f6",
          borderRadius: 6,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#64748b",
          marginRight: 10,
        },
        buttonSkip: {
          color: "#64748b",
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular",
      }}
    />
  );
}
