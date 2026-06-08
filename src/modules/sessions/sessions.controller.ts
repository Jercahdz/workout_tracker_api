import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import * as sessionsService from "./sessions.service";
import { createSessionSchema } from "./sessions.schema";

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
    if (error.message === "SESSION_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Session not found",
      });
    }

    if (error.message === "WORKOUT_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Workout not found",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const getAllSessionsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const sessions = await sessionsService.getAllSessions(request.user.userId);
    return reply.status(200).send(sessions);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const getSessionByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const session = await sessionsService.getSessionById(
      request.params.id,
      request.user.userId
    );
    return reply.status(200).send(session);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const createSessionHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = createSessionSchema.parse(request.body);
    const session = await sessionsService.createSession(
      request.user.userId,
      input
    );
    return reply.status(201).send(session);
  } catch (error) {
    return handleError(error, reply);
  }
};