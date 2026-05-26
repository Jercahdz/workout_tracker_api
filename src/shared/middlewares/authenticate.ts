import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export interface JwtPayload {
  userId: string;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: JwtPayload;
  }
}

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    request.user = payload;
  } catch {
    return reply.status(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
};