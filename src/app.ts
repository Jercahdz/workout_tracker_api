import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { profileRoutes } from "./modules/profile/profile.routes";
import { exercisesRoutes } from "./modules/exercises/exercises.routes";
import { workoutsRoutes } from "./modules/workouts/workouts.routes";
import { sessionsRoutes } from "./modules/sessions/sessions.routes";
import { progressRoutes } from "./modules/progress/progress.routes";
import { aiRoutes } from "./modules/ai/ai.routes";
import { statsRoutes } from "./modules/stats/stats.routes";
import { achievementsRoutes } from "./modules/achievements/achievements.routes";

export const buildApp = async () => {
  const app = Fastify({
    logger: env.nodeEnv === "development",
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Workout Tracker API",
        description: "REST API for workout management with AI-powered routine generation",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });

  await app.register(cors, { origin: true });
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  await app.register(authRoutes);
  await app.register(usersRoutes);
  await app.register(profileRoutes);
  await app.register(exercisesRoutes);
  await app.register(workoutsRoutes);
  await app.register(sessionsRoutes);
  await app.register(progressRoutes);
  await app.register(aiRoutes);
  await app.register(statsRoutes);
  await app.register(achievementsRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  return app;
};