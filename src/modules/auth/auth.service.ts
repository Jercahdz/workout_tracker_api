import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/utils/prisma";
import { env } from "../../config/env";
import type { RegisterInput, LoginInput } from "./auth.schema";

const SALT_ROUNDS = 12;

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, env.jwtSecret as jwt.Secret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign({ userId }, env.jwtRefreshSecret as jwt.Secret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
  });

  return { accessToken, refreshToken };
};

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
    },
  });

  return generateTokens(user.id, user.role);
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatch = await bcrypt.compare(input.password, user.password);

  if (!passwordMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return generateTokens(user.id, user.role);
};

export const refresh = async (refreshToken: string) => {
  const blacklisted = await prisma.blacklistedToken.findFirst({
    where: { token: refreshToken },
  });

  if (blacklisted) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return generateTokens(user.id, user.role);
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }
};

export const logout = async (refreshToken: string) => {
  await prisma.blacklistedToken.create({
    data: { token: refreshToken },
  });
};