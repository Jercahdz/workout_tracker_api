import bcrypt from "bcrypt";
import { prisma } from "../../shared/utils/prisma";
import type { UpdateUserInput } from "./users.schema";

const SALT_ROUNDS = 12;

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const updateMe = async (userId: string, input: UpdateUserInput) => {
  const data: { email?: string; password?: string } = {};

  if (input.email) {
    const existing = await prisma.user.findFirst({
      where: { email: input.email, NOT: { id: userId } },
    });

    if (existing) {
      throw new Error("EMAIL_TAKEN");
    }

    data.email = input.email;
  }

  if (input.password) {
    data.password = await bcrypt.hash(input.password, SALT_ROUNDS);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const deleteMe = async (userId: string) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};