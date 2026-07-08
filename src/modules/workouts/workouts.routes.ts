import type { FastifyInstance, RouteGenericInterface } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import {
  getAllWorkoutsHandler,
  getWorkoutByIdHandler,
  createWorkoutHandler,
  updateWorkoutHandler,
  deleteWorkoutHandler,
} from "./workouts.controller";

interface WorkoutParams extends RouteGenericInterface {
  Params: { id: string };
}

export const workoutsRoutes = async (app: FastifyInstance) => {
  const workoutExerciseSchema = {
    type: "object",
    properties: {
      exerciseId: { type: "string" },
      sets: { type: "number" },
      reps: { type: "number" },
      weight: { type: "number" },
    },
  };

  const workoutBody = {
    type: "object",
    properties: {
      name: { type: "string" },
      scheduledAt: { type: "string", format: "date-time" },
      exercises: { type: "array", items: workoutExerciseSchema },
    },
  };

  app.get("/workouts", {
    schema: {
      tags: ["Workouts"],
      summary: "List user workouts",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticate],
  }, getAllWorkoutsHandler);

  app.get<WorkoutParams>("/workouts/:id", {
    schema: {
      tags: ["Workouts"],
      summary: "Get workout by id",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string" } },
      },
    },
    preHandler: [authenticate],
  }, getWorkoutByIdHandler);

  app.post("/workouts", {
    schema: {
      tags: ["Workouts"],
      summary: "Create workout",
      security: [{ bearerAuth: [] }],
      body: { ...workoutBody, required: ["name", "exercises"] },
    },
    preHandler: [authenticate],
  }, createWorkoutHandler);

  app.put<WorkoutParams>("/workouts/:id", {
    schema: {
      tags: ["Workouts"],
      summary: "Update workout",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string" } },
      },
      body: workoutBody,
    },
    preHandler: [authenticate],
  }, updateWorkoutHandler);

  app.delete<WorkoutParams>("/workouts/:id", {
    schema: {
      tags: ["Workouts"],
      summary: "Delete workout",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { id: { type: "string" } },
      },
      response: { 204: { type: "null" } },
    },
    preHandler: [authenticate],
  }, deleteWorkoutHandler);
};