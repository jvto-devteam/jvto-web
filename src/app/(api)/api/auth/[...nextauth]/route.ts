import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"; // <--- IMPORT INI
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Fix BigInt
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    // --- TAMBAHAN EMAIL PROVIDER ---
    //
    // SECURITY — six open nodemailer advisories are unreachable through THIS
    // configuration, and this block is what keeps them that way. Verified
    // 2026-09-03 at the call site (node_modules/next-auth/providers/email.js),
    // where the default sendVerificationRequest passes sendMail exactly five
    // fields: to, from, subject, text, html.
    //
    //   GHSA-p6gq-j5cr-w38f  high    needs a message-level `raw` option
    //   GHSA-r7g4-qg5f-qqm2  medium  needs SMTP auth `type: "OAuth2"`
    //   GHSA-268h-hp4c-crq3  medium  needs `List-*` header comments
    //   GHSA-wqvq-jvpq-h66f  medium  needs `jsonTransport`
    //   GHSA-vvjj-xcjg-gr5g  medium  needs a transport `name` option
    //   GHSA-c7w3-x93f-qmm8  low     needs `envelope.size`
    //
    // Three changes here would re-open all six at once: supplying a custom
    // sendVerificationRequest, switching this `auth` to OAuth2, or adding a
    // `name` to the transport options below. There is no patched nodemailer
    // inside ^7 and next-auth@4 declares nodemailer ^7.0.7 as a peer, so the
    // exposure cannot be closed by upgrading — only by not reaching it.
    // Details and the version constraints: DEPENDABOT_NODEMAILER_UNREACHABLE
    // in STATUS.yaml.
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
  // Opsional: Custom halaman verify request jika mau
  // pages: {
  //   verifyRequest: '/auth/verify-request', 
  // },
});

export { handler as GET, handler as POST };