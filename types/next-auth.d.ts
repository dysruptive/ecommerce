import "next-auth";

declare module "next-auth" {
  interface User {
    tenantId: string;
    role: "OWNER" | "STAFF";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      tenantId: string;
      role: "OWNER" | "STAFF";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string;
    role?: "OWNER" | "STAFF";
  }
}
