import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getMeHandler, updateMeHandler, deleteMeHandler } from "./users.controller";

export const usersRoutes = async (app: FastifyInstance) => {
  app.get("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Get current user",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            createdAt: { type: "string" },
          },
        },
      },
    },
    preHandler: [authenticate],
  }, getMeHandler);

  app.put("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Update current user",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            createdAt: { type: "string" },
          },
        },
      },
    },
    preHandler: [authenticate],
  }, updateMeHandler);

  app.delete("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Delete current user",
      security: [{ bearerAuth: [] }],
      response: {
        204: { type: "null" },
      },
    },
    preHandler: [authenticate],
  }, deleteMeHandler);
};