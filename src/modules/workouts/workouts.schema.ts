import { z } from "zod";

const workoutExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().positive().optional(),
});

export const createWorkoutSchema = z.object({
  name: z.string().min(2).max(100),
  scheduledAt: z.string().datetime().optional(),
  exercises: z.array(workoutExerciseSchema).min(1),
});

export const updateWorkoutSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  scheduledAt: z.string().datetime().optional(),
  exercises: z.array(workoutExerciseSchema).min(1).optional(),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;