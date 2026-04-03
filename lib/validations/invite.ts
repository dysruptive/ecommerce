import { z } from "zod";

export const InviteRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  token: z.string().min(1),
});

export type InviteRegisterInput = z.infer<typeof InviteRegisterSchema>;
