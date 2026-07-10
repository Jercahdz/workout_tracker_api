import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import * as progressService from "./progress.service";
import { createProgressSchema } from "./progress.schema";

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

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const getAllProgressHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const progress = await progressService.getAllProgress(
      request.user.userId,
      request.query as { page?: string; limit?: string }
    );
    return reply.status(200).send(progress);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const logProgressHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = createProgressSchema.parse(request.body);
    const progress = await progressService.logProgress(
      request.user.userId,
      input
    );
    return reply.status(201).send(progress);
  } catch (error) {
    return handleError(error, reply);
  }
};