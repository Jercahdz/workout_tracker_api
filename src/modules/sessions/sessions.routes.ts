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
  app.get("/sessions", {
    schema: {
      tags: ["Sessions"],
      summary: "List completed sessions",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
  }, getAllSessionsHandler);

  app.get<SessionParams>("/sessions/:id", {
    schema: {
      tags: ["Sessions"],
      summary: "Get session by id",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string" } },
      },
    },
    preHandler: [authenticate],
  }, getSessionByIdHandler);

  app.post("/sessions", {
    schema: {
      tags: ["Sessions"],
      summary: "Log a completed session",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["workoutId"],
        properties: {
          workoutId: { type: "string" },
          completedAt: { type: "string", format: "date-time" },
          notes: { type: "string" },
        },
      },
    },
    preHandler: [authenticate],
  }, createSessionHandler);
};