import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../shared/utils/prisma";

export const getAchievementsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const allAchievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: request.user.userId },
      include: { achievement: true },
    });

    const unlockedIds = new Set(userAchievements.map((a) => a.achievementId));

    const result = allAchievements.map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
      unlockedAt: userAchievements.find((a) => a.achievementId === achievement.id)?.unlockedAt ?? null,
    }));

    return reply.status(200).send(result);
  } catch {
    return reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};