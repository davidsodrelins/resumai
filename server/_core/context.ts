import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { verifyToken } from "../publicAuth";
import { COOKIE_NAME } from "@shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Try OAuth authentication first (for existing users)
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // If OAuth fails, try JWT token authentication (for public auth users)
    try {
      // Try to get token from Authorization header first (localStorage)
      const authHeader = opts.req.headers.authorization;
      let token: string | undefined;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      } else {
        // Fallback to cookie (for backward compatibility)
        token = opts.req.cookies?.[COOKIE_NAME];
      }
      
      if (token) {
        user = await verifyToken(token);
      }
    } catch (jwtError) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
