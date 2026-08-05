import type { FastifyInstance, RouteGenericInterface } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import {
  getAllSessionsHandler,
  getSessionByIdHandler,
  createSessionHandler,
  getSessionsByWorkoutHandler,
} from "./sessions.controller";

interface SessionParams extends RouteGenericInterface {
  Params: { id: string };
}

interface WorkoutSessionParams extends RouteGenericInterface {
  Params: { workoutId: string };
}

export const sessionsRoutes = async (app: FastifyInstance) => {
  app.get("/sessions", {
    schema: {
      tags: ["Sessions"],
      summary: "List completed sessions",
      security: [{ bearerAuth: [] }],
      querystring: {
        type: "object",
        properties: {
          page: { type: "integer", minimum: 1, default: 1 },
          limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        },
      },
    },
    preHandler: [authenticate],
  }, getAllSessionsHandler as any);

  app.get<WorkoutSessionParams>("/sessions/workout/:workoutId", {
    schema: {
      tags: ["Sessions"],
      summary: "Get sessions by workout",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { workoutId: { type: "string" } },
      },
    },
    preHandler: [authenticate],
  }, getSessionsByWorkoutHandler);

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