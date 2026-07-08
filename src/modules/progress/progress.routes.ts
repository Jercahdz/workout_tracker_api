import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getAllProgressHandler, logProgressHandler } from "./progress.controller";

export const progressRoutes = async (app: FastifyInstance) => {
  app.get("/progress", {
    schema: {
      tags: ["Progress"],
      summary: "Get progress history",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
  }, getAllProgressHandler);

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