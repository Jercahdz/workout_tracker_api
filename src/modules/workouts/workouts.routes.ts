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
  app.get("/workouts", { preHandler: [authenticate] }, getAllWorkoutsHandler);
  app.get<WorkoutParams>("/workouts/:id", { preHandler: [authenticate] }, getWorkoutByIdHandler);
  app.post("/workouts", { preHandler: [authenticate] }, createWorkoutHandler);
  app.put<WorkoutParams>("/workouts/:id", { preHandler: [authenticate] }, updateWorkoutHandler);
  app.delete<WorkoutParams>("/workouts/:id", { preHandler: [authenticate] }, deleteWorkoutHandler);
};