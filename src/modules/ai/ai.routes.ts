import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { generateRoutineHandler } from "./ai.controller";

export const aiRoutes = async (app: FastifyInstance) => {
  app.post("/ai/generate-routine", { preHandler: [authenticate] }, generateRoutineHandler);
};