import { prisma } from "../../shared/utils/prisma";
import { parsePagination, buildPaginatedResponse } from "../../shared/utils/pagination";
import type { CreateExerciseInput, UpdateExerciseInput } from "./exercises.schema";

export const getAllExercises = async (query: { page?: unknown; limit?: unknown }) => {
  const params = parsePagination(query);
  const skip = (params.page - 1) * params.limit;

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      orderBy: { name: "asc" },
      skip,
      take: params.limit,
    }),
    prisma.exercise.count(),
  ]);

  return buildPaginatedResponse(exercises, total, params);
};

export const getExerciseById = async (id: string) => {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!exercise) {
    throw new Error("EXERCISE_NOT_FOUND");
  }

  return exercise;
};

export const createExercise = async (input: CreateExerciseInput) => {
  const existing = await prisma.exercise.findUnique({
    where: { name: input.name },
  });

  if (existing) {
    throw new Error("EXERCISE_NAME_TAKEN");
  }

  return prisma.exercise.create({
    data: input,
  });
};

export const updateExercise = async (id: string, input: UpdateExerciseInput) => {
  const existing = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("EXERCISE_NOT_FOUND");
  }

  if (input.name && input.name !== existing.name) {
    const nameTaken = await prisma.exercise.findUnique({
      where: { name: input.name },
    });

    if (nameTaken) {
      throw new Error("EXERCISE_NAME_TAKEN");
    }
  }

  return prisma.exercise.update({
    where: { id },
    data: input,
  });
};

export const deleteExercise = async (id: string) => {
  const existing = await prisma.exercise.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("EXERCISE_NOT_FOUND");
  }

  await prisma.exercise.delete({
    where: { id },
  });
};