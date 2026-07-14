import { z } from "zod";
import { UnitSystem } from "@prisma/client";

export const createProgressSchema = z.object({
  weight: z.number().positive(),
  date: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  unitSystem: z.nativeEnum(UnitSystem).optional(),
});

export type CreateProgressInput = z.infer<typeof createProgressSchema>;