import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import * as profileService from "./profile.service";
import { createProfileSchema, updateProfileSchema } from "./profile.schema";

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
    if (error.message === "PROFILE_NOT_FOUND") {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Profile not found",
      });
    }

    if (error.message === "PROFILE_ALREADY_EXISTS") {
      return reply.status(409).send({
        statusCode: 409,
        error: "Conflict",
        message: "Profile already exists for this user",
      });
    }
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

export const getProfileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const profile = await profileService.getProfile(request.user.userId);
    return reply.status(200).send(profile);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const createProfileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = createProfileSchema.parse(request.body);
    const profile = await profileService.createProfile(
      request.user.userId,
      input
    );
    return reply.status(201).send(profile);
  } catch (error) {
    return handleError(error, reply);
  }
};

export const updateProfileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const input = updateProfileSchema.parse(request.body);
    const profile = await profileService.updateProfile(
      request.user.userId,
      input
    );
    return reply.status(200).send(profile);
  } catch (error) {
    return handleError(error, reply);
  }
};