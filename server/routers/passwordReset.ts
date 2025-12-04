import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  requestPasswordReset,
  resetPassword,
  validateResetToken,
} from "../modules/passwordReset";

export const passwordResetRouter = router({
  /**
   * Solicita reset de senha
   */
  requestReset: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const success = await requestPasswordReset(input.email);

        return {
          success,
          message: success
            ? "Se este email está cadastrado, você receberá um link para redefinir sua senha."
            : "Erro ao processar solicitação",
        };
      } catch (error: any) {
        throw new Error(error.message || "Erro ao solicitar reset de senha");
      }
    }),

  /**
   * Valida um token de reset
   */
  validateToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const userId = await validateResetToken(input.token);

        return {
          valid: userId !== null,
          userId,
        };
      } catch (error: any) {
        return {
          valid: false,
          userId: null,
        };
      }
    }),

  /**
   * Reseta a senha
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(6),
        confirmPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validar que as senhas correspondem
        if (input.newPassword !== input.confirmPassword) {
          throw new Error("As senhas não correspondem");
        }

        const success = await resetPassword(input.token, input.newPassword);

        if (!success) {
          throw new Error("Token inválido ou expirado");
        }

        return {
          success: true,
          message: "Senha redefinida com sucesso! Você pode fazer login agora.",
        };
      } catch (error: any) {
        throw new Error(error.message || "Erro ao redefinir senha");
      }
    }),
});
