import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import * as authService from "./auth.service";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";

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
    if (error.message === "EMAIL_TAKEN") {
      return reply.status(409).send({
        statusCode: 409,
        error: "Conflict",
        message: "Email already in use",
      });
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    if (error.message === "INVALID_REFRESH_TOKEN") {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid or expired refresh token",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const registerHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = registerSchema.parse(request.body);
    const tokens = await authService.register(input);
    return reply.status(201).send(tokens);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const loginHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = loginSchema.parse(request.body);
    const tokens = await authService.login(input);
    return reply.status(200).send(tokens);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const refreshHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = refreshSchema.parse(request.body);
    const tokens = await authService.refresh(input.refreshToken);
    return reply.status(200).send(tokens);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const logoutHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.status(200).send({ message: "Logged out successfully" });
};