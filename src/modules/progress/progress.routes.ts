import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getAllProgressHandler, logProgressHandler } from "./progress.controller";

export const progressRoutes = async (app: FastifyInstance) => {
  app.get("/progress", { preHandler: [authenticate] }, getAllProgressHandler);
  app.post("/progress/log", { preHandler: [authenticate] }, logProgressHandler);
};