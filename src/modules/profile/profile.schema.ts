import { z } from "zod";
import { FitnessGoal, FitnessLevel, UnitSystem } from "@prisma/client";

export const createProfileSchema = z.object({
  age: z.number().int().min(13).max(100),
  weight: z.number().positive(),
  height: z.number().positive(),
  goal: z.nativeEnum(FitnessGoal),
  level: z.nativeEnum(FitnessLevel),
  unitSystem: z.nativeEnum(UnitSystem).optional(),
});

export const updateProfileSchema = createProfileSchema.partial();

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;