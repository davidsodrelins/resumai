import { invokeLLM } from "./_core/llm";
import type { ResumeData } from "../shared/resumeTypes";

export interface SoftSkill {
  name: string;
  category: "communication" | "leadership" | "teamwork" | "problem_solving" | "adaptability" | "time_management" | "creativity" | "emotional_intelligence";
  importance: "high" | "medium" | "low";
  present: boolean;
}

export interface SoftSkillSuggestion {
  skill: string;
  category: string;
  importance: "high" | "medium" | "low";
  reason: string;
  example: string; // Exemplo contextualizado de como demonstrar a skill
  suggestedSection: "summary" | "experience" | "custom";
  insertionText: string; // Texto pronto para inserir no currículo
}

export interface SoftSkillsAnalysis {
  detectedSkills: SoftSkill[];
  suggestedSkills: SoftSkillSuggestion[];
  summary: {
    totalDetected: number;
    totalSuggested: number;
    coverageScore: number; // 0-100
  };
}

// Banco de dados de soft skills por cargo/área
const SOFT_SKILLS_BY_ROLE: Record<string, string[]> = {
  developer: [
    "Problem Solving",
    "Analytical Thinking",
    "Attention to Detail",
    "Collaboration",
    "Continuous Learning",
    "Time Management",
    "Adaptability",
    "Communication"
  ],
  manager: [
    "Leadership",
    "Strategic Thinking",
    "Decision Making",
    "Team Building",
    "Conflict Resolution",
    "Delegation",
    "Motivation",
    "Communication"
  ],
  designer: [
    "Creativity",
    "Visual Communication",
    "Attention to Detail",
    "Empathy",
    "Collaboration",
    "Time Management",
    "Adaptability",
    "Problem Solving"
  ],
  sales: [
    "Persuasion",
    "Negotiation",
    "Active Listening",
    "Relationship Building",
    "Resilience",
    "Goal Orientation",
    "Adaptability",
    "Communication"
  ],
  marketing: [
    "Creativity",
    "Strategic Thinking",
    "Data Analysis",
    "Communication",
    "Project Management",
    "Adaptability",
    "Collaboration",
    "Innovation"
  ]
};

// Mapeamento de soft skills comuns
const COMMON_SOFT_SKILLS = [
  "Communication", "Leadership", "Teamwork", "Problem Solving",
  "Adaptability", "Time Management", "Creativity", "Critical Thinking",
  "Emotional Intelligence", "Conflict Resolution", "Decision Making",
  "Attention to Detail", "Organization", "Flexibility", "Initiative",
  "Collaboration", "Negotiation", "Active Listening", "Empathy",
  "Resilience", "Self-Motivation", "Strategic Thinking", "Innovation"
];

function detectSoftSkillsInText(text: string): string[] {
  const detected: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of COMMON_SOFT_SKILLS) {
    const lowerSkill = skill.toLowerCase();
    if (lowerText.includes(lowerSkill)) {
      detected.push(skill);
    }
  }
  
  return detected;
}

function inferRoleFromResume(resumeData: ResumeData): string {
  const recentPosition = resumeData.experience?.[0]?.position?.toLowerCase() || "";
  const summary = resumeData.personalInfo?.summary?.toLowerCase() || "";
  const recentExp = resumeData.experience?.[0]?.position?.toLowerCase() || "";
  
  const combinedText = `${recentPosition} ${summary} ${recentExp}`;
  
  if (combinedText.includes("develop") || combinedText.includes("engineer") || combinedText.includes("program")) {
    return "developer";
  } else if (combinedText.includes("manager") || combinedText.includes("director") || combinedText.includes("lead")) {
    return "manager";
  } else if (combinedText.includes("design") || combinedText.includes("ux") || combinedText.includes("ui")) {
    return "designer";
  } else if (combinedText.includes("sales") || combinedText.includes("account")) {
    return "sales";
  } else if (combinedText.includes("market")) {
    return "marketing";
  }
  
  return "developer"; // default
}

export async function analyzeSoftSkills(
  resumeData: ResumeData,
  targetRole?: string,
  language: string = "pt"
): Promise<SoftSkillsAnalysis> {
  // Detectar soft skills presentes no currículo
  const resumeText = JSON.stringify(resumeData);
  const detectedSkillNames = detectSoftSkillsInText(resumeText);
  
  const detectedSkills: SoftSkill[] = detectedSkillNames.map(name => ({
    name,
    category: categorizeSoftSkill(name),
    importance: "medium",
    present: true
  }));
  
  // Inferir cargo se não fornecido
  const role = targetRole || inferRoleFromResume(resumeData);
  const relevantSkills = SOFT_SKILLS_BY_ROLE[role] || SOFT_SKILLS_BY_ROLE.developer;
  
  // Identificar soft skills ausentes mas relevantes
  const missingSkills = relevantSkills.filter(
    skill => !detectedSkillNames.includes(skill)
  );
  
  // Gerar sugestões contextualizadas com IA
  const suggestedSkills: SoftSkillSuggestion[] = [];
  
  for (const skill of missingSkills.slice(0, 5)) { // Limitar a 5 sugestões
    try {
      const suggestion = await generateSoftSkillSuggestion(resumeData, skill, language);
      suggestedSkills.push(suggestion);
    } catch (error) {
      console.error(`Error generating suggestion for ${skill}:`, error);
    }
  }
  
  const coverageScore = Math.round((detectedSkillNames.length / relevantSkills.length) * 100);
  
  return {
    detectedSkills,
    suggestedSkills,
    summary: {
      totalDetected: detectedSkills.length,
      totalSuggested: suggestedSkills.length,
      coverageScore
    }
  };
}

function categorizeSoftSkill(skillName: string): SoftSkill["category"] {
  const lower = skillName.toLowerCase();
  
  if (lower.includes("communicat") || lower.includes("listen")) return "communication";
  if (lower.includes("lead") || lower.includes("manag")) return "leadership";
  if (lower.includes("team") || lower.includes("collaborat")) return "teamwork";
  if (lower.includes("problem") || lower.includes("critical")) return "problem_solving";
  if (lower.includes("adapt") || lower.includes("flexib")) return "adaptability";
  if (lower.includes("time") || lower.includes("organiz")) return "time_management";
  if (lower.includes("creativ") || lower.includes("innovat")) return "creativity";
  if (lower.includes("emotion") || lower.includes("empathy")) return "emotional_intelligence";
  
  return "problem_solving"; // default
}

async function generateSoftSkillSuggestion(
  resumeData: ResumeData,
  skill: string,
  language: string
): Promise<SoftSkillSuggestion> {
  const prompts = {
    pt: `Você é um especialista em desenvolvimento de currículos profissionais.

Analise o currículo abaixo e crie uma sugestão de como adicionar a soft skill "${skill}" de forma autêntica e contextualizada.

**Currículo Atual:**
Nome: ${resumeData.personalInfo?.fullName || ""}
Cargo Atual: ${resumeData.experience?.[0]?.position || ""}
Resumo: ${resumeData.personalInfo?.summary || ""}

Experiências Recentes:
${resumeData.experience?.slice(0, 2).map(exp => `
- ${exp.position} em ${exp.company}
  ${exp.description || ""}
`).join("\n") || "Nenhuma experiência"}

**Tarefa:**
1. Explique por que a soft skill "${skill}" é importante para este perfil profissional
2. Crie um exemplo concreto e contextualizado de como o profissional pode ter demonstrado essa skill
3. Forneça um texto pronto para inserir no currículo (1-2 frases)

Retorne APENAS um JSON válido no formato:
{
  "reason": "explicação de 1-2 frases",
  "example": "exemplo contextualizado de 2-3 frases",
  "insertionText": "texto pronto para inserir (1-2 frases)",
  "suggestedSection": "summary" ou "experience"
}`,
    en: `You are an expert in professional resume development.

Analyze the resume below and create a suggestion on how to add the soft skill "${skill}" in an authentic and contextualized way.

**Current Resume:**
Name: ${resumeData.personalInfo?.fullName || ""}
Current Title: ${resumeData.experience?.[0]?.position || ""}
Summary: ${resumeData.personalInfo?.summary || ""}

Recent Experiences:
${resumeData.experience?.slice(0, 2).map(exp => `
- ${exp.position} at ${exp.company}
  ${exp.description || ""}
`).join("\n") || "No experience"}

**Task:**
1. Explain why the soft skill "${skill}" is important for this professional profile
2. Create a concrete and contextualized example of how the professional may have demonstrated this skill
3. Provide ready-to-insert text for the resume (1-2 sentences)

Return ONLY a valid JSON in the format:
{
  "reason": "1-2 sentence explanation",
  "example": "2-3 sentence contextualized example",
  "insertionText": "ready-to-insert text (1-2 sentences)",
  "suggestedSection": "summary" or "experience"
}`,
    es: `Eres un experto en desarrollo de currículos profesionales.

Analiza el currículum a continuación y crea una sugerencia sobre cómo agregar la soft skill "${skill}" de forma auténtica y contextualizada.

**Currículum Actual:**
Nombre: ${resumeData.personalInfo?.fullName || ""}
Cargo Actual: ${resumeData.experience?.[0]?.position || ""}
Resumen: ${resumeData.personalInfo?.summary || ""}

Experiencias Recientes:
${resumeData.experience?.slice(0, 2).map(exp => `
- ${exp.position} en ${exp.company}
  ${exp.description || ""}
`).join("\n") || "Sin experiencia"}

**Tarea:**
1. Explica por qué la soft skill "${skill}" es importante para este perfil profesional
2. Crea un ejemplo concreto y contextualizado de cómo el profesional puede haber demostrado esta habilidad
3. Proporciona un texto listo para insertar en el currículum (1-2 frases)

Devuelve SOLO un JSON válido en el formato:
{
  "reason": "explicación de 1-2 frases",
  "example": "ejemplo contextualizado de 2-3 frases",
  "insertionText": "texto listo para insertar (1-2 frases)",
  "suggestedSection": "summary" o "experience"
}`
  };
  
  const prompt = prompts[language as keyof typeof prompts] || prompts.pt;
  
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "You are a professional resume expert. Always respond with valid JSON only."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });
  
  const content = response.choices[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Failed to generate soft skill suggestion");
  }
  
  // Remove markdown code blocks if present
  let cleanContent = content.trim();
  if (cleanContent.startsWith("```json")) {
    cleanContent = cleanContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (cleanContent.startsWith("```")) {
    cleanContent = cleanContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }
  
  const parsed = JSON.parse(cleanContent.trim());
  
  return {
    skill,
    category: categorizeSoftSkill(skill),
    importance: "high",
    reason: parsed.reason,
    example: parsed.example,
    insertionText: parsed.insertionText,
    suggestedSection: parsed.suggestedSection || "summary"
  };
}
