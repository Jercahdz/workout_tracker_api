import { z } from "zod";

export const createSessionSchema = z.object({
  workoutId: z.string().uuid(),
  completedAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;