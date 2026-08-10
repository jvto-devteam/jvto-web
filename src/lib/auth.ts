// src/lib/auth.ts
// Shared NextAuth config + admin authorization helpers.
// Config object moved out of src/app/(api)/api/auth/[...nextauth]/route.ts so that
// API route handlers and Server Components can share a single authOptions +
// call getServerSession(authOptions) consistently.
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user.id) {
        session.user.id = user.id.toString();
      }
      return session;
    },
  },
};

/**
 * Admin allowlist, sourced from CMS_ADMIN_EMAILS (comma-separated).
 * Empty/unset => nobody is admin (fail closed).
 */
const ADMIN_EMAILS = (process.env.CMS_ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/** True only if the given email is in the allowlist. Fails closed when the allowlist is empty. */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/** Returns the current session user, or null. */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

/**
 * Authorization gate for admin-only surfaces (write APIs, CMS).
 * 401 = no session; 403 = signed in but not an admin email; ok = authorized.
 */
export async function requireAdmin(): Promise<
  { ok: true; email: string } | { ok: false; status: 401 | 403 }
> {
  const user = await getSessionUser();
  if (!user) return { ok: false, status: 401 };
  if (!isAdminEmail(user.email)) return { ok: false, status: 403 };
  return { ok: true, email: (user.email as string).trim().toLowerCase() };
}
