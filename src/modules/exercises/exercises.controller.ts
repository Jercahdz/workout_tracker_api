import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import * as exercisesService from "./exercises.service";
import { createExerciseSchema, updateExerciseSchema } from "./exercises.schema";

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
    if (error.message === "EXERCISE_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Exercise not found",
      });
    }

    if (error.message === "EXERCISE_NAME_TAKEN") {
      return reply.status(409).send({
        statusCode: 409,
        error: "Conflict",
        message: "An exercise with that name already exists",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const getAllExercisesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const exercises = await exercisesService.getAllExercises(request.query as { page?: string; limit?: string });
    return reply.status(200).send(exercises);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const getExerciseByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const exercise = await exercisesService.getExerciseById(request.params.id);
    return reply.status(200).send(exercise);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const createExerciseHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = createExerciseSchema.parse(request.body);
    const exercise = await exercisesService.createExercise(input);
    return reply.status(201).send(exercise);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const updateExerciseHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const input = updateExerciseSchema.parse(request.body);
    const exercise = await exercisesService.updateExercise(
      request.params.id,
      input
    );
    return reply.status(200).send(exercise);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const deleteExerciseHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await exercisesService.deleteExercise(request.params.id);
    return reply.status(204).send();
  } catch (error) {
    return handleError(error, reply);
  }
};