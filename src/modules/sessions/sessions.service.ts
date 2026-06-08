import { prisma } from "../../shared/utils/prisma";
import type { CreateSessionInput } from "./sessions.schema";

export const getAllSessions = async (userId: string) => {
  return prisma.session.findMany({
    where: { userId },
    include: {
      workout: {
        include: {
          workoutExercises: {
            include: { exercise: true },
          },
        },
      },
    },
    orderBy: { completedAt: "desc" },
  });
};

export const getSessionById = async (id: string, userId: string) => {
  const session = await prisma.session.findFirst({
    where: { id, userId },
    include: {
      workout: {
        include: {
          workoutExercises: {
            include: { exercise: true },
          },
        },
      },
    },
  });

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  return session;
};

export const createSession = async (
  userId: string,
  input: CreateSessionInput
) => {
  const workout = await prisma.workout.findFirst({
    where: { id: input.workoutId, userId },
  });

  if (!workout) {
    throw new Error("WORKOUT_NOT_FOUND");
  }

  return prisma.session.create({
    data: {
      userId,
      workoutId: input.workoutId,
      completedAt: input.completedAt ? new Date(input.completedAt) : new Date(),
      notes: input.notes,
    },
    include: {
      workout: {
        include: {
          workoutExercises: {
            include: { exercise: true },
          },
        },
      },
    },
  });
};