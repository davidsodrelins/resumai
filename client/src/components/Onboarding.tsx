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
      nextBtnText: "Próximo →",
      prevBtnText: "← Anterior",
      doneBtnText: "Concluir ✓",
      steps: [
        {
          popover: {
            title: "👋 Bem-vindo ao ResumAI!",
            description: "Olá! Estamos muito felizes em ter você aqui. Vamos fazer um tour guiado rápido (apenas 1 minuto) para você conhecer as principais funcionalidades e começar a criar currículos incríveis! 🚀",
          },
        },
        {
          element: "[data-tour='create-resume']",
          popover: {
            title: "✨ 1. Criar Seu Currículo",
            description: "Este é o botão mais importante! Clique aqui para começar a criar um currículo profissional. Nossa IA vai te guiar passo a passo: basta preencher suas informações e escolher um template. Em 5 minutos, seu currículo estará pronto! 🎯",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='dashboard']",
          popover: {
            title: "🏠 2. Seu Dashboard",
            description: "Este é seu painel de controle pessoal! Aqui você encontra: estatísticas de uso (quantos currículos criou este mês), atalhos rápidos para funcionalidades, e um resumo do seu progresso. É sua página inicial após fazer login. 📊",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='history']",
          popover: {
            title: "📚 3. Histórico de Currículos",
            description: "Todos os currículos que você criar ficam salvos aqui! Você pode: visualizar currículos anteriores, editar e atualizar informações, baixar novamente em PDF/DOCX, ou excluir os que não precisa mais. Nunca perca seu trabalho! 💾",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='referral']",
          popover: {
            title: "🎁 4. Programa Indique e Ganhe",
            description: "Aqui está a mágica! 🎯 Indique amigos e ganhe recompensas incríveis:\n\n🥉 Bronze (1-4): +2 currículos por indicação\n🥈 Prata (5-9): Currículos ilimitados por 1 mês\n🥇 Ouro (10-19): Ilimitados por 3 meses\n💎 Platina (20+): Ilimitados PARA SEMPRE!\n\nCompartilhe seu link e comece a ganhar agora! 🚀",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='blog']",
          popover: {
            title: "📝 5. Blog de Carreira",
            description: "Nosso blog está cheio de conteúdo valioso para sua carreira! Encontre: dicas para melhorar seu currículo, estratégias para entrevistas de emprego, tendências do mercado de trabalho, e guias completos de carreira. Conhecimento é poder! 💡",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='profile']",
          popover: {
            title: "👤 6. Seu Perfil",
            description: "Clique no seu avatar para acessar opções da conta: editar nome, email e senha, gerenciar preferências, ver seu plano atual e limites, e fazer logout quando terminar. Mantenha seus dados sempre atualizados! ⚙️",
            side: "bottom",
            align: "start",
          },
        },
        {
          popover: {
            title: "✅ Tudo Pronto!",
            description: "Parabéns! Você concluiu o tour guiado. 🎉\n\nAgora você já sabe:\n✓ Como criar currículos profissionais\n✓ Onde encontrar seus currículos salvos\n✓ Como ganhar currículos grátis indicando amigos\n✓ Onde buscar dicas de carreira\n\nEstá pronto para começar? Clique em 'Criar Currículo' e faça seu primeiro currículo agora! Boa sorte na sua jornada profissional! 💼✨",
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
