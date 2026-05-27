import { z } from "zod";
import { MuscleGroup } from "@prisma/client";

export const createExerciseSchema = z.object({
  name: z.string().min(2).max(100),
  muscleGroup: z.nativeEnum(MuscleGroup),
  equipment: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;