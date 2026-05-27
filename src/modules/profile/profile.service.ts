import { prisma } from "../../shared/utils/prisma";
import type { CreateProfileInput, UpdateProfileInput } from "./profile.schema";

export const getProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return profile;
};

export const createProfile = async (
  userId: string,
  input: CreateProfileInput
) => {
  const existing = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("PROFILE_ALREADY_EXISTS");
  }

  return prisma.profile.create({
    data: { userId, ...input },
  });
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const existing = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  return prisma.profile.update({
    where: { userId },
    data: input,
  });
};