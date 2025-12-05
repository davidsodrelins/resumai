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
import { analyzeSoftSkills } from "./softSkillsAnalyzer";
import { generatePortfolio } from "./services/portfolioGenerator";
import type { ResumeData } from "../shared/resumeTypes";
import { loginUser, signupUser } from "./publicAuth";
import { requestPasswordReset, resetPassword } from "./passwordReset";
import { sendWelcomeEmail } from "./modules/welcomeEmail";
import { createDonationCheckout, handleSuccessfulPayment, getUserDonations, isUserDonor, DONATION_OPTIONS } from "./donations";
import { checkResumeLimit, incrementResumeCount, getUserUsageStats } from "./usageLimits";
import { adminRouter } from "./routers/admin";
import { paymentsRouter } from "./routers/payments";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  payments: paymentsRouter,
  user: router({
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(1).optional(),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const updateData: any = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.country !== undefined) updateData.country = input.country;
        if (input.state !== undefined) updateData.state = input.state;
        if (input.city !== undefined) updateData.city = input.city;
        
        await db.update(users).set(updateData).where(eq(users.id, ctx.user!.id));
        return { success: true };
      }),
    
    updateName: protectedProcedure
      .input(z.object({ name: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(users).set({ name: input.name }).where(eq(users.id, ctx.user!.id));
        return { success: true };
      }),
    
    updateEmail: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        // Check if email already exists
        const existing = await db.select().from(users).where(eq(users.email, input.email));
        if (existing.length > 0 && existing[0].id !== ctx.user!.id) {
          throw new Error("Este email já está em uso");
        }
        await db.update(users).set({ email: input.email }).where(eq(users.id, ctx.user!.id));
        return { success: true };
      }),
    
    changePassword: protectedProcedure
      .input(z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const user = await db.select().from(users).where(eq(users.id, ctx.user!.id));
        if (!user[0]) throw new Error("Usuário não encontrado");
        
        // Verify current password
        const bcrypt = await import("bcryptjs");
        const isValid = await bcrypt.compare(input.currentPassword, user[0].passwordHash || "");
        if (!isValid) throw new Error("Senha atual incorreta");
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(input.newPassword, 10);
        await db.update(users).set({ passwordHash: hashedPassword }).where(eq(users.id, ctx.user!.id));
        return { success: true };
      }),
    
    updateLanguage: protectedProcedure
      .input(z.object({
        language: z.enum(["pt", "en", "es"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(users).set({ preferredLanguage: input.language }).where(eq(users.id, ctx.user!.id));
        return { success: true };
      }),
  }),
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    signup: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          console.log("[Signup] Attempting signup for:", input.email);
          const result = await signupUser(input);
          console.log("[Signup] Signup successful for:", input.email);
          
          // Send welcome email (async, don't block signup)
          sendWelcomeEmail(input.name, input.email).catch(err => {
            console.error('[Signup] Failed to send welcome email:', err);
          });
          
          // Return token to frontend (will be stored in localStorage)
          return {
            success: true,
            user: result.user,
            token: result.token,
          };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao criar conta");
        }
      }),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
        rememberMe: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          console.log("[Login] Attempting login for:", input.email);
          const result = await loginUser(input);
          console.log("[Login] Login successful for:", input.email);
          
          // Return token to frontend (will be stored in localStorage)
          return {
            success: true,
            user: result.user,
            token: result.token,
          };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao fazer login");
        }
      }),
    
    logout: publicProcedure.mutation(() => {
      // Frontend will clear localStorage token
      return {
        success: true,
      } as const;
    }),

    forgotPassword: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await requestPasswordReset(input.email);
          return result;
        } catch (error: any) {
          throw new Error(error.message || "Erro ao solicitar recuperação de senha");
        }
      }),

    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await resetPassword(input.token, input.newPassword);
          return result;
        } catch (error: any) {
          throw new Error(error.message || "Erro ao redefinir senha");
        }
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
          let buffer: Buffer;
          
          // Check if it's a data URL (base64)
          if (input.fileUrl.startsWith('data:')) {
            // Extract base64 data from data URL
            const base64Data = input.fileUrl.split(',')[1];
            buffer = Buffer.from(base64Data, 'base64');
          } else {
            // Download file from URL
            const response = await axios.get(input.fileUrl, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data);
          }
          
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
      .mutation(async ({ input, ctx }) => {
        try {
          if (!ctx.user.openId) {
            throw new Error('User not authenticated');
          }
          
          // Check if user has reached their monthly limit
          const limitCheck = await checkResumeLimit(ctx.user.openId);
          
          if (!limitCheck.canCreate) {
            throw new Error('LIMIT_REACHED');
          }
          
          const generatedResume = await generateResume(
            input.data,
            input.modelType,
            input.language
          );
          
          // Increment resume count after successful generation
          await incrementResumeCount(ctx.user.openId);
          
          return { 
            success: true, 
            resume: generatedResume,
            usage: {
              remaining: limitCheck.remaining - 1,
              limit: limitCheck.limit,
              isDonor: limitCheck.isDonor
            }
          };
        } catch (error: any) {
          console.error('Error generating resume:', error);
          if (error.message === 'LIMIT_REACHED') {
            throw new Error('LIMIT_REACHED');
          }
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
        resumeData: z.any(), // ProcessedResumeData type
        template: z.enum(['classic', 'modern', 'minimal', 'executive', 'creative']).optional().default('classic')
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const pdfBuffer = await generatePDF(input.resumeData, input.template);
          
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
      .mutation(async ({ input }) => {
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

    analyzeSoftSkills: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          targetRole: z.string().optional(),
          language: z.enum(["pt", "en", "es"]).default("pt"),
        })
      )
      .mutation(async ({ input }) => {
        const analysis = await analyzeSoftSkills(input.resumeData, input.targetRole, input.language);
        return analysis;
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

  portfolio: router({
    /**
     * Generate portfolio website from resume data
     */
    generate: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          template: z.enum(["modern", "minimalist", "professional"]),
          theme: z.enum(["light", "dark"]),
          primaryColor: z.string().optional(),
          customDomain: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const portfolioData = await generatePortfolio(
            input.resumeData as ResumeData,
            {
              template: input.template,
              theme: input.theme,
              primaryColor: input.primaryColor,
              customDomain: input.customDomain,
            }
          );

          // Upload HTML, CSS, JS to S3
          const timestamp = Date.now();
          const userId = ctx.user?.openId || "anonymous";
          const baseKey = `portfolios/${userId}/${timestamp}`;

          const htmlUpload = await storagePut(
            `${baseKey}/index.html`,
            portfolioData.html,
            "text/html"
          );

          const cssUpload = await storagePut(
            `${baseKey}/styles.css`,
            portfolioData.css,
            "text/css"
          );

          const jsUpload = await storagePut(
            `${baseKey}/script.js`,
            portfolioData.js,
            "application/javascript"
          );

          return {
            success: true,
            portfolioUrl: htmlUpload.url,
            metadata: portfolioData.metadata,
            files: {
              html: htmlUpload.url,
              css: cssUpload.url,
              js: jsUpload.url,
            },
          };
        } catch (error) {
          console.error("Error generating portfolio:", error);
          throw new Error("Failed to generate portfolio");
        }
      }),

    /**
     * Get portfolio preview (without saving to S3)
     */
    preview: protectedProcedure
      .input(
        z.object({
          resumeData: z.any(),
          template: z.enum(["modern", "minimalist", "professional"]),
          theme: z.enum(["light", "dark"]),
          primaryColor: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const portfolioData = await generatePortfolio(
          input.resumeData as ResumeData,
          {
            template: input.template,
            theme: input.theme,
            primaryColor: input.primaryColor,
          }
        );

        return {
          html: portfolioData.html,
          css: portfolioData.css,
          js: portfolioData.js,
          metadata: portfolioData.metadata,
        };
      }),
  }),

  donation: router({
    /**
     * Get donation options
     */
    getOptions: publicProcedure.query(() => {
      return DONATION_OPTIONS;
    }),

    /**
     * Create Stripe checkout session for donation
     */
    createCheckout: protectedProcedure
      .input(z.object({
        amount: z.number().min(100), // Minimum R$ 1.00
        description: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || !ctx.user.openId) {
          throw new Error("User not authenticated");
        }

        const successUrl = `${ctx.req.protocol}://${ctx.req.get("host")}/donation/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${ctx.req.protocol}://${ctx.req.get("host")}/`;

        const checkout = await createDonationCheckout(
          ctx.user.openId,
          input.amount,
          input.description,
          successUrl,
          cancelUrl
        );

        return checkout;
      }),

    /**
     * Handle successful payment (called from webhook or success page)
     */
    confirmPayment: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
      }))
      .mutation(async ({ input }) => {
        await handleSuccessfulPayment(input.sessionId);
        return { success: true };
      }),

    /**
     * Get user's total donations
     */
    getTotal: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || !ctx.user.openId) {
        return { total: 0, isDonor: false };
      }

      const total = await getUserDonations(ctx.user.openId);
      const isDonor = await isUserDonor(ctx.user.openId);

      return { total, isDonor };
    }),
  }),

  usage: router({
    /**
     * Get user's usage statistics
     */
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || !ctx.user.openId) {
        throw new Error("User not authenticated");
      }

      const stats = await getUserUsageStats(ctx.user.openId);
      return stats;
    }),
  }),
});

export type AppRouter = typeof appRouter;
