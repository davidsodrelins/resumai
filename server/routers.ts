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
      })
  })
});

export type AppRouter = typeof appRouter;
