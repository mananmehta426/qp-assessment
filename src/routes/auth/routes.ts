import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance, FastifyReply } from 'fastify';
import { SignUpRequest, signUpResponse, signupSchema } from './validators/signup';
import { LoginRequest, loginResponse, loginSchema } from './validators/login';

const authRoutesPlugin: FastifyPluginAsyncJsonSchemaToTs = async function (
	fastify: FastifyInstance,
) {
	fastify.post(
		'/signup',
		{
			schema: {
				body: signupSchema,
				response: {
          200: signUpResponse,
				},
			},
		},
		async (request) => {
			const signupRequest = request.body as SignUpRequest;
			const data = await fastify.authService.signup(
				signupRequest.email,
        signupRequest.password,
        signupRequest.role
			);

			return data;
		},
	);
	fastify.post(
		'/login',
		{
			schema: {
				body: loginSchema,
				response: {
          200: loginResponse,
				},
			},
		},
		async (request, reply) => {
			const loginRequest = request.body as LoginRequest;
			const data = await fastify.authService.login(
				loginRequest.email,
        loginRequest.password,
				reply
			);

			return data;
		},
	);

	fastify.get(
		'/logout',
		async (request, reply: FastifyReply) => {
			reply.clearCookie('token');
			reply.send({ message: 'Logout successful' });
		}
	);
};

export default authRoutesPlugin;