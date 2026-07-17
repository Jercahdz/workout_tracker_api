import { prisma } from "../../shared/utils/prisma";
import { parsePagination, buildPaginatedResponse } from "../../shared/utils/pagination";
import type { CreateSessionInput } from "./sessions.schema";
import { processSessionStats } from "../stats/stats.service";

export const getAllSessions = async (userId: string, query: { page?: unknown; limit?: unknown }) => {
  const params = parsePagination(query);
  const skip = (params.page - 1) * params.limit;

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
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
      skip,
      take: params.limit,
    }),
    prisma.session.count({ where: { userId } }),
  ]);

  return buildPaginatedResponse(sessions, total, params);
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

  const session = await prisma.session.create({
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

  await processSessionStats(userId);

  return session;
};