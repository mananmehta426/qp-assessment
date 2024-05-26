import fp from 'fastify-plugin';
import { join } from 'path';
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env';
import { FastifyInstance } from 'fastify';
import { schema } from '../schemas/dotenv';

export default fp(async (fastify: FastifyInstance) => {
  const options: FastifyEnvOptions = {
    confKey: 'secrets',
    schema: schema,
    data: process.env,
    dotenv: {
      path: join(__dirname, '..', '..', '.env'),
    },
  };

  await fastify.register(fastifyEnv, options);
}, { name: 'application-config' });
