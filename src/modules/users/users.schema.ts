import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;