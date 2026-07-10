import type { FastifyInstance, RouteGenericInterface } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { authorize } from "../../shared/middlewares/authorize";
import {
  getAllExercisesHandler,
  getExerciseByIdHandler,
  createExerciseHandler,
  updateExerciseHandler,
  deleteExerciseHandler,
} from "./exercises.controller";

interface ExerciseParams extends RouteGenericInterface {
  Params: { id: string };
}

export const exercisesRoutes = async (app: FastifyInstance) => {
  const exerciseResponse = {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      muscleGroup: { type: "string" },
      equipment: { type: "string" },
      description: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
  };

  const exerciseBody = {
    type: "object",
    properties: {
      name: { type: "string" },
      muscleGroup: { type: "string", enum: ["CHEST", "BACK", "SHOULDERS", "ARMS", "LEGS", "CORE", "FULL_BODY"] },
      equipment: { type: "string" },
      description: { type: "string" },
    },
  };

  app.get("/exercises", {
    schema: {
      tags: ["Exercises"],
      summary: "List all exercises",
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
  }, getAllExercisesHandler as any);

  app.get<ExerciseParams>("/exercises/:id", {
    schema: {
      tags: ["Exercises"],
      summary: "Get exercise by id",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string" } },
      },
      response: { 200: exerciseResponse },
    },
    preHandler: [authenticate],
  }, getExerciseByIdHandler);

  app.post("/exercises", {
    schema: {
      tags: ["Exercises"],
      summary: "Create exercise (Admin only)",
      security: [{ bearerAuth: [] }],
      body: { ...exerciseBody, required: ["name", "muscleGroup"] },
      response: { 201: exerciseResponse },
    },
    preHandler: [authenticate, authorize(["ADMIN"])],
  }, createExerciseHandler);

  app.put<ExerciseParams>("/exercises/:id", {
    schema: {
      tags: ["Exercises"],
      summary: "Update exercise (Admin only)",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string" } },
      },
      body: exerciseBody,
      response: { 200: exerciseResponse },
    },
    preHandler: [authenticate, authorize(["ADMIN"])],
  }, updateExerciseHandler);

  app.delete<ExerciseParams>("/exercises/:id", {
    schema: {
      tags: ["Exercises"],
      summary: "Delete exercise (Admin only)",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string" } },
      },
      response: { 204: { type: "null" } },
    },
    preHandler: [authenticate, authorize(["ADMIN"])],
  }, deleteExerciseHandler);
};