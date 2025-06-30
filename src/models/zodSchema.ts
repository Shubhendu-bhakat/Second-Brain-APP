import z from "zod";

export const userSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must not exceed 15 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^a-zA-Z0-9]/, "Password must include a special character"),
});

export type UserInput = z.infer<typeof userSchema>;