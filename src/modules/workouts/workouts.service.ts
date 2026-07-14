import { prisma } from "../../shared/utils/prisma";
import { parsePagination, buildPaginatedResponse } from "../../shared/utils/pagination";
import type { CreateWorkoutInput, UpdateWorkoutInput } from "./workouts.schema";
import { UnitSystem } from "@prisma/client";

export const getAllWorkouts = async (userId: string, query: { page?: unknown; limit?: unknown }) => {
  const params = parsePagination(query);
  const skip = (params.page - 1) * params.limit;

  const [workouts, total] = await Promise.all([
    prisma.workout.findMany({
      where: { userId },
      include: {
        workoutExercises: {
          include: { exercise: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: params.limit,
    }),
    prisma.workout.count({ where: { userId } }),
  ]);

  return buildPaginatedResponse(workouts, total, params);
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

const getUserUnitSystem = async (userId: string): Promise<UnitSystem> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { unitSystem: true },
  });
  return profile?.unitSystem ?? UnitSystem.METRIC;
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

  const unitSystem = await getUserUnitSystem(userId);

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
          unitSystem: item.unitSystem ?? unitSystem,
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

  const unitSystem = await getUserUnitSystem(userId);

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
            unitSystem: item.unitSystem ?? unitSystem,
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