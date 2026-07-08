import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { generateRoutineHandler } from "./ai.controller";

export const aiRoutes = async (app: FastifyInstance) => {
  app.post("/ai/generate-routine", {
    schema: {
      tags: ["AI"],
      summary: "Generate a personalized workout routine based on user profile",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            routine: { type: "string" },
          },
        },
      },
    },
    preHandler: [authenticate],
  }, generateRoutineHandler);
};