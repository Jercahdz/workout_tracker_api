import { prisma } from "../../shared/utils/prisma";
import { parsePagination, buildPaginatedResponse } from "../../shared/utils/pagination";
import type { CreateProgressInput } from "./progress.schema";
import { UnitSystem } from "@prisma/client";

export const getAllProgress = async (userId: string, query: { page?: unknown; limit?: unknown }) => {
  const params = parsePagination(query);
  const skip = (params.page - 1) * params.limit;

  const [progress, total] = await Promise.all([
    prisma.progress.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip,
      take: params.limit,
    }),
    prisma.progress.count({ where: { userId } }),
  ]);

  return buildPaginatedResponse(progress, total, params);
};

export const logProgress = async (
  userId: string,
  input: CreateProgressInput
) => {
  let unitSystem: UnitSystem = UnitSystem.METRIC;

  if (!input.unitSystem) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { unitSystem: true },
    });
    unitSystem = profile?.unitSystem ?? UnitSystem.METRIC;
  } else {
    unitSystem = input.unitSystem;
  }

  return prisma.progress.create({
    data: {
      userId,
      weight: input.weight,
      date: input.date ? new Date(input.date) : new Date(),
      notes: input.notes,
      unitSystem,
    },
  });
};