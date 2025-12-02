import type { ResumeData } from "../shared/resumeTypes";

/**
 * Gera um documento LaTeX completo do currículo com metadados ocultos otimizados para IA
 * Os metadados incluem palavras-chave e frases de impacto que não aparecem na versão impressa
 * mas aumentam a compatibilidade com sistemas de ATS e IA de recrutamento
 */
export function generateLatexResume(data: ResumeData, language: string = "pt"): string {
  const translations = {
    pt: {
      experience: "Experiência Profissional",
      education: "Formação Acadêmica",
      skills: "Habilidades",
      languages: "Idiomas",
      summary: "Resumo Profissional",
    },
    en: {
      experience: "Professional Experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      summary: "Professional Summary",
    },
    es: {
      experience: "Experiencia Profesional",
      education: "Formación Académica",
      skills: "Habilidades",
      languages: "Idiomas",
      summary: "Resumen Profesional",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.pt;

  // Extrair palavras-chave para metadados ocultos
  const keywords = extractKeywords(data);
  const impactPhrases = extractImpactPhrases(data);

  let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\geometry{left=2cm,right=2cm,top=2cm,bottom=2cm}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{6pt}

\\definecolor{primary}{RGB}{41, 98, 255}
\\definecolor{secondary}{RGB}{100, 100, 100}

\\hypersetup{
    colorlinks=true,
    linkcolor=primary,
    urlcolor=primary,
    pdfauthor={${escapeLatex(data.personalInfo.fullName)}},
    pdftitle={Curriculum Vitae - ${escapeLatex(data.personalInfo.fullName)}},
    pdfsubject={Professional Resume},
    pdfkeywords={${keywords.join(", ")}}
}

% Metadados ocultos otimizados para IA (não aparecem no PDF)
% Palavras-chave: ${keywords.join(", ")}
% Frases de impacto: ${impactPhrases.join(" | ")}
% ATS-optimized: true
% Format: LaTeX Professional Resume
% Generated: ${new Date().toISOString()}

\\begin{document}

% Header
{\\Huge\\textbf{${escapeLatex(data.personalInfo.fullName)}}}\\\\[4pt]
{\\large\\color{secondary}${escapeLatex(data.personalInfo.summary || "")}}\\\\[8pt]

% Contact Information
\\begin{tabular}{@{}ll@{}}
${data.personalInfo.email ? `\\textbf{Email:} & ${escapeLatex(data.personalInfo.email)} \\\\` : ""}
${data.personalInfo.phone ? `\\textbf{Phone:} & ${escapeLatex(data.personalInfo.phone)} \\\\` : ""}
${data.personalInfo.location ? `\\textbf{Location:} & ${escapeLatex(data.personalInfo.location)} \\\\` : ""}
${data.personalInfo.linkedin ? `\\textbf{LinkedIn:} & \\href{${data.personalInfo.linkedin}}{${escapeLatex(data.personalInfo.linkedin)}} \\\\` : ""}
\\end{tabular}

\\vspace{12pt}
\\hrule
\\vspace{12pt}

`;

  // Summary (already in header, skip this section)

  // Experience
  if (data.experience && data.experience.length > 0) {
    latex += `% ${t.experience}\n`;
    latex += `{\\large\\textbf{${t.experience}}}\\\\[6pt]\n\n`;
    
    data.experience.forEach((exp, index) => {
      const period = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - Present`;
      latex += `% Experience ${index + 1}: ${escapeLatex(exp.position)} at ${escapeLatex(exp.company)}\n`;
      latex += `{\\textbf{${escapeLatex(exp.position)}}} \\hfill {\\color{secondary}${escapeLatex(period)}}\\\\[2pt]\n`;
      latex += `{\\textit{${escapeLatex(exp.company)}}}\\\\[4pt]\n`;
      
      if (exp.description) {
        latex += `${escapeLatex(exp.description)}\\\\[2pt]\n`;
      }
      
      if (exp.achievements && exp.achievements.length > 0) {
        latex += `\\begin{itemize}[leftmargin=*,itemsep=2pt]\n`;
        exp.achievements.forEach((achievement: string) => {
          latex += `  \\item ${escapeLatex(achievement)}\n`;
        });
        latex += `\\end{itemize}\n`;
      }
      
      latex += `\\vspace{6pt}\n\n`;
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    latex += `% ${t.education}\n`;
    latex += `{\\large\\textbf{${t.education}}}\\\\[6pt]\n\n`;
    
    data.education.forEach((edu, index) => {
      const period = edu.endDate ? `${edu.startDate} - ${edu.endDate}` : `${edu.startDate} - Present`;
      latex += `% Education ${index + 1}: ${escapeLatex(edu.degree)} from ${escapeLatex(edu.institution)}\n`;
      latex += `{\\textbf{${escapeLatex(edu.degree)}}} \\hfill {\\color{secondary}${escapeLatex(period)}}\\\\[2pt]\n`;
      latex += `{\\textit{${escapeLatex(edu.institution)}}}\\\\[6pt]\n\n`;
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    latex += `% ${t.skills}\n`;
    latex += `{\\large\\textbf{${t.skills}}}\\\\[6pt]\n\n`;
    latex += `${data.skills.map(skill => escapeLatex(skill)).join(" $\\bullet$ ")}\n\n`;
    latex += `\\vspace{6pt}\n\n`;
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    latex += `% ${t.languages}\n`;
    latex += `{\\large\\textbf{${t.languages}}}\\\\[6pt]\n\n`;
    data.languages.forEach((lang) => {
      latex += `\\textbf{${escapeLatex(lang.name)}}: ${escapeLatex(lang.proficiency)}\\\\[2pt]\n`;
    });
    latex += `\n`;
  }

  // Hidden metadata at the end (commented out, won't appear in PDF)
  latex += `\n% === HIDDEN METADATA FOR ATS/AI OPTIMIZATION ===\n`;
  latex += `% Keywords: ${keywords.join(", ")}\n`;
  latex += `% Impact Phrases: ${impactPhrases.join(" | ")}\n`;
  latex += `% Skills Summary: ${data.skills?.join(", ") || "N/A"}\n`;
  latex += `% Years of Experience: ${calculateYearsOfExperience(data)}\n`;
  latex += `% Education Level: ${data.education?.[0]?.degree || "N/A"}\n`;
  latex += `% Languages: ${data.languages?.map(l => l.name).join(", ") || "N/A"}\n`;
  latex += `% Last Updated: ${new Date().toISOString()}\n`;
  latex += `% Format Version: 1.0\n`;
  latex += `% ATS Compatibility: High\n`;

  latex += `\n\\end{document}\n`;

  return latex;
}

/**
 * Extrai palavras-chave importantes do currículo
 */
function extractKeywords(data: ResumeData): string[] {
  const keywords: Set<string> = new Set();

  // Adicionar habilidades
  data.skills?.forEach(skill => keywords.add(skill));

  // Extrair palavras-chave das responsabilidades
  data.experience?.forEach(exp => {
    exp.achievements?.forEach((achievement: string) => {
      // Extrair verbos de ação e termos técnicos
      const words = achievement.split(/\s+/);
      words.forEach(word => {
        if (word.length > 4 && !isCommonWord(word)) {
          keywords.add(word.replace(/[.,;:!?]/g, ""));
        }
      });
    });
  });

  // Adicionar idiomas
  data.languages?.forEach(lang => keywords.add(lang.name));

  // Adicionar certificações
  data.certifications?.forEach(cert => keywords.add(cert.name));

  return Array.from(keywords).slice(0, 50); // Limitar a 50 keywords
}

/**
 * Extrai frases de impacto do currículo
 */
function extractImpactPhrases(data: ResumeData): string[] {
  const phrases: string[] = [];

  data.experience?.forEach(exp => {
    exp.achievements?.forEach((achievement: string) => {
      // Identificar frases com números (indicam resultados quantificados)
      if (/\d+/.test(achievement)) {
        phrases.push(achievement);
      }
    });
  });

  return phrases.slice(0, 10); // Limitar a 10 frases
}

/**
 * Calcula anos de experiência baseado nas datas
 */
function calculateYearsOfExperience(data: ResumeData): number {
  if (!data.experience || data.experience.length === 0) return 0;

  const currentYear = new Date().getFullYear();
  const years = data.experience.map(exp => {
    const startYear = parseInt(exp.startDate.match(/(\d{4})/)?.[0] || "0");
    const endYear = exp.endDate 
      ? parseInt(exp.endDate.match(/(\d{4})/)?.[0] || String(currentYear))
      : currentYear;
    return endYear - startYear;
  });

  return years.reduce((sum, year) => sum + year, 0);
}

/**
 * Verifica se é uma palavra comum (stop word)
 */
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "should",
    "could", "may", "might", "must", "can", "this", "that", "these", "those",
    // Português
    "o", "a", "os", "as", "um", "uma", "e", "ou", "mas", "em", "no", "na",
    "de", "do", "da", "para", "com", "por", "como", "que", "se", "foi",
    "são", "foram", "ter", "tem", "teve", "fazer", "faz", "fez",
  ]);

  return commonWords.has(word.toLowerCase());
}

/**
 * Escapa caracteres especiais do LaTeX
 */
function escapeLatex(text: string): string {
  if (!text) return "";
  
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, "\\$&")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}")
    .replace(/\n/g, " ");
}
