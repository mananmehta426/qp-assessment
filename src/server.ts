import { join } from 'node:path';
import Fastify, { FastifyError } from 'fastify';
import AutoLoad from '@fastify/autoload';
import fastifyCookie from '@fastify/cookie';

const fastify = Fastify({
  logger: true
})

fastify.addHook('preHandler', (req, res, next) => {
  // here we are
  req.jwt = fastify.jwt
  return next()
})

void fastify.register(fastifyCookie, {
  secret: "my-secret",
  parseOptions: {},
});

void fastify.register(AutoLoad, {
  dir: join(__dirname, 'schemas'),
})

void fastify.register(AutoLoad, {
	dir: join(__dirname, 'plugins'),
});

fastify.register(AutoLoad, {
	dir: join(__dirname, 'routes'),
	autoHooks: true,
});


process.on('SIGINT', () => {
	fastify.close(async () => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	fastify.close(async () => {
		process.exit(1);
	});
});

fastify.listen({ host: '0.0.0.0', port: 3010 }).catch((error: FastifyError) => {
	fastify.log.error(error);
	process.exit(1);
});

export { fastify };
