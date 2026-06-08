import { prisma } from "../../shared/utils/prisma";
import type { CreateWorkoutInput, UpdateWorkoutInput } from "./workouts.schema";

export const getAllWorkouts = async (userId: string) => {
  return prisma.workout.findMany({
    where: { userId },
    include: {
      workoutExercises: {
        include: { exercise: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getWorkoutById = async (id: string, userId: string) => {
  const workout = await prisma.workout.findFirst({
    where: { id, userId },
    include: {
      workoutExercises: {
        include: { exercise: true },
      },
    },
  });

  if (!workout) {
    throw new Error("WORKOUT_NOT_FOUND");
  }

  return workout;
};

export const createWorkout = async (
  userId: string,
  input: CreateWorkoutInput
) => {
  for (const item of input.exercises) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: item.exerciseId },
    });

    if (!exercise) {
      throw new Error("EXERCISE_NOT_FOUND");
    }
  }

  return prisma.workout.create({
    data: {
      userId,
      name: input.name,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
      workoutExercises: {
        create: input.exercises.map((item) => ({
          exerciseId: item.exerciseId,
          sets: item.sets,
          reps: item.reps,
          weight: item.weight,
        })),
      },
    },
    include: {
      workoutExercises: {
        include: { exercise: true },
      },
    },
  });
};

export const updateWorkout = async (
  id: string,
  userId: string,
  input: UpdateWorkoutInput
) => {
  const existing = await prisma.workout.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("WORKOUT_NOT_FOUND");
  }

  return prisma.workout.update({
    where: { id },
    data: {
      name: input.name,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      ...(input.exercises && {
        workoutExercises: {
          deleteMany: {},
          create: input.exercises.map((item) => ({
            exerciseId: item.exerciseId,
            sets: item.sets,
            reps: item.reps,
            weight: item.weight,
          })),
        },
      }),
    },
    include: {
      workoutExercises: {
        include: { exercise: true },
      },
    },
  });
};

export const deleteWorkout = async (id: string, userId: string) => {
  const existing = await prisma.workout.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("WORKOUT_NOT_FOUND");
  }

  await prisma.workout.delete({
    where: { id },
  });
};