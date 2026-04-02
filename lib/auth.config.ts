import type { NextAuthConfig } from "next-auth";

/**
 * Auth.js config that does NOT import Prisma.
 * Safe to use in middleware (Edge runtime).
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = session.user as any;
        user.id = token.sub;
        user.tenantId = token.tenantId;
        user.role = token.role;
      }
      return session;
    },
  },
};
