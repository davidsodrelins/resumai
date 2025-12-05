import { REFERRAL_LEVELS, type ReferralLevel } from "./referralRewards";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/email";

/**
 * Envia notificação quando usuário sobe de nível no programa de indicações
 */
export async function notifyLevelUp(params: {
  userId: number;
  userName: string;
  userEmail: string;
  oldLevel: ReferralLevel;
  newLevel: ReferralLevel;
  totalReferrals: number;
  unlimitedUntil: Date | null;
}) {
  const { userName, userEmail, oldLevel, newLevel, totalReferrals, unlimitedUntil } = params;

  const newLevelConfig = REFERRAL_LEVELS[newLevel];
  
  // Preparar mensagem de benefícios
  let benefits = "";
  if (newLevel === "bronze") {
    benefits = "+2 currículos grátis por cada indicação";
  } else if (newLevel === "silver") {
    benefits = "Currículos ilimitados por 1 mês + Acesso antecipado a novos templates";
  } else if (newLevel === "gold") {
    benefits = "Currículos ilimitados por 3 meses + Consultoria de carreira 1-on-1 (30 min)";
  } else if (newLevel === "platinum") {
    benefits = "Currículos ilimitados PARA SEMPRE + Consultoria mensal + Hall da Fama";
  }

  // Emoji do nível
  const levelEmoji = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "💎",
  }[newLevel];

  // Data de expiração (se aplicável)
  let expirationText = "";
  if (unlimitedUntil && newLevel !== "platinum") {
    const expDate = new Date(unlimitedUntil);
    expirationText = `\n\n⏰ Válido até: ${expDate.toLocaleDateString("pt-BR")}`;
  } else if (newLevel === "platinum") {
    expirationText = "\n\n⏰ Válido: PARA SEMPRE! 🎉";
  }

  // Notificar owner (para monitoramento)
  try {
    await notifyOwner({
      title: `🎉 Usuário subiu para ${newLevelConfig.name}!`,
      content: `${userName} (${userEmail}) atingiu o nível ${levelEmoji} ${newLevelConfig.name} com ${totalReferrals} indicações!`,
    });
  } catch (error) {
    console.error("[LevelUp] Erro ao notificar owner:", error);
  }

  // Enviar email para o usuário
  try {
    await sendEmail({
      to: userEmail,
      subject: `${levelEmoji} Parabéns! Você atingiu o nível ${newLevelConfig.name}!`,
      html: createLevelUpEmailTemplate({
        userName,
        levelEmoji,
        levelName: newLevelConfig.name,
        totalReferrals,
        benefits,
        expirationText,
      }),
    });
    console.log(`[LevelUp] Email enviado com sucesso para ${userEmail}`);
  } catch (error) {
    console.error("[LevelUp] Erro ao enviar email:", error);
  }

  return {
    success: true,
    message: `Notificação de level up enviada para ${userName}`,
  };
}

/**
 * Cria mensagem toast para exibir no frontend quando usuário faz login
 */
export function getLevelUpToastMessage(params: {
  newLevel: ReferralLevel;
  totalReferrals: number;
}): { title: string; description: string } {
  const { newLevel, totalReferrals } = params;
  const levelConfig = REFERRAL_LEVELS[newLevel];

  const levelEmoji = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "💎",
  }[newLevel];

  let benefits = "";
  if (newLevel === "bronze") {
    benefits = "+2 currículos grátis por indicação";
  } else if (newLevel === "silver") {
    benefits = "Currículos ilimitados por 1 mês";
  } else if (newLevel === "gold") {
    benefits = "Currículos ilimitados por 3 meses";
  } else if (newLevel === "platinum") {
    benefits = "Currículos ilimitados PARA SEMPRE";
  }

  return {
    title: `${levelEmoji} Parabéns! Nível ${levelConfig.name}!`,
    description: `Você atingiu ${totalReferrals} indicações e desbloqueou: ${benefits}! 🎉`,
  };
}


/**
 * Cria template HTML de email para notificação de level-up
 */
function createLevelUpEmailTemplate(params: {
  userName: string;
  levelEmoji: string;
  levelName: string;
  totalReferrals: number;
  benefits: string;
  expirationText: string;
}): string {
  const { userName, levelEmoji, levelName, totalReferrals, benefits, expirationText } = params;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parabéns pelo novo nível!</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }
    .emoji {
      font-size: 64px;
      margin: 20px 0;
      display: block;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #555;
      margin-bottom: 20px;
    }
    .achievement {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .achievement h2 {
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .achievement p {
      margin: 5px 0;
      font-size: 16px;
    }
    .benefits {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .benefits h3 {
      margin: 0 0 15px 0;
      color: #667eea;
      font-size: 18px;
    }
    .benefits p {
      margin: 10px 0;
      font-size: 16px;
      color: #555;
    }
    .cta {
      text-align: center;
      margin: 30px 0;
    }
    .cta a {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .cta a:hover {
      transform: translateY(-2px);
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #888;
      font-size: 14px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Parabéns, ${userName}!</h1>
      <span class="emoji">${levelEmoji}</span>
      <p style="font-size: 20px; margin: 10px 0 0 0;">Você atingiu um novo nível!</p>
    </div>
    
    <div class="content">
      <p class="greeting">Olá, ${userName}!</p>
      
      <div class="achievement">
        <h2>Nível ${levelName} Desbloqueado!</h2>
        <p>Você agora tem <strong>${totalReferrals} indicações</strong> confirmadas!</p>
      </div>
      
      <div class="benefits">
        <h3>🎁 Seus Novos Benefícios:</h3>
        <p><strong>${benefits}</strong></p>
        ${expirationText ? `<p style="color: #d97706; font-weight: bold;">${expirationText.replace(/\n/g, '<br>')}</p>` : ''}
      </div>
      
      <p style="font-size: 16px; color: #555; margin: 20px 0;">
        Continue compartilhando seu link de indicação e desbloqueie ainda mais benefícios! 
        Cada pessoa que se cadastrar usando seu link conta como uma nova indicação.
      </p>
      
      <div class="cta">
        <a href="https://resumai.davidsodre.com/indique-e-ganhe">
          Ver Meu Programa de Indicações
        </a>
      </div>
      
      <p style="font-size: 14px; color: #888; margin-top: 30px;">
        Obrigado por fazer parte da comunidade ResumAI! 💙
      </p>
    </div>
    
    <div class="footer">
      <p>ResumAI - Seu Currículo Está a 5 Minutos de Custar Entrevistas</p>
      <p>
        <a href="https://resumai.davidsodre.com">Visitar Site</a> | 
        <a href="https://resumai.davidsodre.com/indique-e-ganhe">Programa de Indicações</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
