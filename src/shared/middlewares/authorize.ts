import type { FastifyRequest, FastifyReply } from "fastify";
import type { Role } from "@prisma/client";

export const authorize = (roles: Role[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user?.role as Role;

    if (!userRole || !roles.includes(userRole)) {
      return reply.status(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "You do not have permission to access this resource",
      });
    }
  };
};