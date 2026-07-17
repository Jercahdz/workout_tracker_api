import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getAchievementsHandler } from "./achievements.controller";

export const achievementsRoutes = async (app: FastifyInstance) => {
  app.get("/achievements", {
    schema: {
      tags: ["Achievements"],
      summary: "Get all achievements and user progress",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
  }, getAchievementsHandler);
};