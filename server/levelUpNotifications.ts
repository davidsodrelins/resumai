import { REFERRAL_LEVELS, type ReferralLevel } from "./referralRewards";
import { notifyOwner } from "./_core/notification";

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

  // TODO: Enviar email para o usuário
  // Implementar quando tiver sistema de email configurado
  console.log(`[LevelUp] Email seria enviado para ${userEmail}:`);
  console.log(`Assunto: ${levelEmoji} Parabéns! Você atingiu o nível ${newLevelConfig.name}!`);
  console.log(`Corpo: Você agora tem ${totalReferrals} indicações e desbloqueou: ${benefits}${expirationText}`);

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
