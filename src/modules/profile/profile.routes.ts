import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import {
  getProfileHandler,
  createProfileHandler,
  updateProfileHandler,
} from "./profile.controller";

export const profileRoutes = async (app: FastifyInstance) => {
  app.get("/profile", { preHandler: [authenticate] }, getProfileHandler);
  app.post("/profile", { preHandler: [authenticate] }, createProfileHandler);
  app.put("/profile", { preHandler: [authenticate] }, updateProfileHandler);
};