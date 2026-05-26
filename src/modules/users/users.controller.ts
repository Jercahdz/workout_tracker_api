import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import * as usersService from "./users.service";
import { updateUserSchema } from "./users.schema";

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
    if (error.message === "USER_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "User not found",
      });
    }

    if (error.message === "EMAIL_TAKEN") {
      return reply.status(409).send({
        statusCode: 409,
        error: "Conflict",
        message: "Email already in use",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const getMeHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = await usersService.getMe(request.user.userId);
    return reply.status(200).send(user);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const updateMeHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = updateUserSchema.parse(request.body);
    const user = await usersService.updateMe(request.user.userId, input);
    return reply.status(200).send(user);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const deleteMeHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await usersService.deleteMe(request.user.userId);
    return reply.status(204).send();
  } catch (error) {
    return handleError(error, reply);
  }
};