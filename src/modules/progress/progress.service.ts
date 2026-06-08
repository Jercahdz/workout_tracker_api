import { prisma } from "../../shared/utils/prisma";
import type { CreateProgressInput } from "./progress.schema";

export const getAllProgress = async (userId: string) => {
  return prisma.progress.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};

export const logProgress = async (
  userId: string,
  input: CreateProgressInput
) => {
  return prisma.progress.create({
    data: {
      userId,
      weight: input.weight,
      date: input.date ? new Date(input.date) : new Date(),
      notes: input.notes,
    },
  });
};