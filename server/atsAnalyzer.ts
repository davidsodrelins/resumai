import type { ResumeData } from "../shared/resumeTypes";

export interface ATSScore {
  overall: number; // 0-100
  breakdown: {
    formatting: number; // 0-25
    keywords: number; // 0-25
    actionVerbs: number; // 0-25
    quantification: number; // 0-25
  };
  suggestions: ATSSuggestion[];
}

export interface ATSSuggestion {
  category: "critical" | "important" | "optional";
  title: string;
  description: string;
  section?: string;
  impact: number; // potential score increase
}

// Strong action verbs for resume
const STRONG_ACTION_VERBS = [
  "achieved", "improved", "increased", "reduced", "developed", "created",
  "implemented", "launched", "led", "managed", "optimized", "streamlined",
  "transformed", "delivered", "executed", "generated", "built", "designed",
  "established", "accelerated", "enhanced", "pioneered", "spearheaded",
  "orchestrated", "drove", "initiated", "facilitated", "coordinated"
];

// Weak verbs to avoid
const WEAK_VERBS = [
  "responsible for", "worked on", "helped", "assisted", "participated",
  "involved in", "contributed to", "did", "made", "got", "was", "were"
];

// Standard ATS-friendly section names
const STANDARD_SECTIONS = [
  "experience", "education", "skills", "certifications",
  "languages", "projects", "summary"
];

/**
 * Analyzes a resume for ATS compatibility and returns a score with suggestions
 */
export function analyzeATSCompatibility(resumeData: ResumeData): ATSScore {
  const suggestions: ATSSuggestion[] = [];
  
  // 1. Formatting Score (0-25)
  const formattingScore = analyzeFormatting(resumeData, suggestions);
  
  // 2. Keywords Score (0-25)
  const keywordsScore = analyzeKeywords(resumeData, suggestions);
  
  // 3. Action Verbs Score (0-25)
  const actionVerbsScore = analyzeActionVerbs(resumeData, suggestions);
  
  // 4. Quantification Score (0-25)
  const quantificationScore = analyzeQuantification(resumeData, suggestions);
  
  const overall = formattingScore + keywordsScore + actionVerbsScore + quantificationScore;
  
  return {
    overall: Math.round(overall),
    breakdown: {
      formatting: Math.round(formattingScore),
      keywords: Math.round(keywordsScore),
      actionVerbs: Math.round(actionVerbsScore),
      quantification: Math.round(quantificationScore),
    },
    suggestions: suggestions.sort((a, b) => {
      // Sort by category priority, then by impact
      const categoryPriority = { critical: 0, important: 1, optional: 2 };
      const catDiff = categoryPriority[a.category] - categoryPriority[b.category];
      return catDiff !== 0 ? catDiff : b.impact - a.impact;
    }),
  };
}

function analyzeFormatting(resumeData: ResumeData, suggestions: ATSSuggestion[]): number {
  let score = 25;
  
  // Check for essential sections
  const hasSummary = resumeData.personalInfo?.summary && resumeData.personalInfo.summary.length > 20;
  const hasExperience = resumeData.experience && resumeData.experience.length > 0;
  const hasEducation = resumeData.education && resumeData.education.length > 0;
  const hasSkills = resumeData.skills && resumeData.skills.length > 0;
  
  if (!hasSummary) {
    score -= 5;
    suggestions.push({
      category: "important",
      title: "Adicione um resumo profissional",
      description: "Um resumo no topo do currículo ajuda os sistemas ATS a entender rapidamente seu perfil e objetivos.",
      section: "personalInfo",
      impact: 5,
    });
  }
  
  if (!hasExperience) {
    score -= 10;
    suggestions.push({
      category: "critical",
      title: "Adicione experiências profissionais",
      description: "A seção de experiência é essencial para sistemas ATS. Inclua pelo menos suas posições mais recentes.",
      section: "experience",
      impact: 10,
    });
  }
  
  if (!hasEducation) {
    score -= 5;
    suggestions.push({
      category: "important",
      title: "Adicione formação acadêmica",
      description: "Sistemas ATS procuram por informações educacionais. Inclua pelo menos sua formação principal.",
      section: "education",
      impact: 5,
    });
  }
  
  if (!hasSkills || resumeData.skills.length < 5) {
    score -= 5;
    suggestions.push({
      category: "important",
      title: "Adicione mais habilidades técnicas",
      description: "Liste pelo menos 5-10 habilidades relevantes. Sistemas ATS fazem matching de palavras-chave nesta seção.",
      section: "skills",
      impact: 5,
    });
  }
  
  // Check contact information
  const hasEmail = !!resumeData.personalInfo?.email;
  const hasPhone = !!resumeData.personalInfo?.phone;
  
  if (!hasEmail) {
    score -= 3;
    suggestions.push({
      category: "critical",
      title: "Adicione seu email",
      description: "Email é essencial para contato. Sistemas ATS podem rejeitar currículos sem informações de contato.",
      section: "personalInfo",
      impact: 3,
    });
  }
  
  if (!hasPhone) {
    score -= 2;
    suggestions.push({
      category: "optional",
      title: "Adicione seu telefone",
      description: "Incluir telefone facilita o contato direto por recrutadores.",
      section: "personalInfo",
      impact: 2,
    });
  }
  
  return Math.max(0, score);
}

function analyzeKeywords(resumeData: ResumeData, suggestions: ATSSuggestion[]): number {
  let score = 25;
  
  // Count total keywords across resume
  let totalKeywords = 0;
  
  // Skills are primary keywords
  totalKeywords += resumeData.skills?.length || 0;
  
  // Extract keywords from experience descriptions
  const experienceText = resumeData.experience
    ?.map(exp => `${exp.description} ${exp.achievements?.join(" ") || ""}`)
    .join(" ") || "";
  
  // Simple keyword density check
  const words = experienceText.split(/\s+/).filter(w => w.length > 3);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  totalKeywords += Math.min(uniqueWords.size / 10, 10); // Max 10 points from experience
  
  if (totalKeywords < 10) {
    score -= 15;
    suggestions.push({
      category: "critical",
      title: "Aumente a densidade de palavras-chave",
      description: `Seu currículo tem poucas palavras-chave relevantes (${Math.round(totalKeywords)}). Adicione mais habilidades técnicas e termos específicos da sua área.`,
      section: "skills",
      impact: 15,
    });
  } else if (totalKeywords < 20) {
    score -= 8;
    suggestions.push({
      category: "important",
      title: "Adicione mais palavras-chave relevantes",
      description: "Inclua mais termos técnicos, ferramentas e metodologias relevantes para sua área de atuação.",
      section: "skills",
      impact: 8,
    });
  }
  
  // Check for industry-specific terms
  const hasIndustryTerms = resumeData.skills?.some(skill => 
    skill.length > 2 && !["a", "o", "e"].includes(skill.toLowerCase())
  );
  
  if (!hasIndustryTerms) {
    score -= 5;
    suggestions.push({
      category: "important",
      title: "Inclua termos específicos da indústria",
      description: "Adicione tecnologias, metodologias e ferramentas específicas da sua área profissional.",
      section: "skills",
      impact: 5,
    });
  }
  
  return Math.max(0, score);
}

function analyzeActionVerbs(resumeData: ResumeData, suggestions: ATSSuggestion[]): number {
  let score = 25;
  let weakVerbCount = 0;
  let strongVerbCount = 0;
  
  // Analyze experience descriptions
  resumeData.experience?.forEach((exp, index) => {
    const text = `${exp.description} ${exp.achievements?.join(" ") || ""}`.toLowerCase();
    
    // Check for weak verbs
    WEAK_VERBS.forEach(weakVerb => {
      if (text.includes(weakVerb)) {
        weakVerbCount++;
      }
    });
    
    // Check for strong verbs
    STRONG_ACTION_VERBS.forEach(strongVerb => {
      if (text.includes(strongVerb)) {
        strongVerbCount++;
      }
    });
    
    // Check if description starts with action verb
    const firstWord = exp.description?.trim().split(/\s+/)[0]?.toLowerCase();
    const startsWithWeakVerb = WEAK_VERBS.some(v => firstWord?.includes(v));
    
    if (startsWithWeakVerb) {
      suggestions.push({
        category: "important",
        title: `Melhore descrição da experiência em ${exp.company}`,
        description: `Comece com verbos de ação fortes como "Desenvolvi", "Implementei", "Liderei" ao invés de "${firstWord}".`,
        section: "experience",
        impact: 3,
      });
    }
  });
  
  // Calculate score based on verb usage
  if (weakVerbCount > strongVerbCount) {
    score -= 15;
    suggestions.push({
      category: "critical",
      title: "Substitua verbos fracos por verbos de ação fortes",
      description: `Encontramos ${weakVerbCount} usos de verbos fracos. Use verbos como "Desenvolvi", "Implementei", "Liderei", "Otimizei" para demonstrar impacto.`,
      section: "experience",
      impact: 15,
    });
  } else if (strongVerbCount < 5) {
    score -= 8;
    suggestions.push({
      category: "important",
      title: "Use mais verbos de ação impactantes",
      description: "Adicione mais verbos de ação fortes no início de cada bullet point para destacar suas realizações.",
      section: "experience",
      impact: 8,
    });
  }
  
  return Math.max(0, score);
}

function analyzeQuantification(resumeData: ResumeData, suggestions: ATSSuggestion[]): number {
  let score = 25;
  let quantifiedCount = 0;
  let totalAchievements = 0;
  
  // Check for numbers, percentages, and metrics in experience
  const numberPattern = /\d+[\d,]*\.?\d*\s*(%|percent|million|thousand|k|users|customers|revenue|\$|€|£)/gi;
  
  resumeData.experience?.forEach((exp, index) => {
    const text = `${exp.description} ${exp.achievements?.join(" ") || ""}`;
    const matches = text.match(numberPattern);
    
    if (matches && matches.length > 0) {
      quantifiedCount += matches.length;
    }
    
    totalAchievements += (exp.achievements?.length || 0) + 1; // +1 for description
    
    if (!matches || matches.length === 0) {
      suggestions.push({
        category: "important",
        title: `Quantifique resultados em ${exp.company}`,
        description: "Adicione números, percentuais ou métricas para demonstrar o impacto do seu trabalho (ex: 'Aumentei vendas em 30%', 'Gerenciei equipe de 5 pessoas').",
        section: "experience",
        impact: 5,
      });
    }
  });
  
  // Calculate quantification ratio
  const quantificationRatio = totalAchievements > 0 ? quantifiedCount / totalAchievements : 0;
  
  if (quantificationRatio < 0.3) {
    score -= 15;
    suggestions.push({
      category: "critical",
      title: "Adicione mais métricas e resultados quantificáveis",
      description: `Apenas ${Math.round(quantificationRatio * 100)}% das suas realizações incluem números. Quantifique seus resultados sempre que possível.`,
      section: "experience",
      impact: 15,
    });
  } else if (quantificationRatio < 0.5) {
    score -= 8;
    suggestions.push({
      category: "important",
      title: "Melhore a quantificação de resultados",
      description: "Tente quantificar mais realizações com números, percentuais ou métricas concretas.",
      section: "experience",
      impact: 8,
    });
  }
  
  return Math.max(0, score);
}
