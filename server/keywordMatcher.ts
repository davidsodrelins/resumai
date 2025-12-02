import type { ResumeData } from "../shared/resumeTypes";

export interface KeywordMatch {
  keyword: string;
  present: boolean;
  locations: string[]; // Where the keyword was found
  importance: "high" | "medium" | "low";
}

export interface KeywordAnalysis {
  matchPercentage: number; // 0-100
  totalKeywords: number;
  matchedKeywords: number;
  missingKeywords: number;
  keywords: KeywordMatch[];
  suggestions: KeywordSuggestion[];
}

export interface KeywordSuggestion {
  keyword: string;
  section: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

/**
 * Extracts keywords from a job description
 */
export function extractJobKeywords(jobDescription: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
    "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
    "to", "was", "will", "with", "you", "your", "our", "we", "have",
    "this", "can", "should", "must", "may", "would", "could", "been",
    "e", "o", "a", "os", "as", "um", "uma", "de", "do", "da", "dos",
    "das", "em", "no", "na", "nos", "nas", "por", "para", "com", "sem",
    "sobre", "entre", "até", "desde", "durante", "através", "mediante"
  ]);
  
  // Extract words and phrases
  const words = jobDescription
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ") // Remove punctuation except hyphens
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Count word frequency
  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  // Extract multi-word phrases (bigrams and trigrams)
  const phrases: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
      phrases.push(bigram);
    }
    
    if (i < words.length - 2) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1]) && !stopWords.has(words[i + 2])) {
        phrases.push(trigram);
      }
    }
  }
  
  // Combine single words and phrases
  const uniqueKeywords = new Set([...words, ...phrases]);
  const allKeywords = Array.from(uniqueKeywords);
  
  // Sort by frequency and relevance (longer phrases first, then by frequency)
  return allKeywords
    .sort((a, b) => {
      const aFreq = frequency.get(a.split(" ")[0]) || 0;
      const bFreq = frequency.get(b.split(" ")[0]) || 0;
      const aWords = a.split(" ").length;
      const bWords = b.split(" ").length;
      
      // Prefer multi-word phrases
      if (aWords !== bWords) {
        return bWords - aWords;
      }
      
      // Then sort by frequency
      return bFreq - aFreq;
    })
    .slice(0, 50); // Limit to top 50 keywords
}

/**
 * Analyzes how well a resume matches job keywords
 */
export function analyzeKeywordMatch(
  resumeData: ResumeData,
  jobDescription: string
): KeywordAnalysis {
  // Extract keywords from job description
  const jobKeywords = extractJobKeywords(jobDescription);
  
  // Extract all text from resume
  const resumeText = extractResumeText(resumeData).toLowerCase();
  
  // Analyze each keyword
  const keywords: KeywordMatch[] = jobKeywords.map(keyword => {
    const present = resumeText.includes(keyword.toLowerCase());
    const locations: string[] = [];
    
    if (present) {
      // Find where the keyword appears
      if (resumeData.personalInfo?.summary?.toLowerCase().includes(keyword)) {
        locations.push("Resumo Profissional");
      }
      
      resumeData.experience?.forEach((exp, index) => {
        const expText = `${exp.position} ${exp.description} ${exp.achievements?.join(" ") || ""}`.toLowerCase();
        if (expText.includes(keyword)) {
          locations.push(`Experiência: ${exp.company}`);
        }
      });
      
      if (resumeData.skills?.some(skill => skill.toLowerCase().includes(keyword))) {
        locations.push("Habilidades");
      }
      
      resumeData.education?.forEach((edu, index) => {
        const eduText = `${edu.degree} ${edu.field} ${edu.institution}`.toLowerCase();
        if (eduText.includes(keyword)) {
          locations.push(`Educação: ${edu.institution}`);
        }
      });
    }
    
    // Determine importance based on frequency in job description
    const importance = determineKeywordImportance(keyword, jobDescription);
    
    return {
      keyword,
      present,
      locations,
      importance,
    };
  });
  
  // Calculate statistics
  const matchedKeywords = keywords.filter(k => k.present).length;
  const missingKeywords = keywords.filter(k => !k.present).length;
  const matchPercentage = jobKeywords.length > 0 
    ? Math.round((matchedKeywords / jobKeywords.length) * 100) 
    : 0;
  
  // Generate suggestions for missing keywords
  const suggestions = generateKeywordSuggestions(keywords, resumeData);
  
  return {
    matchPercentage,
    totalKeywords: jobKeywords.length,
    matchedKeywords,
    missingKeywords,
    keywords,
    suggestions,
  };
}

function extractResumeText(resumeData: ResumeData): string {
  let text = "";
  
  // Personal info
  text += `${resumeData.personalInfo?.fullName || ""} `;
  text += `${resumeData.personalInfo?.summary || ""} `;
  
  // Experience
  resumeData.experience?.forEach(exp => {
    text += `${exp.position} ${exp.company} ${exp.description} `;
    text += `${exp.achievements?.join(" ") || ""} `;
  });
  
  // Education
  resumeData.education?.forEach(edu => {
    text += `${edu.degree} ${edu.field} ${edu.institution} `;
  });
  
  // Skills
  text += `${resumeData.skills?.join(" ") || ""} `;
  
  // Languages
  resumeData.languages?.forEach(lang => {
    text += `${lang.name} ${lang.proficiency} `;
  });
  
  // Certifications
  resumeData.certifications?.forEach(cert => {
    text += `${cert.name} ${cert.issuer} `;
  });
  
  // Projects
  resumeData.projects?.forEach(proj => {
    text += `${proj.name} ${proj.description} `;
  });
  
  return text;
}

function determineKeywordImportance(keyword: string, jobDescription: string): "high" | "medium" | "low" {
  const lowerDesc = jobDescription.toLowerCase();
  const occurrences = (lowerDesc.match(new RegExp(keyword.toLowerCase(), "g")) || []).length;
  
  // Check if keyword appears in important sections
  const importantSections = [
    "required", "must have", "essential", "mandatory",
    "requerido", "obrigatório", "essencial", "necessário"
  ];
  
  const isInImportantSection = importantSections.some(section => {
    const sectionIndex = lowerDesc.indexOf(section);
    if (sectionIndex === -1) return false;
    
    const sectionText = lowerDesc.substring(sectionIndex, sectionIndex + 500);
    return sectionText.includes(keyword.toLowerCase());
  });
  
  if (isInImportantSection || occurrences >= 3) {
    return "high";
  } else if (occurrences >= 2) {
    return "medium";
  } else {
    return "low";
  }
}

function generateKeywordSuggestions(
  keywords: KeywordMatch[],
  resumeData: ResumeData
): KeywordSuggestion[] {
  const suggestions: KeywordSuggestion[] = [];
  
  // Focus on missing high and medium importance keywords
  const missingImportant = keywords.filter(
    k => !k.present && (k.importance === "high" || k.importance === "medium")
  );
  
  missingImportant.forEach(keyword => {
    // Suggest where to add the keyword
    let section = "skills";
    let suggestion = `Adicione "${keyword.keyword}" na seção de Habilidades se você possui essa competência.`;
    
    // Check if it's a technical skill
    const technicalTerms = ["software", "framework", "language", "tool", "platform", "system"];
    const isTechnical = technicalTerms.some(term => keyword.keyword.includes(term));
    
    if (isTechnical) {
      section = "skills";
      suggestion = `Adicione "${keyword.keyword}" na lista de Habilidades Técnicas.`;
    } else if (keyword.keyword.length > 15) {
      // Longer phrases might be better in experience descriptions
      section = "experience";
      suggestion = `Mencione "${keyword.keyword}" na descrição de uma experiência relevante.`;
    }
    
    suggestions.push({
      keyword: keyword.keyword,
      section,
      suggestion,
      priority: keyword.importance === "high" ? "high" : "medium",
    });
  });
  
  // Limit to top 15 suggestions
  return suggestions.slice(0, 15);
}

/**
 * Suggests specific places in the resume to add a missing keyword
 */
export function suggestKeywordPlacement(
  keyword: string,
  resumeData: ResumeData
): { section: string; subsection?: string; suggestion: string } {
  // Analyze keyword type
  const isSkill = keyword.split(" ").length <= 3;
  const isCertification = keyword.toLowerCase().includes("certified") || 
                          keyword.toLowerCase().includes("certification");
  
  if (isCertification) {
    return {
      section: "certifications",
      suggestion: `Se você possui certificação em "${keyword}", adicione na seção de Certificações.`,
    };
  }
  
  if (isSkill) {
    return {
      section: "skills",
      suggestion: `Adicione "${keyword}" na lista de Habilidades se você domina essa tecnologia/ferramenta.`,
    };
  }
  
  // For phrases, suggest experience section
  const mostRecentExp = resumeData.experience?.[0];
  if (mostRecentExp) {
    return {
      section: "experience",
      subsection: "0",
      suggestion: `Mencione "${keyword}" na descrição da sua experiência em ${mostRecentExp.company}, se aplicável.`,
    };
  }
  
  return {
    section: "summary",
    suggestion: `Inclua "${keyword}" no seu resumo profissional para destacar essa competência.`,
  };
}
