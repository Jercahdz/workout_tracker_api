import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import * as workoutsService from "./workouts.service";
import { createWorkoutSchema, updateWorkoutSchema } from "./workouts.schema";

const handleError = (error: unknown, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Validation Error",
      messages: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Error) {
    if (error.message === "WORKOUT_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Workout not found",
      });
    }

    if (error.message === "EXERCISE_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "One or more exercises not found",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const getAllWorkoutsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const workouts = await workoutsService.getAllWorkouts(
      request.user.userId,
      request.query as { page?: string; limit?: string }
    );
    return reply.status(200).send(workouts);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const getWorkoutByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const workout = await workoutsService.getWorkoutById(
      request.params.id,
      request.user.userId
    );
    return reply.status(200).send(workout);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const createWorkoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = createWorkoutSchema.parse(request.body);
    const workout = await workoutsService.createWorkout(
      request.user.userId,
      input
    );
    return reply.status(201).send(workout);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const updateWorkoutHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const input = updateWorkoutSchema.parse(request.body);
    const workout = await workoutsService.updateWorkout(
      request.params.id,
      request.user.userId,
      input
    );
    return reply.status(200).send(workout);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const deleteWorkoutHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await workoutsService.deleteWorkout(request.params.id, request.user.userId);
    return reply.status(204).send();
  } catch (error) {
    return handleError(error, reply);
  }
};