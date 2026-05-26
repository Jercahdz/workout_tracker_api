import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";

export const buildApp = async () => {
  const app = Fastify({
    logger: env.nodeEnv === "development",
  });

  await app.register(cors, { origin: true });
  await app.register(helmet);
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  await app.register(authRoutes);
  await app.register(usersRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  return app;
};