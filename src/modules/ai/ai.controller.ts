import type { FastifyRequest, FastifyReply } from "fastify";
import * as aiService from "./ai.service";

const handleError = (error: unknown, reply: FastifyReply) => {
  if (error instanceof Error) {
    if (error.message === "PROFILE_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "You need to create a profile before generating a routine",
      });
    }

    if (error.message === "OLLAMA_ERROR") {
      return reply.status(503).send({
        statusCode: 503,
        error: "Service Unavailable",
        message: "AI service is currently unavailable",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const generateRoutineHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const routine = await aiService.generateRoutine(request.user.userId);
    return reply.status(200).send({ routine });
  } catch (error) {
    return handleError(error, reply);
  }
};