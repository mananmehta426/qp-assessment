import fp from 'fastify-plugin';
import fastifyJwt, { FastifyJWTOptions, JWT } from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify/types/reply';
import { Role } from 'enums/role';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
    user: UserPayload;
  }

  export interface FastifyInstance {
    authenticate: any;
  }
}

type UserPayload = {
  userId: number;
  email: string;
  role: Role;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload;
  }
}

const adminRoutes = ['/admin'];
const userRoutes = ['/user'];

export default fp(
  async (fastify: FastifyInstance) => {
    const fastifyJwtOptions: FastifyJWTOptions = {
      secret: fastify.secrets.JWT_SECRET,
    };

    fastify.register(fastifyJwt, fastifyJwtOptions);

    fastify.decorate(
      'authenticate',
      async function authenticate(
        request: FastifyRequest,
        reply: FastifyReply,
      ): Promise<void> {
        try {
          const token = request.cookies.token;

          if (!token) {
            reply.unauthorized('Authentication required');
            return;
          }

          const decoded = request.jwt.verify<UserPayload>(token);
          request.user = decoded;
        } catch (error: any) {
          fastify.log.error('Error verifying token:', error);
          if (error.message === 'Not Authorized') {
            reply.unauthorized(error.message);
          } else {
            reply.internalServerError('Error verifying JWT');
          }
          return;
        }
      },
    );

    fastify.addHook(
      'preHandler',
      async (request: FastifyRequest, reply: FastifyReply) => {
        if (
          request.url.includes('/auth/login') ||
          request.url.includes('/auth/signup')
        ) {
          return;
        }

        await fastify.authenticate(request, reply);

        if (reply.sent) {
          return;  // Ensure no further processing if reply has been sent
        }

        if (!request.user) {
          fastify.log.info('User is not authenticated');
          reply.unauthorized('You need to be logged in to access this resource');
          return;
        }

        const isAdminRoute = adminRoutes.some((prefix) =>
          request.url.startsWith(prefix),
        );
        const isUserRoute = userRoutes.some((prefix) =>
          request.url.startsWith(prefix),
        );

        if (isAdminRoute && request.user.role === Role.USER) {
          fastify.log.info('Insufficient permissions for admin route');
          reply.forbidden('Insufficient permissions for admin route');
          return;
        } else if (isUserRoute && request.user.role === Role.ADMIN) {
          fastify.log.info('Insufficient permissions for user route');
          reply.forbidden('Insufficient permissions for user route');
          return;
        }
      },
    );
  },
  {
    name: 'authentication-plugin',
    dependencies: ['application-config'],
  },
);
