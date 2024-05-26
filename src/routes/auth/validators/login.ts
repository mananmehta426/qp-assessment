import { asConst, FromSchema } from 'json-schema-to-ts';

const loginSchema = asConst({
  type: 'object',
  $id: 'schema:users:login',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
});

const loginResponse = asConst({
  type: 'object',
  $id: 'schema:users:login:response',
  additionalProperties: false,
  required: ['message'],
  properties: {
    message: {
      type: 'string',
    },
  },
});

type LoginRequest = FromSchema<typeof loginSchema>;

type LoginResponse = FromSchema<typeof loginResponse>;

export type { LoginRequest, LoginResponse };
export { loginSchema, loginResponse };