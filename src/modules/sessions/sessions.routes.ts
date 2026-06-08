import type { FastifyInstance, RouteGenericInterface } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import {
  getAllSessionsHandler,
  getSessionByIdHandler,
  createSessionHandler,
} from "./sessions.controller";

interface SessionParams extends RouteGenericInterface {
  Params: { id: string };
}

export const sessionsRoutes = async (app: FastifyInstance) => {
  app.get("/sessions", { preHandler: [authenticate] }, getAllSessionsHandler);
  app.get<SessionParams>("/sessions/:id", { preHandler: [authenticate] }, getSessionByIdHandler);
  app.post("/sessions", { preHandler: [authenticate] }, createSessionHandler);
};