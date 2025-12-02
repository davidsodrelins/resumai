import { invokeLLM } from "./_core/llm";

export interface ProcessedResumeData {
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    achievements?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date?: string;
    url?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
    url?: string;
  }>;
  additionalSections: Array<{
    title: string;
    content: string;
  }>;
}

/**
 * Extract structured data from LinkedIn profile URL using web scraping
 * Note: LinkedIn scraping is complex and may require authentication
 * This is a placeholder implementation
 */
export async function extractLinkedInData(linkedinUrl: string): Promise<string> {
  // For now, we'll return the URL as context for the LLM
  // In production, you might want to use LinkedIn API or web scraping
  return `LinkedIn Profile URL: ${linkedinUrl}\n\nNote: Please extract relevant professional information from the user's input and uploaded files.`;
}

/**
 * Process all input sources and extract structured resume data using Llama
 */
export async function processResumeInputs(
  userPrompt: string,
  linkedinUrl?: string,
  uploadedFilesText?: string[]
): Promise<ProcessedResumeData> {
  // Combine all input sources
  let combinedInput = `User Instructions:\n${userPrompt}\n\n`;
  
  if (linkedinUrl) {
    const linkedinData = await extractLinkedInData(linkedinUrl);
    combinedInput += `${linkedinData}\n\n`;
  }
  
  if (uploadedFilesText && uploadedFilesText.length > 0) {
    combinedInput += `Previous Resume Content:\n`;
    uploadedFilesText.forEach((text, index) => {
      combinedInput += `\n--- Document ${index + 1} ---\n${text}\n`;
    });
  }

  const systemPrompt = `You are an expert resume analyzer and career consultant. Your task is to extract and structure professional information from various sources into a comprehensive JSON format.

Extract the following information:
- Personal Information (name, email, phone, location, LinkedIn, website, professional summary)
- Work Experience (company, position, dates, description, key achievements)
- Education (institution, degree, field, dates, description)
- Skills (categorized by type: technical, soft skills, tools, etc.)
- Languages (language name and proficiency level)
- Certifications (name, issuer, date, URL)
- Projects (name, description, technologies, URL)
- Additional Sections (any other relevant information)

Important guidelines:
- Extract ALL available information comprehensively
- Maintain chronological order (most recent first)
- Use clear, professional language
- Quantify achievements when possible
- Ensure dates are in consistent format (MM/YYYY or YYYY)
- If information is missing, omit the field rather than guessing
- Optimize content for ATS (Applicant Tracking Systems) compatibility`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: combinedInput }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume_data",
        strict: true,
        schema: {
          type: "object",
          properties: {
            personalInfo: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" },
                linkedin: { type: "string" },
                website: { type: "string" },
                summary: { type: "string" }
              },
              required: [],
              additionalProperties: false
            },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  company: { type: "string" },
                  position: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  description: { type: "string" },
                  achievements: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["company", "position", "startDate", "description"],
                additionalProperties: false
              }
            },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  institution: { type: "string" },
                  degree: { type: "string" },
                  field: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  description: { type: "string" }
                },
                required: ["institution", "degree"],
                additionalProperties: false
              }
            },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  items: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["category", "items"],
                additionalProperties: false
              }
            },
            languages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  language: { type: "string" },
                  proficiency: { type: "string" }
                },
                required: ["language", "proficiency"],
                additionalProperties: false
              }
            },
            certifications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  issuer: { type: "string" },
                  date: { type: "string" },
                  url: { type: "string" }
                },
                required: ["name", "issuer"],
                additionalProperties: false
              }
            },
            projects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  technologies: {
                    type: "array",
                    items: { type: "string" }
                  },
                  url: { type: "string" }
                },
                required: ["name", "description"],
                additionalProperties: false
              }
            },
            additionalSections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" }
                },
                required: ["title", "content"],
                additionalProperties: false
              }
            }
          },
          required: ["personalInfo", "experience", "education", "skills", "languages", "certifications", "projects", "additionalSections"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Failed to extract resume data from LLM response');
  }

  return JSON.parse(content);
}

/**
 * Generate resume in specified model type and language
 */
export async function generateResume(
  data: ProcessedResumeData,
  modelType: 'reduced' | 'mixed' | 'complete',
  language: 'pt' | 'en' | 'es'
): Promise<ProcessedResumeData> {
  const languageNames = {
    pt: 'Português',
    en: 'English',
    es: 'Español'
  };

  const modelInstructions = {
    reduced: `Generate a REDUCED resume version:
- Include only essential information
- Maximum 1 page
- Brief summary (2-3 lines)
- Top 3-4 most recent/relevant experiences with minimal details
- Education highlights only
- Top 10-15 key skills
- Languages and certifications only if highly relevant`,
    
    mixed: `Generate a MIXED resume version:
- Balanced approach, 1-2 pages
- Professional summary (3-4 lines)
- Last 2 work experiences with FULL details (achievements, responsibilities, impact)
- Other experiences with brief descriptions only
- Complete education section
- Comprehensive skills list (categorized)
- All languages and key certifications`,
    
    complete: `Generate a COMPLETE resume version:
- Comprehensive, 2-3 pages
- Detailed professional summary
- ALL work experiences with full descriptions and achievements
- Complete education history with details
- All skills categorized and detailed
- All languages with proficiency levels
- All certifications with dates and issuers
- All projects with technologies and links
- All additional sections with full content`
  };

  const systemPrompt = `You are an expert resume writer and career consultant. Generate a professional resume in ${languageNames[language]}.

Model Type: ${modelType.toUpperCase()}
${modelInstructions[modelType]}

Important guidelines:
- Translate ALL content to ${languageNames[language]} naturally and professionally
- Maintain professional tone and formatting
- Use action verbs and quantifiable achievements
- Optimize for ATS (Applicant Tracking Systems) - use standard section names and clear formatting
- Ensure consistency in date formats and terminology
- Keep the same JSON structure as input
- For reduced/mixed models, prioritize most recent and relevant information
- Maintain chronological order (most recent first)`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate the resume based on this data:\n\n${JSON.stringify(data, null, 2)}` }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "generated_resume",
        strict: true,
        schema: {
          type: "object",
          properties: {
            personalInfo: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" },
                linkedin: { type: "string" },
                website: { type: "string" },
                summary: { type: "string" }
              },
              required: [],
              additionalProperties: false
            },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  company: { type: "string" },
                  position: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  description: { type: "string" },
                  achievements: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["company", "position", "startDate", "description"],
                additionalProperties: false
              }
            },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  institution: { type: "string" },
                  degree: { type: "string" },
                  field: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  description: { type: "string" }
                },
                required: ["institution", "degree"],
                additionalProperties: false
              }
            },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  items: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["category", "items"],
                additionalProperties: false
              }
            },
            languages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  language: { type: "string" },
                  proficiency: { type: "string" }
                },
                required: ["language", "proficiency"],
                additionalProperties: false
              }
            },
            certifications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  issuer: { type: "string" },
                  date: { type: "string" },
                  url: { type: "string" }
                },
                required: ["name", "issuer"],
                additionalProperties: false
              }
            },
            projects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  technologies: {
                    type: "array",
                    items: { type: "string" }
                  },
                  url: { type: "string" }
                },
                required: ["name", "description"],
                additionalProperties: false
              }
            },
            additionalSections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" }
                },
                required: ["title", "content"],
                additionalProperties: false
              }
            }
          },
          required: ["personalInfo", "experience", "education", "skills", "languages", "certifications", "projects", "additionalSections"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Failed to generate resume from LLM response');
  }

  return JSON.parse(content);
}
