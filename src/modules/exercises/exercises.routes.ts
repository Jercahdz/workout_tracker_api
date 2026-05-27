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
  app.get("/exercises", { preHandler: [authenticate] }, getAllExercisesHandler);
  app.get<ExerciseParams>("/exercises/:id", { preHandler: [authenticate] }, getExerciseByIdHandler);
  app.post("/exercises", { preHandler: [authenticate, authorize(["ADMIN"])] }, createExerciseHandler);
  app.put<ExerciseParams>("/exercises/:id", { preHandler: [authenticate, authorize(["ADMIN"])] }, updateExerciseHandler);
  app.delete<ExerciseParams>("/exercises/:id", { preHandler: [authenticate, authorize(["ADMIN"])] }, deleteExerciseHandler);
};