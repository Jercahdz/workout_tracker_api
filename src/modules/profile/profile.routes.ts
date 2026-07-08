import type { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import {
  getProfileHandler,
  createProfileHandler,
  updateProfileHandler,
} from "./profile.controller";

export const profileRoutes = async (app: FastifyInstance) => {
  const profileResponse = {
    type: "object",
    properties: {
      id: { type: "string" },
      userId: { type: "string" },
      age: { type: "number" },
      weight: { type: "number" },
      height: { type: "number" },
      goal: { type: "string" },
      level: { type: "string" },
      unitSystem: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
  };

  const profileBody = {
    type: "object",
    properties: {
      age: { type: "number" },
      weight: { type: "number" },
      height: { type: "number" },
      goal: { type: "string", enum: ["LOSE_WEIGHT", "GAIN_MUSCLE", "MAINTAIN", "IMPROVE_ENDURANCE"] },
      level: { type: "string", enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] },
      unitSystem: { type: "string", enum: ["METRIC", "IMPERIAL"] },
    },
  };

  app.get("/profile", {
    schema: {
      tags: ["Profile"],
      summary: "Get fitness profile",
      security: [{ bearerAuth: [] }],
      response: { 200: profileResponse },
    },
    preHandler: [authenticate],
  }, getProfileHandler);

  app.post("/profile", {
    schema: {
      tags: ["Profile"],
      summary: "Create fitness profile",
      security: [{ bearerAuth: [] }],
      body: {
        ...profileBody,
        required: ["age", "weight", "height", "goal", "level"],
      },
      response: { 201: profileResponse },
    },
    preHandler: [authenticate],
  }, createProfileHandler);

  app.put("/profile", {
    schema: {
      tags: ["Profile"],
      summary: "Update fitness profile",
      security: [{ bearerAuth: [] }],
      body: profileBody,
      response: { 200: profileResponse },
    },
    preHandler: [authenticate],
  }, updateProfileHandler);
};