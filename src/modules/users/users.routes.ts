import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getMeHandler, updateMeHandler, deleteMeHandler } from "./users.controller";

export const usersRoutes = async (app: FastifyInstance) => {
  app.get("/users/me", { preHandler: [authenticate] }, getMeHandler);
  app.put("/users/me", { preHandler: [authenticate] }, updateMeHandler);
  app.delete("/users/me", { preHandler: [authenticate] }, deleteMeHandler);
};