import { prisma } from "../../shared/utils/prisma";
import type { CreateExerciseInput, UpdateExerciseInput } from "./exercises.schema";

export const getAllExercises = async () => {
  return prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });
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