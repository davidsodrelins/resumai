import { invokeLLM } from "./_core/llm";
import type { ResumeData } from "../shared/resumeTypes";

export interface CoverLetterInput {
  resumeData: ResumeData;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  language: "pt" | "en" | "es";
  additionalInfo?: string;
}

const LANGUAGE_PROMPTS = {
  pt: {
    system: "Você é um especialista em redação de cartas de apresentação profissionais em português. Sua tarefa é criar cartas persuasivas, personalizadas e otimizadas para ATS (Applicant Tracking Systems).",
    userTemplate: (input: CoverLetterInput) => `
Crie uma carta de apresentação profissional em português com base nas seguintes informações:

**Dados do Candidato:**
Nome: ${input.resumeData.personalInfo?.fullName || ""}
Email: ${input.resumeData.personalInfo?.email || ""}
Telefone: ${input.resumeData.personalInfo?.phone || ""}
Localização: ${input.resumeData.personalInfo?.location || ""}
Resumo Profissional: ${input.resumeData.personalInfo?.summary || ""}

**Experiências Profissionais:**
${input.resumeData.experience?.map(exp => `
- ${exp.position} na ${exp.company} (${exp.startDate} - ${exp.endDate || "Presente"})
  ${exp.description || ""}
  ${exp.achievements?.map(a => `• ${a}`).join("\n  ") || ""}
`).join("\n") || "Nenhuma experiência fornecida"}

**Formação Acadêmica:**
${input.resumeData.education?.map(edu => `
- ${edu.degree}${edu.field ? ` em ${edu.field}` : ""} - ${edu.institution}
`).join("\n") || "Nenhuma formação fornecida"}

**Habilidades:**
${input.resumeData.skills?.join(", ") || "Nenhuma habilidade fornecida"}

**Vaga Pretendida:**
Empresa: ${input.companyName}
Cargo: ${input.jobTitle}
${input.jobDescription ? `Descrição da Vaga: ${input.jobDescription}` : ""}

${input.additionalInfo ? `**Informações Adicionais:**\n${input.additionalInfo}` : ""}

**Instruções:**
1. Crie uma carta de apresentação profissional, persuasiva e personalizada
2. Destaque as experiências e habilidades mais relevantes para a vaga
3. Demonstre conhecimento sobre a empresa e o cargo
4. Use linguagem formal mas acessível
5. Mantenha entre 250-400 palavras
6. Inclua saudação, introdução, corpo (2-3 parágrafos) e conclusão
7. Otimize para ATS usando palavras-chave da descrição da vaga
8. Retorne APENAS o texto da carta, sem formatação markdown ou títulos extras
`,
  },
  en: {
    system: "You are an expert in writing professional cover letters in English. Your task is to create persuasive, personalized cover letters optimized for ATS (Applicant Tracking Systems).",
    userTemplate: (input: CoverLetterInput) => `
Create a professional cover letter in English based on the following information:

**Candidate Information:**
Name: ${input.resumeData.personalInfo?.fullName || ""}
Email: ${input.resumeData.personalInfo?.email || ""}
Phone: ${input.resumeData.personalInfo?.phone || ""}
Location: ${input.resumeData.personalInfo?.location || ""}
Professional Summary: ${input.resumeData.personalInfo?.summary || ""}

**Work Experience:**
${input.resumeData.experience?.map(exp => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})
  ${exp.description || ""}
  ${exp.achievements?.map(a => `• ${a}`).join("\n  ") || ""}
`).join("\n") || "No experience provided"}

**Education:**
${input.resumeData.education?.map(edu => `
- ${edu.degree}${edu.field ? ` in ${edu.field}` : ""} - ${edu.institution}
`).join("\n") || "No education provided"}

**Skills:**
${input.resumeData.skills?.join(", ") || "No skills provided"}

**Target Position:**
Company: ${input.companyName}
Job Title: ${input.jobTitle}
${input.jobDescription ? `Job Description: ${input.jobDescription}` : ""}

${input.additionalInfo ? `**Additional Information:**\n${input.additionalInfo}` : ""}

**Instructions:**
1. Create a professional, persuasive, and personalized cover letter
2. Highlight the most relevant experiences and skills for the position
3. Demonstrate knowledge about the company and role
4. Use formal but accessible language
5. Keep between 250-400 words
6. Include greeting, introduction, body (2-3 paragraphs), and conclusion
7. Optimize for ATS using keywords from the job description
8. Return ONLY the letter text, without markdown formatting or extra titles
`,
  },
  es: {
    system: "Eres un experto en redacción de cartas de presentación profesionales en español. Tu tarea es crear cartas persuasivas, personalizadas y optimizadas para ATS (Applicant Tracking Systems).",
    userTemplate: (input: CoverLetterInput) => `
Crea una carta de presentación profesional en español basada en la siguiente información:

**Datos del Candidato:**
Nombre: ${input.resumeData.personalInfo?.fullName || ""}
Email: ${input.resumeData.personalInfo?.email || ""}
Teléfono: ${input.resumeData.personalInfo?.phone || ""}
Ubicación: ${input.resumeData.personalInfo?.location || ""}
Resumen Profesional: ${input.resumeData.personalInfo?.summary || ""}

**Experiencia Profesional:**
${input.resumeData.experience?.map(exp => `
- ${exp.position} en ${exp.company} (${exp.startDate} - ${exp.endDate || "Presente"})
  ${exp.description || ""}
  ${exp.achievements?.map(a => `• ${a}`).join("\n  ") || ""}
`).join("\n") || "Ninguna experiencia proporcionada"}

**Formación Académica:**
${input.resumeData.education?.map(edu => `
- ${edu.degree}${edu.field ? ` en ${edu.field}` : ""} - ${edu.institution}
`).join("\n") || "Ninguna formación proporcionada"}

**Habilidades:**
${input.resumeData.skills?.join(", ") || "Ninguna habilidad proporcionada"}

**Puesto Deseado:**
Empresa: ${input.companyName}
Cargo: ${input.jobTitle}
${input.jobDescription ? `Descripción del Puesto: ${input.jobDescription}` : ""}

${input.additionalInfo ? `**Información Adicional:**\n${input.additionalInfo}` : ""}

**Instrucciones:**
1. Crea una carta de presentación profesional, persuasiva y personalizada
2. Destaca las experiencias y habilidades más relevantes para el puesto
3. Demuestra conocimiento sobre la empresa y el cargo
4. Usa lenguaje formal pero accesible
5. Mantén entre 250-400 palabras
6. Incluye saludo, introducción, cuerpo (2-3 párrafos) y conclusión
7. Optimiza para ATS usando palabras clave de la descripción del puesto
8. Devuelve SOLO el texto de la carta, sin formato markdown ni títulos extras
`,
  },
};

export async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
  const prompts = LANGUAGE_PROMPTS[input.language];

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: prompts.system,
      },
      {
        role: "user",
        content: prompts.userTemplate(input),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Failed to generate cover letter");
  }

  return content.trim();
}
