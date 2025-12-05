import { getDb } from "./db";
import { users, referrals } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Níveis de recompensa e seus benefícios
 */
export const REFERRAL_LEVELS = {
  bronze: {
    name: "Bronze",
    minReferrals: 1,
    maxReferrals: 4,
    bonusPerReferral: 2, // +2 currículos por indicação
    unlimitedMonths: 0,
  },
  silver: {
    name: "Prata",
    minReferrals: 5,
    maxReferrals: 9,
    bonusPerReferral: 0,
    unlimitedMonths: 1, // 1 mês ilimitado
  },
  gold: {
    name: "Ouro",
    minReferrals: 10,
    maxReferrals: 19,
    bonusPerReferral: 0,
    unlimitedMonths: 3, // 3 meses ilimitados
  },
  platinum: {
    name: "Platina",
    minReferrals: 20,
    maxReferrals: Infinity,
    bonusPerReferral: 0,
    unlimitedMonths: Infinity, // Ilimitado PARA SEMPRE
  },
} as const;

export type ReferralLevel = keyof typeof REFERRAL_LEVELS;

/**
 * Calcula o nível baseado no número de indicações
 */
export function calculateLevel(totalReferrals: number): ReferralLevel {
  if (totalReferrals >= REFERRAL_LEVELS.platinum.minReferrals) return "platinum";
  if (totalReferrals >= REFERRAL_LEVELS.gold.minReferrals) return "gold";
  if (totalReferrals >= REFERRAL_LEVELS.silver.minReferrals) return "silver";
  return "bronze";
}

/**
 * Processa recompensa quando uma indicação é convertida
 */
export async function processReferralReward(referrerId: number, referredId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // 1. Buscar dados do referrer
  const [referrer] = await db.select().from(users).where(eq(users.id, referrerId));
  if (!referrer) throw new Error("Referrer not found");

  // 2. Incrementar total de indicações
  const newTotalReferrals = referrer.totalReferrals + 1;
  
  // 3. Calcular novo nível
  const oldLevel = referrer.referralLevel;
  const newLevel = calculateLevel(newTotalReferrals);
  
  // 4. Calcular recompensas
  let bonusResumes = referrer.bonusResumes;
  let unlimitedUntil = referrer.unlimitedUntil;

  // Se ainda está no Bronze, adiciona currículos bônus
  if (newLevel === "bronze") {
    bonusResumes += REFERRAL_LEVELS.bronze.bonusPerReferral;
  }

  // Se subiu de nível, concede acesso ilimitado
  if (newLevel !== oldLevel) {
    const levelConfig = REFERRAL_LEVELS[newLevel];
    
    if (levelConfig.unlimitedMonths === Infinity) {
      // Platina: ilimitado para sempre (data muito no futuro)
      unlimitedUntil = new Date("2099-12-31");
    } else if (levelConfig.unlimitedMonths > 0) {
      // Silver/Gold: adiciona meses
      const now = new Date();
      const expirationDate = new Date(now);
      expirationDate.setMonth(expirationDate.getMonth() + levelConfig.unlimitedMonths);
      unlimitedUntil = expirationDate;
    }
  }

  // 5. Atualizar usuário
  await db
    .update(users)
    .set({
      totalReferrals: newTotalReferrals,
      referralLevel: newLevel,
      bonusResumes,
      unlimitedUntil,
    })
    .where(eq(users.id, referrerId));

  // 6. Marcar indicação como recompensada
  await db
    .update(referrals)
    .set({
      status: "rewarded",
      rewardedAt: new Date(),
      rewardCredits: newLevel === "bronze" ? REFERRAL_LEVELS.bronze.bonusPerReferral : 0,
    })
    .where(and(
      eq(referrals.referrerId, referrerId),
      eq(referrals.referredId, referredId)
    ));

  return {
    oldLevel,
    newLevel,
    levelUp: newLevel !== oldLevel,
    bonusResumes,
    unlimitedUntil,
  };
}

/**
 * Verifica se usuário tem acesso ilimitado
 */
export function hasUnlimitedAccess(user: { unlimitedUntil: Date | null }): boolean {
  if (!user.unlimitedUntil) return false;
  return new Date() < user.unlimitedUntil;
}

/**
 * Calcula currículos disponíveis considerando bônus e acesso ilimitado
 */
export function calculateAvailableResumes(user: {
  resumesThisMonth: number;
  bonusResumes: number;
  unlimitedUntil: Date | null;
}): number | "unlimited" {
  // Se tem acesso ilimitado ativo
  if (hasUnlimitedAccess(user)) {
    return "unlimited";
  }

  // Limite base: 5 currículos/mês
  const baseLimit = 5;
  const used = user.resumesThisMonth;
  const available = Math.max(0, baseLimit - used) + user.bonusResumes;

  return available;
}
