import type { FastifyInstance } from "fastify";
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
} from "./auth.controller";

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/auth/register", registerHandler);
  app.post("/auth/login", loginHandler);
  app.post("/auth/refresh", refreshHandler);
  app.post("/auth/logout", logoutHandler);
};