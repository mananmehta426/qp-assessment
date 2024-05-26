import { FastifyPluginOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

export default async function root(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  fastify.get('/', async function welcomeHandler() {
    return { root: true };
  });
}
