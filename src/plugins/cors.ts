import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import EnvSchema from "schemas/dotenv";

declare module "fastify" {
  interface FastifyInstance {
    secrets: EnvSchema;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyCors, {
    origin: false,
  });
});
