import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, like, or, sql } from "drizzle-orm";
import { getDb } from "../db";
import { blogPosts, users } from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

/**
 * Admin-only procedure for blog management
 */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Apenas administradores podem gerenciar o blog.",
    });
  }
  return next({ ctx });
});

/**
 * Gera slug a partir do título
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-"); // Remove hífens duplicados
}

export const blogRouter = router({
  /**
   * Criar novo post (admin only)
   */
  createPost: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        metaDescription: z.string().max(160).optional(),
        featuredImage: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).default("draft"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const slug = generateSlug(input.title);

      // Verificar se slug já existe
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe um post com este título. Por favor, escolha outro.",
        });
      }

      const [post] = await db.insert(blogPosts).values({
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt,
        authorId: ctx.user.id,
        category: input.category,
        tags: input.tags,
        metaDescription: input.metaDescription,
        featuredImage: input.featuredImage,
        status: input.status,
        publishedAt: input.status === "published" ? new Date() : null,
      });

      return { success: true, postId: post.insertId, slug };
    }),

  /**
   * Atualizar post existente (admin only)
   */
  updatePost: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        metaDescription: z.string().max(160).optional(),
        featuredImage: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { id, ...updates } = input;

      // Verificar se post existe
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, id))
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post não encontrado.",
        });
      }

      const updateData: any = { ...updates };

      // Se título mudou, gerar novo slug
      if (updates.title) {
        updateData.slug = generateSlug(updates.title);
      }

      // Se status mudou para published e ainda não tem publishedAt, definir agora
      if (updates.status === "published" && !existing[0].publishedAt) {
        updateData.publishedAt = new Date();
      }

      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));

      return { success: true };
    }),

  /**
   * Deletar post (admin only)
   */
  deletePost: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));

      return { success: true };
    }),

  /**
   * Listar todos os posts (público, apenas published)
   */
  getAllPosts: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        category: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { page, limit, category, search } = input;
      const offset = (page - 1) * limit;

      let query = db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          category: blogPosts.category,
          tags: blogPosts.tags,
          featuredImage: blogPosts.featuredImage,
          publishedAt: blogPosts.publishedAt,
          viewCount: blogPosts.viewCount,
          authorName: users.name,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .where(eq(blogPosts.status, "published"))
        .$dynamic();

      // Filtrar por categoria
      if (category) {
        query = query.where(eq(blogPosts.category, category));
      }

      // Busca por título ou conteúdo
      if (search) {
        query = query.where(
          or(
            like(blogPosts.title, `%${search}%`),
            like(blogPosts.content, `%${search}%`)
          )
        );
      }

      const posts = await query
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit)
        .offset(offset);

      // Contar total de posts
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"));

      return {
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    }),

  /**
   * Buscar post por slug (público)
   */
  getPostBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [post] = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          content: blogPosts.content,
          excerpt: blogPosts.excerpt,
          category: blogPosts.category,
          tags: blogPosts.tags,
          metaDescription: blogPosts.metaDescription,
          featuredImage: blogPosts.featuredImage,
          publishedAt: blogPosts.publishedAt,
          viewCount: blogPosts.viewCount,
          authorName: users.name,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .where(eq(blogPosts.slug, input.slug))
        .limit(1);

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post não encontrado.",
        });
      }

      // Incrementar contador de visualizações
      await db
        .update(blogPosts)
        .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
        .where(eq(blogPosts.id, post.id));

      return post;
    }),

  /**
   * Listar posts do admin (todos os status)
   */
  getAdminPosts: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        status: z.enum(["draft", "published", "archived"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { page, limit, status } = input;
      const offset = (page - 1) * limit;

      let query = db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          category: blogPosts.category,
          status: blogPosts.status,
          publishedAt: blogPosts.publishedAt,
          viewCount: blogPosts.viewCount,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .$dynamic();

      if (status) {
        query = query.where(eq(blogPosts.status, status));
      }

      const posts = await query
        .orderBy(desc(blogPosts.updatedAt))
        .limit(limit)
        .offset(offset);

      // Contar total
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(blogPosts);

      return {
        posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    }),

  /**
   * Buscar post por ID (admin only)
   */
  getPostById: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, input.id))
        .limit(1);

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post não encontrado.",
        });
      }

      return post;
    }),
});
