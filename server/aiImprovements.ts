import { invokeLLM } from "./_core/llm";
import type { ResumeData } from "../shared/resumeTypes";

export interface ImprovementSuggestion {
  id: string;
  type: "action_verb" | "quantification" | "bullet_optimization" | "content_density";
  section: string;
  subsection?: string; // e.g., experience index
  original: string;
  improved: string;
  explanation: string;
  impact: "high" | "medium" | "low";
}

export interface ImprovementAnalysis {
  suggestions: ImprovementSuggestion[];
  summary: {
    totalSuggestions: number;
    highImpact: number;
    mediumImpact: number;
    lowImpact: number;
  };
}

/**
 * Analyzes resume and generates AI-powered improvement suggestions
 */
export async function generateImprovementSuggestions(
  resumeData: ResumeData,
  language: string = "pt"
): Promise<ImprovementAnalysis> {
  const suggestions: ImprovementSuggestion[] = [];
  
  // Prepare resume content for AI analysis
  const resumeContent = prepareResumeForAnalysis(resumeData);
  
  // Generate suggestions via Llama AI
  const aiSuggestions = await analyzeWithAI(resumeContent, language);
  
  // Parse AI response and create structured suggestions
  suggestions.push(...aiSuggestions);
  
  // Calculate summary
  const summary = {
    totalSuggestions: suggestions.length,
    highImpact: suggestions.filter(s => s.impact === "high").length,
    mediumImpact: suggestions.filter(s => s.impact === "medium").length,
    lowImpact: suggestions.filter(s => s.impact === "low").length,
  };
  
  return {
    suggestions,
    summary,
  };
}

function prepareResumeForAnalysis(resumeData: ResumeData): string {
  let content = "";
  
  // Personal Info
  content += `INFORMAÇÕES PESSOAIS:\n`;
  content += `Nome: ${resumeData.personalInfo?.fullName || "N/A"}\n`;
  content += `Resumo: ${resumeData.personalInfo?.summary || "N/A"}\n\n`;
  
  // Experience
  content += `EXPERIÊNCIA PROFISSIONAL:\n`;
  resumeData.experience?.forEach((exp, index) => {
    content += `[EXP-${index}] ${exp.position} na ${exp.company}\n`;
    content += `Descrição: ${exp.description}\n`;
    if (exp.achievements && exp.achievements.length > 0) {
      content += `Realizações:\n`;
      exp.achievements.forEach(achievement => {
        content += `- ${achievement}\n`;
      });
    }
    content += `\n`;
  });
  
  // Education
  content += `EDUCAÇÃO:\n`;
  resumeData.education?.forEach((edu, index) => {
    content += `[EDU-${index}] ${edu.degree} em ${edu.field} - ${edu.institution}\n`;
  });
  content += `\n`;
  
  // Skills
  content += `HABILIDADES:\n`;
  content += resumeData.skills?.join(", ") || "N/A";
  content += `\n\n`;
  
  return content;
}

async function analyzeWithAI(resumeContent: string, language: string): Promise<ImprovementSuggestion[]> {
  const languageInstructions = {
    pt: "em português brasileiro",
    en: "in English",
    es: "en español",
  }[language] || "em português brasileiro";
  
  const prompt = `Você é um especialista em otimização de currículos e recrutamento. Analise o currículo abaixo e forneça sugestões específicas de melhorias ${languageInstructions}.

CURRÍCULO:
${resumeContent}

INSTRUÇÕES:
1. Identifique frases que podem ser melhoradas com verbos de ação mais fortes
2. Encontre oportunidades para quantificar resultados (adicionar números, percentuais, métricas)
3. Sugira otimizações de bullet points (tornar mais concisos e impactantes)
4. Identifique seções com baixa densidade de informação

Para cada sugestão, forneça:
- Tipo: action_verb, quantification, bullet_optimization, ou content_density
- Seção: experience, education, skills, summary
- Texto original
- Texto melhorado
- Explicação breve (máximo 100 caracteres)
- Impacto: high, medium, ou low

Retorne APENAS um JSON válido no formato:
{
  "suggestions": [
    {
      "type": "action_verb",
      "section": "experience",
      "subsection": "0",
      "original": "texto original",
      "improved": "texto melhorado",
      "explanation": "explicação",
      "impact": "high"
    }
  ]
}

Limite-se a 10 sugestões mais impactantes.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a professional resume optimization expert. Always respond with valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "improvement_suggestions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["action_verb", "quantification", "bullet_optimization", "content_density"],
                    },
                    section: {
                      type: "string",
                    },
                    subsection: {
                      type: "string",
                    },
                    original: {
                      type: "string",
                    },
                    improved: {
                      type: "string",
                    },
                    explanation: {
                      type: "string",
                    },
                    impact: {
                      type: "string",
                      enum: ["high", "medium", "low"],
                    },
                  },
                  required: ["type", "section", "original", "improved", "explanation", "impact"],
                  additionalProperties: false,
                },
              },
            },
            required: ["suggestions"],
            additionalProperties: false,
          },
        },
      },
    });

    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error("Empty response from AI");
    }

    const content = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
    const parsed = JSON.parse(content);
    
    // Add unique IDs to suggestions
    return parsed.suggestions.map((s: any, index: number) => ({
      ...s,
      id: `suggestion-${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error("Error generating AI improvements:", error);
    // Return empty suggestions on error
    return [];
  }
}

/**
 * Applies a specific improvement suggestion to the resume data
 */
export function applySuggestion(
  resumeData: ResumeData,
  suggestion: ImprovementSuggestion
): ResumeData {
  const updated = JSON.parse(JSON.stringify(resumeData)); // Deep clone
  
  try {
    if (suggestion.section === "experience" && suggestion.subsection) {
      const expIndex = parseInt(suggestion.subsection);
      if (updated.experience && updated.experience[expIndex]) {
        const exp = updated.experience[expIndex];
        
        // Replace in description
        if (exp.description && exp.description.includes(suggestion.original)) {
          exp.description = exp.description.replace(suggestion.original, suggestion.improved);
        }
        
        // Replace in achievements
        if (exp.achievements) {
          exp.achievements = exp.achievements.map((achievement: string) =>
            achievement.includes(suggestion.original)
              ? achievement.replace(suggestion.original, suggestion.improved)
              : achievement
          );
        }
      }
    } else if (suggestion.section === "summary") {
      if (updated.personalInfo?.summary) {
        updated.personalInfo.summary = updated.personalInfo.summary.replace(
          suggestion.original,
          suggestion.improved
        );
      }
    }
  } catch (error) {
    console.error("Error applying suggestion:", error);
  }
  
  return updated;
}

/**
 * Applies all suggestions to the resume data
 */
export function applyAllSuggestions(
  resumeData: ResumeData,
  suggestions: ImprovementSuggestion[]
): ResumeData {
  let updated = resumeData;
  
  for (const suggestion of suggestions) {
    updated = applySuggestion(updated, suggestion);
  }
  
  return updated;
}
