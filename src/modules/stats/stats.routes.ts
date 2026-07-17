import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getStatsHandler, useShieldHandler } from "./stats.controller";

export const statsRoutes = async (app: FastifyInstance) => {
  app.get("/stats", {
    schema: {
      tags: ["Stats"],
      summary: "Get user stats, streak and level",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
  }, getStatsHandler);

  app.post("/stats/use-shield", {
    schema: {
      tags: ["Stats"],
      summary: "Use a shield to protect streak",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
  }, useShieldHandler);
};