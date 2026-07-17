import type { FastifyRequest, FastifyReply } from "fastify";
import * as statsService from "./stats.service";

const handleError = (error: unknown, reply: FastifyReply) => {
  if (error instanceof Error) {
    if (error.message === "NO_SHIELDS_AVAILABLE") {
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "No shields available",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const getStatsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const stats = await statsService.getStats(request.user.userId);
    return reply.status(200).send(stats);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const useShieldHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const stats = await statsService.useShield(request.user.userId);
    return reply.status(200).send(stats);
  } catch (error) {
    return handleError(error, reply);
  }
};