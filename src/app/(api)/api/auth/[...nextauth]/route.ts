import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Fix BigInt (kept here for parity with prior route-local patch; prisma.ts also patches).
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
