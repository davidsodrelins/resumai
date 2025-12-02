import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { extractTextFromFile } from "./fileProcessor";
import { processResumeInputs, generateResume } from "./resumeProcessor";
import { generateDOCX, generatePDF } from "./documentExporter";
import { storagePut } from "./storage";
import axios from "axios";
import * as resumeHistory from "./resumeHistory";
import { generateCoverLetter } from "./coverLetterGenerator";
import { generateLatexResume } from "./latexExporter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  resume: router({
    /**
     * Upload file and extract text content
     */
    uploadFile: protectedProcedure
      .input(z.object({
        fileUrl: z.string(),
        mimeType: z.string()
      }))
      .mutation(async ({ input }) => {
        try {
          // Download file from URL
          const response = await axios.get(input.fileUrl, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data);
          
          // Extract text
          const text = await extractTextFromFile(buffer, input.mimeType);
          
          return { success: true, text };
        } catch (error) {
          console.error('Error processing file:', error);
          throw new Error('Failed to process uploaded file');
        }
      }),

    /**
     * Process inputs and generate resume data
     */
    processInputs: protectedProcedure
      .input(z.object({
        userPrompt: z.string(),
        linkedinUrl: z.string().optional(),
        uploadedFilesText: z.array(z.string()).optional()
      }))
      .mutation(async ({ input }) => {
        try {
          const extractedData = await processResumeInputs(
            input.userPrompt,
            input.linkedinUrl,
            input.uploadedFilesText
          );
          
          return { success: true, data: extractedData };
        } catch (error) {
          console.error('Error processing inputs:', error);
          throw new Error('Failed to process resume inputs');
        }
      }),

    /**
     * Generate resume in specific model and language
     */
    generateResume: protectedProcedure
      .input(z.object({
        data: z.any(), // ProcessedResumeData type
        modelType: z.enum(['reduced', 'mixed', 'complete']),
        language: z.enum(['pt', 'en', 'es'])
      }))
      .mutation(async ({ input }) => {
        try {
          const generatedResume = await generateResume(
            input.data,
            input.modelType,
            input.language
          );
          
          return { success: true, resume: generatedResume };
        } catch (error) {
          console.error('Error generating resume:', error);
          throw new Error('Failed to generate resume');
        }
      }),

    /**
     * Export resume as DOCX
     */
    exportDOCX: protectedProcedure
      .input(z.object({
        resumeData: z.any() // ProcessedResumeData type
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const docxBuffer = await generateDOCX(input.resumeData);
          
          // Upload to S3
          const fileName = `resume-${ctx.user.id}-${Date.now()}.docx`;
          const { url } = await storagePut(
            fileName,
            docxBuffer,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          );
          
          return { success: true, url };
        } catch (error) {
          console.error('Error exporting DOCX:', error);
          throw new Error('Failed to export resume as DOCX');
        }
      }),

    /**
     * Export resume as PDF
     */
    exportLatex: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          language: z.enum(["pt", "en", "es"]).default("pt"),
        })
      )
      .mutation(async ({ input }) => {
        const latex = generateLatexResume(input.resumeData, input.language);
        return { latex };
      }),
    exportPDF: protectedProcedure
      .input(z.object({
        resumeData: z.any() // ProcessedResumeData type
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const pdfBuffer = await generatePDF(input.resumeData);
          
          // Upload to S3
          const fileName = `resume-${ctx.user.id}-${Date.now()}.pdf`;
          const { url } = await storagePut(
            fileName,
            pdfBuffer,
            'application/pdf'
          );
          
          return { success: true, url };
        } catch (error) {
          console.error('Error exporting PDF:', error);
          throw new Error('Failed to export resume as PDF');
        }
      }),

    /**
     * Update resume section
     */
    updateSection: protectedProcedure
      .input(z.object({
        resumeData: z.any(),
        sectionName: z.string(),
        sectionData: z.any()
      }))
      .mutation(async ({ input }) => {
        try {
          // Simply return the updated data - no persistence needed
          const updatedResume = {
            ...input.resumeData,
            [input.sectionName]: input.sectionData
          };
          
          return { success: true, resume: updatedResume };
        } catch (error) {
          console.error('Error updating section:', error);
          throw new Error('Failed to update resume section');
        }
      }),
  }),

  // Resume history management
  history: router({
    // Get all saved resumes for current user
    listResumes: protectedProcedure.query(async ({ ctx }) => {
      return await resumeHistory.getUserResumes(ctx.user.id);
    }),

    // Get a specific resume
    getResume: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await resumeHistory.getResumeById(input.id, ctx.user.id);
      }),

    // Save a new resume
    saveResume: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          resumeData: z.any(),
          model: z.enum(["reduced", "mixed", "complete"]),
          language: z.enum(["pt", "en", "es"]),
          template: z.enum(["classic", "modern", "minimal", "executive", "creative"]),
          isDraft: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await resumeHistory.saveResume({
          userId: ctx.user.id,
          ...input,
        });
      }),

    // Update an existing resume
    updateResume: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          resumeData: z.any().optional(),
          model: z.enum(["reduced", "mixed", "complete"]).optional(),
          language: z.enum(["pt", "en", "es"]).optional(),
          template: z.enum(["classic", "modern", "minimal", "executive", "creative"]).optional(),
          isDraft: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await resumeHistory.updateResume(id, ctx.user.id, data);
        return { success: true };
      }),

    // Delete a resume
    deleteResume: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await resumeHistory.deleteResume(input.id, ctx.user.id);
        return { success: true };
      }),

    // Get all cover letters
    listCoverLetters: protectedProcedure.query(async ({ ctx }) => {
      return await resumeHistory.getUserCoverLetters(ctx.user.id);
    }),

    // Get a specific cover letter
    getCoverLetter: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await resumeHistory.getCoverLetterById(input.id, ctx.user.id);
      }),

    // Save a cover letter
    saveCoverLetter: protectedProcedure
      .input(
        z.object({
          resumeId: z.number().optional(),
          title: z.string(),
          companyName: z.string().optional(),
          jobTitle: z.string().optional(),
          jobDescription: z.string().optional(),
          content: z.string(),
          language: z.enum(["pt", "en", "es"]),
          template: z.enum(["classic", "modern", "minimal", "executive", "creative"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await resumeHistory.saveCoverLetter({
          userId: ctx.user.id,
          ...input,
        });
      }),

    // Delete a cover letter
    deleteCoverLetter: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await resumeHistory.deleteCoverLetter(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Cover letter generation
  coverLetter: router({
    generate: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          companyName: z.string(),
          jobTitle: z.string(),
          jobDescription: z.string().optional(),
          language: z.enum(["pt", "en", "es"]),
          additionalInfo: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const content = await generateCoverLetter(input);
        return { content };
      }),
  }),

  // ATS Analysis and AI Improvements
  analysis: router({
    // Analyze ATS compatibility
    atsScore: protectedProcedure
      .input(z.object({ resumeData: z.any() }))
      .query(async ({ input }) => {
        const { analyzeATSCompatibility } = await import("./atsAnalyzer");
        return analyzeATSCompatibility(input.resumeData);
      }),

    // Generate AI-powered improvement suggestions
    improvements: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          language: z.enum(["pt", "en", "es"]).default("pt"),
        })
      )
      .mutation(async ({ input }) => {
        const { generateImprovementSuggestions } = await import("./aiImprovements");
        return await generateImprovementSuggestions(input.resumeData, input.language);
      }),

    // Apply a specific improvement suggestion
    applySuggestion: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          suggestion: z.any(),
        })
      )
      .mutation(async ({ input }) => {
        const { applySuggestion } = await import("./aiImprovements");
        return applySuggestion(input.resumeData, input.suggestion);
      }),

    // Apply all improvement suggestions
    applyAllSuggestions: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          suggestions: z.array(z.any()),
        })
      )
      .mutation(async ({ input }) => {
        const { applyAllSuggestions } = await import("./aiImprovements");
        return applyAllSuggestions(input.resumeData, input.suggestions);
      }),

    // Analyze keyword match with job description
    keywordMatch: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          jobDescription: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { analyzeKeywordMatch } = await import("./keywordMatcher");
        return analyzeKeywordMatch(input.resumeData, input.jobDescription);
      }),

    // Suggest where to place a missing keyword
    suggestPlacement: protectedProcedure
      .input(
        z.object({
          keyword: z.string(),
          resumeData: z.any(),
        })
      )
      .query(async ({ input }) => {
        const { suggestKeywordPlacement } = await import("./keywordMatcher");
        return suggestKeywordPlacement(input.keyword, input.resumeData);
      }),
  }),
});

export type AppRouter = typeof appRouter;
