import { buildApp } from "./app";
import { env } from "./config/env";

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({ port: env.port, host: "0.0.0.0" });
    console.log(`Server running on port ${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();