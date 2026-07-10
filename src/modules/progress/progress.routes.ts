import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getAllProgressHandler, logProgressHandler } from "./progress.controller";

export const progressRoutes = async (app: FastifyInstance) => {
  app.get("/progress", {
    schema: {
      tags: ["Progress"],
      summary: "Get progress history",
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
  }, getAllProgressHandler as any);
  
  app.post("/progress/log", {
    schema: {
      tags: ["Progress"],
      summary: "Log a new progress entry",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["weight"],
        properties: {
          weight: { type: "number" },
          date: { type: "string", format: "date-time" },
          notes: { type: "string" },
        },
      },
    },
    preHandler: [authenticate],
  }, logProgressHandler);
};