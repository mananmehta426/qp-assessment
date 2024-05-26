import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify/types/instance';
import { FastifyReply } from 'fastify/types/reply';
import prisma from '../../utils/prisma';
import { Role } from 'enums/role';
import crypto from 'crypto';
import { SignUpResponse } from './validators/signup';
import { LoginResponse } from './validators/login';

declare module 'fastify' {
  type authService = {
    signup: (
      email: string,
      password: string,
      role: Role,
    ) => Promise<SignUpResponse>;

    login: (
      email: string,
      password: string,
      reply: FastifyReply
    ) => Promise<LoginResponse>;
  };

  interface FastifyInstance {
    authService: authService;
  }
}

export default fp(
  async function authAutoHooks(fastify: FastifyInstance) {
    fastify.decorate('authService', {
      async signup(
        email: string,
        password: string,
        role: Role,
      ): Promise<SignUpResponse> {
        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });
        if (existingUser) {
          throw fastify.httpErrors.badRequest('Email already in use');
        }
        const salt = crypto.randomBytes(16).toString('hex');

        const hash = crypto
          .pbkdf2Sync(
            password,
            salt,
            fastify.secrets.SALT_ROUNDS,
            fastify.secrets.KEY_LEN,
            fastify.secrets.DIGEST,
          )
          .toString('hex');
        const user = await prisma.user.create({
          data: {
            email: email,
            password: hash,
            role: role,
            salt: salt,
          },
        });
        return { message: 'User Created', userId: user.userId };
      },

      async login(
        email: string,
        password: string,
        reply: FastifyReply
      ): Promise<LoginResponse> {
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
          throw fastify.httpErrors.unauthorized('Invalid email or password');
        }

        const hash = crypto
          .pbkdf2Sync(
            password,
            user.salt,
            fastify.secrets.SALT_ROUNDS,
            fastify.secrets.KEY_LEN,
            fastify.secrets.DIGEST,
          )
          .toString('hex');

        if (hash !== user.password) {
          throw fastify.httpErrors.unauthorized('Invalid email or password');
        }

        const token = fastify.jwt.sign(
          { userId: user.userId, email: user.email, role: user.role },
        );

        reply.setCookie('token', token, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60,
        });

        return { message: 'Sign in successful' };
      },
    });
  },
  {
    name: 'authAutoHooks',
    encapsulate: true,
  },
);
