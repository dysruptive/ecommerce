import "next-auth";

declare module "next-auth" {
  interface User {
    tenantId: string | null;
    role: "OWNER" | "STAFF" | "PLATFORM_ADMIN";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      tenantId: string | null;
      role: "OWNER" | "STAFF" | "PLATFORM_ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string | null;
    role?: "OWNER" | "STAFF" | "PLATFORM_ADMIN";
  }
}
