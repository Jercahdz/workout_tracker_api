import { z } from "zod";

export const createProgressSchema = z.object({
  weight: z.number().positive(),
  date: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateProgressInput = z.infer<typeof createProgressSchema>;