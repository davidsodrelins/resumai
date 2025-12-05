/**
 * Achievement System - Defines all available achievements and their unlock conditions
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  category: "resumes" | "referrals" | "donations" | "optimization" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: {
    type: "resume_count" | "referral_count" | "donation_amount" | "ats_score" | "cover_letter_count" | "portfolio_created" | "languages_used" | "resumes_in_day" | "resumes_in_week";
    value: number;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  // Common - Resumes
  {
    id: "first_resume",
    name: "Primeiro Passo",
    description: "Crie seu primeiro currículo",
    icon: "🎯",
    category: "resumes",
    rarity: "common",
    condition: { type: "resume_count", value: 1 },
  },
  {
    id: "resume_collector",
    name: "Colecionador",
    description: "Crie 10 currículos",
    icon: "📚",
    category: "resumes",
    rarity: "common",
    condition: { type: "resume_count", value: 10 },
  },
  {
    id: "resume_master",
    name: "Mestre dos Currículos",
    description: "Crie 50 currículos",
    icon: "👑",
    category: "resumes",
    rarity: "rare",
    condition: { type: "resume_count", value: 50 },
  },
  {
    id: "resume_legend",
    name: "Lenda Viva",
    description: "Crie 100 currículos",
    icon: "🏆",
    category: "resumes",
    rarity: "legendary",
    condition: { type: "resume_count", value: 100 },
  },

  // Languages
  {
    id: "polyglot",
    name: "Poliglota",
    description: "Gere currículos em 3 idiomas diferentes",
    icon: "🌍",
    category: "resumes",
    rarity: "rare",
    condition: { type: "languages_used", value: 3 },
  },

  // Speed
  {
    id: "marathoner",
    name: "Maratonista",
    description: "Crie 5 currículos em 1 dia",
    icon: "⚡",
    category: "special",
    rarity: "epic",
    condition: { type: "resumes_in_day", value: 5 },
  },
  {
    id: "productive_week",
    name: "Semana Produtiva",
    description: "Crie 10 currículos em 7 dias",
    icon: "🔥",
    category: "special",
    rarity: "epic",
    condition: { type: "resumes_in_week", value: 10 },
  },

  // Referrals
  {
    id: "referrer_bronze",
    name: "Indicador Bronze",
    description: "Consiga 1 indicação confirmada",
    icon: "🥉",
    category: "referrals",
    rarity: "common",
    condition: { type: "referral_count", value: 1 },
  },
  {
    id: "referrer_silver",
    name: "Indicador Prata",
    description: "Consiga 5 indicações confirmadas",
    icon: "🥈",
    category: "referrals",
    rarity: "rare",
    condition: { type: "referral_count", value: 5 },
  },
  {
    id: "referrer_gold",
    name: "Indicador Ouro",
    description: "Consiga 10 indicações confirmadas",
    icon: "🥇",
    category: "referrals",
    rarity: "epic",
    condition: { type: "referral_count", value: 10 },
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "Consiga 20 indicações confirmadas",
    icon: "💎",
    category: "referrals",
    rarity: "legendary",
    condition: { type: "referral_count", value: 20 },
  },

  // Donations
  {
    id: "supporter",
    name: "Apoiador",
    description: "Faça sua primeira doação",
    icon: "⭐",
    category: "donations",
    rarity: "rare",
    condition: { type: "donation_amount", value: 1 }, // Qualquer valor > 0
  },
  {
    id: "generous",
    name: "Generoso",
    description: "Doe mais de R$ 50",
    icon: "💝",
    category: "donations",
    rarity: "epic",
    condition: { type: "donation_amount", value: 5000 }, // R$ 50 em centavos
  },
  {
    id: "philanthropist",
    name: "Filantropo",
    description: "Doe mais de R$ 100",
    icon: "🌟",
    category: "donations",
    rarity: "legendary",
    condition: { type: "donation_amount", value: 10000 }, // R$ 100 em centavos
  },

  // ATS Optimization
  {
    id: "optimizer",
    name: "Otimizador",
    description: "Atinja 90+ no ATS Score",
    icon: "📈",
    category: "optimization",
    rarity: "rare",
    condition: { type: "ats_score", value: 90 },
  },
  {
    id: "perfectionist",
    name: "Perfeição",
    description: "Atinja 100 no ATS Score",
    icon: "💯",
    category: "optimization",
    rarity: "legendary",
    condition: { type: "ats_score", value: 100 },
  },

  // Cover Letters
  {
    id: "writer",
    name: "Escritor",
    description: "Gere 5 cartas de apresentação",
    icon: "✍️",
    category: "resumes",
    rarity: "common",
    condition: { type: "cover_letter_count", value: 5 },
  },
  {
    id: "author",
    name: "Autor",
    description: "Gere 20 cartas de apresentação",
    icon: "📝",
    category: "resumes",
    rarity: "rare",
    condition: { type: "cover_letter_count", value: 20 },
  },

  // Portfolio
  {
    id: "web_developer",
    name: "Web Developer",
    description: "Crie seu primeiro portfolio web",
    icon: "🌐",
    category: "special",
    rarity: "rare",
    condition: { type: "portfolio_created", value: 1 },
  },
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Get all achievements by category
 */
export function getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * Get all achievements by rarity
 */
export function getAchievementsByRarity(rarity: Achievement["rarity"]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.rarity === rarity);
}

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity: Achievement["rarity"]): string {
  const colors = {
    common: "#94a3b8", // slate-400
    rare: "#3b82f6", // blue-500
    epic: "#a855f7", // purple-500
    legendary: "#f59e0b", // amber-500
  };
  return colors[rarity];
}

/**
 * Get rarity label in Portuguese
 */
export function getRarityLabel(rarity: Achievement["rarity"]): string {
  const labels = {
    common: "Comum",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
  };
  return labels[rarity];
}

/**
 * Get category label in Portuguese
 */
export function getCategoryLabel(category: Achievement["category"]): string {
  const labels = {
    resumes: "Currículos",
    referrals: "Indicações",
    donations: "Doações",
    optimization: "Otimização",
    special: "Especial",
  };
  return labels[category];
}
